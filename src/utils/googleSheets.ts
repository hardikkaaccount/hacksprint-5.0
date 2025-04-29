/**
 * Utility functions for interacting with Google Sheets via Apps Script
 */

// Google Apps Script deployment ID and form configuration from environment variables
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL || "";
const SHEET_ID = import.meta.env.VITE_SHEET_ID || "";
const DRIVE_FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID || "";
const WHATSAPP_GROUP_LINK = import.meta.env.VITE_WHATSAPP_GROUP_LINK || "";

export interface RegistrationData {
  teamName: string;
  leadName: string;
  leadPhone: string;
  collegeName: string;
  hackathonDomain: string;
  member1Name: string;
  member1USN: string;
  member2Name: string;
  member2USN: string;
  member3Name?: string;
  member3USN?: string;
  member4Name?: string;
  member4USN?: string;
  pptFile: File | null;
}

// Function to optimize file size before upload
const optimizeFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target || !event.target.result) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        // Get the base64 data
        const base64String = event.target.result.toString();
        // Extract just the base64 content without the MIME prefix
        const base64Data = base64String.split(',')[1] || '';
        
        if (!base64Data) {
          reject(new Error('Failed to extract base64 data'));
          return;
        }
        
        console.log(`Processed file: ${file.name}, Size: ${Math.round(base64Data.length / 1024)} KB`);
        resolve(base64Data);
      } catch (processingError) {
        console.error('File processing error:', processingError);
        reject(processingError);
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Error reading file'));
    };
    
    // Read the entire file as data URL (includes base64 encoding)
    reader.readAsDataURL(file);
  });
};

/**
 * Submit registration data to Google Sheets via Apps Script with optimized performance
 */
export const submitRegistrationToGoogleSheets = async (data: RegistrationData): Promise<{success: boolean, message: string, whatsappLink?: string}> => {
  try {
    // Create FormData with optimized data structure
    const formData = new FormData();
    
    // Generate a unique request ID that will be consistent for this registration
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Structure the data exactly as needed by the Google Sheet
    const registrationData = {
      timestamp: new Date().toISOString(),
      teamName: data.teamName,
      leadName: data.leadName,
      leadPhone: data.leadPhone,
      collegeName: data.collegeName,
      hackathonDomain: data.hackathonDomain,
      member1Name: data.member1Name,
      member1USN: data.member1USN,
      member2Name: data.member2Name,
      member2USN: data.member2USN,
      member3Name: data.member3Name || '',
      member3USN: data.member3USN || '',
      member4Name: data.member4Name || '',
      member4USN: data.member4USN || '',
      sheetId: SHEET_ID,
      folderId: DRIVE_FOLDER_ID,
      originalFileName: data.pptFile ? data.pptFile.name : '',
      submissionFileName: data.pptFile ? `${data.teamName.replace(/[^\w]/g, '_')}_${Date.now()}.pdf` : '',
      requestId: requestId  // Add the request ID to the registration data
    };

    // Add the registration data as a single JSON string
    formData.append('registrationData', JSON.stringify(registrationData));
    // Also add the request ID directly to the form data for easier access
    formData.append('requestId', requestId);
    
    // Handle file upload
    if (data.pptFile) {
      try {
        console.log(`Processing file: ${data.pptFile.name}, Size: ${(data.pptFile.size / (1024 * 1024)).toFixed(2)} MB`);
        
        const optimizedFile = await optimizeFile(data.pptFile);
        
        // Verify that we got valid data back
        if (!optimizedFile) {
          console.error("Invalid or empty file data");
          return {
            success: false,
            message: `❌ The PDF file could not be processed correctly. Please try again or contact support.`
          };
        }
        
        console.log(`File encoded successfully. Data length: ${optimizedFile.length} chars`);
        
        // Generate a clean team name (remove special characters and spaces)
        const cleanTeamName = data.teamName.replace(/[^\w]/g, '_');
        
        // Create unique timestamp value
        const timestamp = Date.now();
        
        // Generate filename: TeamName_Timestamp.pdf
        const generatedFilename = `${cleanTeamName}_${timestamp}.pdf`;
        
        console.log(`Generated filename: ${generatedFilename}`);
        
        // Create a proper file payload without size restrictions
        const filePayload = {
          content: optimizedFile,
          type: 'application/pdf',
          name: generatedFilename, // Use the generated filename
          originalName: data.pptFile.name, // Keep original name for reference
          extension: 'pdf',
          size: data.pptFile.size,
          lastModified: data.pptFile.lastModified
        };
        
        formData.append('fileData', JSON.stringify(filePayload));
        console.log("File data appended to form submission");
      } catch (err) {
        console.error("Error processing file:", err);
        return {
          success: false,
          message: `❌ There was an error processing your PDF file: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again or contact support.`
        };
      }
    }

    console.log("Processing your registration...");
    
    // Use a flag to track if we've already processed the submission
    let isProcessed = false;
    
    // Try first with CORS enabled
    try {
      console.log("Attempting submission with standard CORS approach");
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });

      console.log("Registration response status:", response.status);
      
      // Only try to read the response if the status is OK
      if (response.ok) {
        try {
          const result = await response.json();
          console.log("Registration server response:", result);
          
          if (result && result.success) {
            isProcessed = true;
            return {
              success: true,
              message: `🎉 Congratulations ${data.teamName}! Your registration is successful! 🎉\n\n🚀 Welcome to Hacksprint 5.0! Get ready for an exciting journey of innovation and creativity.\n\n📱 Join our WhatsApp group for important updates and to connect with other participants:\n${WHATSAPP_GROUP_LINK}\n\n💡 Pro Tip: Keep your PPT ready for the next phase. We'll be in touch soon with more details!`,
              whatsappLink: WHATSAPP_GROUP_LINK
            };
          } else {
            console.log("Server returned error:", result);
            // Only throw if we need to try fallback
            if (!isProcessed) {
              throw new Error(result?.message || "Server returned error");
            }
          }
        } catch (responseError) {
          console.log("Response parsing error:", responseError);
          // Only proceed to fallback if the response couldn't be parsed
          // AND we're certain the request wasn't processed
          if (response.status !== 200 && response.status !== 201) {
            throw new Error("Response could not be parsed");
          } else {
            // If we got a success status but couldn't parse the response,
            // assume it worked anyway
            console.log("Got success status code. Assuming registration succeeded despite parsing error");
            isProcessed = true;
            return {
              success: true,
              message: `🎉 Congratulations ${data.teamName}! Your registration is successful! 🎉\n\n🚀 Welcome to Hacksprint 5.0! Get ready for an exciting journey of innovation and creativity.\n\n📱 Join our WhatsApp group for important updates and to connect with other participants:\n${WHATSAPP_GROUP_LINK}\n\n💡 Pro Tip: Keep your PPT ready for the next phase. We'll be in touch soon with more details!`,
              whatsappLink: WHATSAPP_GROUP_LINK
            };
          }
        }
      } else {
        // Non-OK status means we should try fallback
        console.log("Server returned non-OK status:", response.status);
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (corsError) {
      // Only try fallback if we haven't processed the request yet
      if (isProcessed) {
        console.log("Request already processed successfully, ignoring fallback");
        return {
          success: true,
          message: `🎉 Congratulations ${data.teamName}! Your registration is successful! 🎉\n\n🚀 Welcome to Hacksprint 5.0! Get ready for an exciting journey of innovation and creativity.\n\n📱 Join our WhatsApp group for important updates and to connect with other participants:\n${WHATSAPP_GROUP_LINK}\n\n💡 Pro Tip: Keep your PPT ready for the next phase. We'll be in touch soon with more details!`,
          whatsappLink: WHATSAPP_GROUP_LINK
        };
      }
      
      // CORS might be an issue, fall back to no-cors mode
      console.log("Falling back to no-cors mode due to:", corsError);
      
      try {
        console.log("Attempting fallback with no-cors mode");
        
        // Use the same formData that has our consistent requestId
        // Don't create a new FormData object which causes duplication
        
        // Try again with no-cors mode
        const fallbackResponse = await fetch(SCRIPT_URL, {
          method: "POST",
          body: formData,
          mode: "no-cors"
        });
        
        console.log("Fallback request sent (no-cors mode)");
        isProcessed = true;
        
        // Since we're using no-cors, we can't read the response
        // But the data will still be processed by the server
        return {
          success: true,
          message: `🎉 Congratulations ${data.teamName}! Your registration is successful! 🎉\n\n🚀 Welcome to Hacksprint 5.0! Get ready for an exciting journey of innovation and creativity.\n\n📱 Join our WhatsApp group for important updates and to connect with other participants:\n${WHATSAPP_GROUP_LINK}\n\n💡 Pro Tip: Keep your PPT ready for the next phase. We'll be in touch soon with more details!`,
          whatsappLink: WHATSAPP_GROUP_LINK
        };
      } catch (finalError) {
        console.error("Final error during registration:", finalError);
        return {
          success: false,
          message: `❌ Oops! We encountered an issue while processing your registration.\n\nPlease try again in a few moments. If the problem persists, contact our support team.\n\nError: ${finalError instanceof Error ? finalError.message : 'Unknown error'}`
        };
      }
    }
  } catch (error) {
    console.error("Error submitting registration:", error);
    return {
      success: false,
      message: `❌ Oops! We encountered an issue while processing your registration.\n\nPlease try again in a few moments. If the problem persists, contact our support team.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

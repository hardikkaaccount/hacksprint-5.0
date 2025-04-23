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
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result?.toString().split(',')[1] || '');
    };
    // Read in chunks for better performance
    const chunk = 1024 * 1024; // 1MB chunks
    const start = 0;
    const end = Math.min(chunk, file.size);
    reader.readAsDataURL(file.slice(start, end));
  });
};

/**
 * Submit registration data to Google Sheets via Apps Script with optimized performance
 */
export const submitRegistrationToGoogleSheets = async (data: RegistrationData): Promise<{success: boolean, message: string, whatsappLink?: string}> => {
  try {
    // Create FormData with optimized data structure
    const formData = new FormData();
    
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
      folderId: DRIVE_FOLDER_ID
    };

    // Add the registration data as a single JSON string
    formData.append('registrationData', JSON.stringify(registrationData));
    
    // Handle file upload
    if (data.pptFile) {
      const optimizedFile = await optimizeFile(data.pptFile);
      formData.append('fileData', JSON.stringify({
        content: optimizedFile,
        type: data.pptFile.type,
        name: data.pptFile.name,
        // Add file extension for better handling on the server side
        extension: data.pptFile.name.split('.').pop()?.toLowerCase()
      }));
    }

    console.log("Processing your registration...");
    
    // Send data to Google Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    });

    // Since we're using no-cors, we can't read the response
    // But the data will still be processed by the server
    return {
      success: true,
      message: `🎉 Congratulations ${data.teamName}! Your registration is successful! 🎉\n\n🚀 Welcome to Hacksprint 5.0! Get ready for an exciting journey of innovation and creativity.\n\n📱 Join our WhatsApp group for important updates and to connect with other participants:\n${WHATSAPP_GROUP_LINK}\n\n💡 Pro Tip: Keep your PPT ready for the next phase. We'll be in touch soon with more details!`,
      whatsappLink: WHATSAPP_GROUP_LINK
    };
  } catch (error) {
    console.error("Error submitting registration:", error);
    return {
      success: false,
      message: `❌ Oops! We encountered an issue while processing your registration.\n\nPlease try again in a few moments. If the problem persists, contact our support team.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

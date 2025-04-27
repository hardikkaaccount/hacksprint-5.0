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

/**
 * Submit registration data to Google Sheets via Apps Script
 */
export const submitRegistrationToGoogleSheets = async (data: RegistrationData): Promise<{success: boolean, message: string, whatsappLink?: string}> => {
  try {
    // Create FormData object directly (more reliable for file uploads)
    const formData = new FormData();
    
    // Add all text data fields individually
    formData.append('timestamp', new Date().toISOString());
    formData.append('teamName', data.teamName);
    formData.append('leadName', data.leadName);
    formData.append('leadPhone', data.leadPhone);
    formData.append('collegeName', data.collegeName);
    formData.append('hackathonDomain', data.hackathonDomain);
    formData.append('member1Name', data.member1Name);
    formData.append('member1USN', data.member1USN);
    formData.append('member2Name', data.member2Name);
    formData.append('member2USN', data.member2USN);
    formData.append('member3Name', data.member3Name || '');
    formData.append('member3USN', data.member3USN || '');
    formData.append('member4Name', data.member4Name || '');
    formData.append('member4USN', data.member4USN || '');
    formData.append('sheetId', SHEET_ID);
    formData.append('folderId', DRIVE_FOLDER_ID);
    
    // Add the file directly to FormData without any processing
    // This is the most reliable way to handle file uploads
    if (data.pptFile) {
      // Rename the file to include team name for better organization
      const fileExtension = 'pdf';
      const safeTeamName = data.teamName.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_');
      const uniqueFileName = `${safeTeamName}_${Date.now()}.${fileExtension}`;
      
      // Create a new File object with the renamed file (but same content)
      const renamedFile = new File(
        [data.pptFile], 
        uniqueFileName,
        { type: 'application/pdf' }
      );
      
      // Append the file directly (no base64 conversion)
      formData.append('file', renamedFile);
      console.log(`File prepared for upload: ${uniqueFileName}`);
    }

    console.log("Processing your registration...");
    
    // Use standard fetch with FormData to ensure proper file handling
    // Note: For CORS issues, you may need to adjust the Google Apps Script to accept and process
    // FormData directly rather than expecting JSON
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    });

    return {
      success: true,
      message: `🎉 Congratulations ${data.teamName}! Your registration is successful! 🎉\n\n🚀 Welcome to Hacksprint 5.0! Get ready for an exciting journey of innovation and creativity.\n\n📱 Join our WhatsApp group for important updates and to connect with other participants.`,
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

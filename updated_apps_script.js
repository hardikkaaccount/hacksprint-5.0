function doPost(e) {
  try {
    // Enable CORS
    const response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    
    // Log the raw request for debugging
    Logger.log("Raw request data received");
    
    // Parse the request from FormData format
    let formData;
    let requestId = "";
    
    try {
      // Check for requestId to prevent duplicates
      if (e.parameter && e.parameter.requestId) {
        requestId = e.parameter.requestId;
        Logger.log("Request ID: " + requestId);
      }
      
      // First, try to parse as FormData (our app's structure)
      if (e.parameter && e.parameter.registrationData) {
        formData = JSON.parse(e.parameter.registrationData);
        Logger.log("FormData registrationData found");
      } 
      // Try to get it from postData if not in parameters
      else if (e.postData && e.postData.contents) {
        const postData = JSON.parse(e.postData.contents);
        Logger.log("Parsed postData");
        
        if (postData.registrationData) {
          formData = JSON.parse(postData.registrationData);
        } else {
          formData = postData; // Assume it's the registration data directly
        }
        
        // Check for requestId in postData
        if (postData.requestId) {
          requestId = postData.requestId;
          Logger.log("Request ID from postData: " + requestId);
        }
      }
    } catch (parseError) {
      Logger.log("Error parsing request data: " + parseError.toString());
      return createErrorResponse("Failed to parse request data: " + parseError.toString());
    }
    
    // Validate required fields
    if (!formData ||
        !formData.teamName || 
        !formData.leadName || 
        !formData.leadPhone || 
        !formData.collegeName || 
        !formData.hackathonDomain || 
        !formData.member1Name || 
        !formData.member1USN) {
      Logger.log("Missing required fields");
      return createErrorResponse("Required fields are missing in your registration");
    }

    // Get the specific spreadsheet by ID
    const ss = SpreadsheetApp.openById(formData.sheetId || "19XpjKjtpcuzY7cHRvfn54BoCTU5CyMgiQ7IAyewlHac");
    let sheet = ss.getSheetByName("Registrations");
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet("Registrations");
      sheet.appendRow([
        "Timestamp",
        "Team Name",
        "Lead Name",
        "Lead Phone",
        "College Name",
        "Hackathon Domain",
        "Member 1 Name",
        "Member 1 USN",
        "Member 2 Name",
        "Member 2 USN",
        "Member 3 Name",
        "Member 3 USN",
        "Member 4 Name",
        "Member 4 USN",
        "PPT URL",
        "Request ID"
      ]);
    }
    
    // =================================================
    // DUPLICATE CHECK TO PREVENT MULTIPLE REGISTRATIONS
    // =================================================
    
    // Get all current data to check for duplicates
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const lastColumn = values[0].length - 1; // Get the index of the last column (for requestId)
    
    // Check if we have a valid requestId for duplicate detection
    if (requestId) {
      // First check: Does this specific request ID already exist in our sheet?
      for (let i = 1; i < values.length; i++) {
        if (values[i][lastColumn] === requestId) {
          Logger.log("DUPLICATE DETECTED: Request ID " + requestId + " already exists");
          return createSuccessResponse("Your registration was already processed successfully.");
        }
      }
    }
    
    // Second check: Is this team name already registered?
    const teamName = formData.teamName.trim();
    for (let i = 1; i < values.length; i++) {
      if (values[i][1].trim().toLowerCase() === teamName.toLowerCase()) {
        Logger.log("DUPLICATE DETECTED: Team name " + teamName + " already exists");
        return createSuccessResponse("This team is already registered for HackSprint 5.0.");
      }
    }
    
    // Third check: Validate the lead's phone and email
    const leadPhone = formData.leadPhone?.trim();
    const leadName = formData.leadName?.trim();
    
    if (leadPhone) {
      for (let i = 1; i < values.length; i++) {
        if (values[i][3]?.trim() === leadPhone) {
          Logger.log("DUPLICATE DETECTED: Phone number " + leadPhone + " already used for registration");
          return createSuccessResponse("This phone number is already used for a team registration.");
        }
      }
    }
    
    // Handle file upload if present
    let pptUrl = "";
    let fileData;
    
    // Try to get file data from the request
    if (e.parameter && e.parameter.fileData) {
      fileData = JSON.parse(e.parameter.fileData);
    } else if (e.postData && e.postData.contents) {
      try {
        const postData = JSON.parse(e.postData.contents);
        if (postData.fileData) {
          fileData = postData.fileData;
        }
      } catch (fileDataError) {
        Logger.log("Error parsing file data: " + fileDataError.toString());
      }
    }
    
    // Process the file data if we found it
    if (fileData && fileData.content) {
      try {
        // First check if we already have a file with this team name in the folder
        // to avoid duplicate uploads
        const folder = DriveApp.getFolderById(formData.folderId || "12hOP_HtiWFeISUUIdb2iJeW33QiDDd-r");
        const existingFiles = folder.getFilesByName(fileData.name);
        
        // If we already have a file with this name, use its URL instead of uploading again
        if (existingFiles.hasNext()) {
          const existingFile = existingFiles.next();
          pptUrl = existingFile.getUrl();
          Logger.log("Using existing file: " + pptUrl);
        } else {
          Logger.log("Processing file: " + (fileData.name || "unnamed file"));
          
          // Decode the base64 content
          const fileBlob = Utilities.newBlob(
            Utilities.base64Decode(fileData.content),
            fileData.type || 'application/pdf',
            fileData.name || formData.submissionFileName || "submission.pdf"
          );
          
          // Upload file to Drive
          const file = folder.createFile(fileBlob);
          pptUrl = file.getUrl();
          Logger.log("File uploaded successfully: " + pptUrl);
        }
      } catch (error) {
        Logger.log("File upload error: " + error.toString());
        return createErrorResponse("Error uploading file: " + error.toString());
      }
    } else {
      Logger.log("No file data found in request");
    }

    // Prepare the row data
    const rowData = [
      new Date(),
      formData.teamName,
      formData.leadName,
      formData.leadPhone,
      formData.collegeName,
      formData.hackathonDomain,  // Fixed field name
      formData.member1Name,
      formData.member1USN,
      formData.member2Name || "",
      formData.member2USN || "",
      formData.member3Name || "",
      formData.member3USN || "",
      formData.member4Name || "",
      formData.member4USN || "",
      pptUrl,
      requestId  // Store requestId to prevent duplicates
    ];

    // Add the new registration
    sheet.appendRow(rowData);
    Logger.log("Data written to sheet");

    // Return successful response with CORS headers
    return createSuccessResponse("Registration successful", pptUrl);

  } catch (error) {
    Logger.log("Error: " + error.toString());
    return createErrorResponse("An error occurred while processing your registration: " + error.toString());
  }
}

// Helper function to create error responses with CORS headers
function createErrorResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: message
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeader('Access-Control-Allow-Origin', '*')
  .setHeader('Access-Control-Allow-Methods', 'POST')
  .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Helper function to create success responses with CORS headers
function createSuccessResponse(message, pptUrl) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: message,
    pptUrl: pptUrl || ""
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeader('Access-Control-Allow-Origin', '*')
  .setHeader('Access-Control-Allow-Methods', 'POST')
  .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doGet(e) {
  // Handle CORS preflight requests
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "HackSprint 5.0 Registration API is running"
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeader('Access-Control-Allow-Origin', '*')
  .setHeader('Access-Control-Allow-Methods', 'POST')
  .setHeader('Access-Control-Allow-Headers', 'Content-Type');
} 
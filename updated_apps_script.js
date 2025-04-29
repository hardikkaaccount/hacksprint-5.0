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
    
    // 1. Check for duplicate team name
    const teamName = formData.teamName.trim();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Start from row 1 (row 0 is the header)
    for (let i = 1; i < values.length; i++) {
      // Column 1 is Team Name (0-based)
      if (values[i][1] === teamName) {
        Logger.log("Duplicate team name found: " + teamName);
        return createSuccessResponse("Team already registered successfully.");
      }
      
      // If we have a requestId, check for duplicate requestId
      if (requestId && values[i][15] === requestId) {
        Logger.log("Duplicate request ID found: " + requestId);
        return createSuccessResponse("Registration already processed.");
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
        Logger.log("Processing file: " + (fileData.name || "unnamed file"));
        
        // Decode the base64 content
        const fileBlob = Utilities.newBlob(
          Utilities.base64Decode(fileData.content),
          fileData.type || 'application/pdf',
          fileData.name || formData.submissionFileName || "submission.pdf"
        );
        
        // Get the specific folder by ID
        const folder = DriveApp.getFolderById(formData.folderId || "12hOP_HtiWFeISUUIdb2iJeW33QiDDd-r");
        
        // Upload file to Drive
        const file = folder.createFile(fileBlob);
        pptUrl = file.getUrl();
        Logger.log("File uploaded successfully: " + pptUrl);
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
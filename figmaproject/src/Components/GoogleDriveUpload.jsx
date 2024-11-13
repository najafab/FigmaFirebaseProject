import React, { useState } from "react";
import { gapi } from "gapi-script";

const GoogleDriveUpload = () => {
  const [file, setFile] = useState(null);

  // Replace with your own Client ID and API Key from Google Cloud Console
  const CLIENT_ID = "YOUR_CLIENT_ID";
  const API_KEY = "YOUR_API_KEY";

  // Discovery document URL for Google Drive API
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  ];

  // Scopes for Google Drive API
  const SCOPES = "https://www.googleapis.com/auth/drive.file";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAuthClick = () => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          gapi.auth2.getAuthInstance().signIn();
        })
        .catch((error) => {
          console.error("Error initializing Google API client:", error);
        });
    });
  };

  const uploadFile = () => {
    if (!file) return alert("Please select a file to upload.");

    const metadata = {
      name: file.name,
      mimeType: file.type,
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    gapi.client
      .request({
        path: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        method: "POST",
        headers: {
          "Content-Type": "multipart/related; boundary=foo_bar_baz",
        },
        body: form,
      })
      .then((response) => {
        alert("File uploaded successfully!");
        console.log("File upload response:", response);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div>
      <h1>Google Drive Image Upload</h1>
      <button onClick={handleAuthClick}>Sign in with Google</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload to Google Drive</button>
    </div>
  );
};

export default GoogleDriveUpload;

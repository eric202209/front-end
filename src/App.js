import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import DocumentList from "./components/DocumentList";

function App() {
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState("");
  const [uploadResponse, setUploadResponse] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSelect = (document) => {
    // When a document is selected from the list
    setCompany(document.company_name);
    handlePreprocess(document.file_url);
  };

  const handleUpload = async () => {
    if (!file || !company) {
      alert("Please select a file and enter a company name.");
      return;
    }

    const formData = new FormData();
    formData.append("company_name", company);
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUploadResponse(data);

      if (response.ok) {
        console.log("Upload successful:", data);
        handlePreprocess(data.file_url);
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handlePreprocess = async (fileUrl) => {
    try {
      const response = await fetch("http://localhost:8000/api/preprocess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_url: fileUrl, company_name: company }),
      });

      const data = await response.json();
      console.log("Preprocessing response:", data);
    } catch (error) {
      console.error("Error starting preprocessing:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center mb-8">Document Processing System</h1>
        
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Upload New Document</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Company Name" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input 
              type="file" 
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            <button 
              onClick={handleUpload}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Upload & Process
            </button>
          </div>
          {uploadResponse && (
            <pre className="bg-gray-100 p-4 rounded mt-4">
              {JSON.stringify(uploadResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Document List */}
        <DocumentList onFileSelect={handleFileSelect} />
      </div>
    </div>,

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>

  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";
import StudentTable from "./StudentTable";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger table refresh
  const [isUploading, setIsUploading] = useState(false); // State to manage button activation

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setIsUploading(false); // Enable upload button
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsUploading(false); // Enable upload button
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    setIsUploading(true); // Disable upload button during upload

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/students/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(`Upload successful! Uploaded ID: ${response.data}`);
      setRefreshKey((prevKey) => prevKey + 1); // Trigger table refresh
      setFile(null); // Clear the selected file
    } catch (error) {
      setMessage("Upload failed! Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(true); // Keep button disabled after upload until a new file is selected
    }
  };

  // Export to CSV functionality
  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/students/export",
        {
          responseType: "blob", // Important for downloading files
        }
      );
      const blob = new Blob([response.data], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "students_data.csv"; // Filename for the CSV file
      link.click();
    } catch (error) {
      console.error("Error exporting data:", error);
      setMessage("Error exporting data! Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <input
        type="file"
        id="fileInput"
        onChange={handleFileSelect}
        className="hidden"
      />
      <label
        htmlFor="fileInput"
        className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-gray-50 border border-gray-200 rounded-lg ${
          dragActive ? "bg-gray-200" : ""
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <p className="text-gray-500">
          Drag and drop files here or{" "}
          <span className="text-blue-500">browse</span>
        </p>
      </label>
      {file && (
        <p className="mt-2 text-sm text-gray-700">Selected File: {file.name}</p>
      )}
      <button
        onClick={handleUpload}
        disabled={isUploading} // Disable button based on state
        className={`mt-4 px-4 py-2 rounded ${
          isUploading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={refreshKey === 0} // Disable if no data (based on refreshKey state)
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export
      </button>

      {/* Render MyTable Component Below */}
      <div className="mt-8 w-full">
        <StudentTable refreshKey={refreshKey} />
      </div>

      <button
        className="mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        // onClick={onAddingNewUser}
      >
        Add New Student
      </button>
    </div>
  );
};

export default FileUploader;

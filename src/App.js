import "./App.css";
import React, { useState } from "react";


const App = () => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFolderSelect = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const fileEntries = [];

      for await (const entry of directoryHandle.values()) {
        if (entry.kind === "file") {
          const file = await entry.getFile();
          fileEntries.push({
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
          });
        }
      }

      setFiles(fileEntries);
      setCurrentIndex(0); // Reset to the first file
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < files.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : files.length - 1
    );
  };

  const currentItem = files[currentIndex];

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>Viewer</h1>
      <button onClick={handleFolderSelect}>Select Folder</button>

      {files.length > 0 && (
        <>
          <div style={{ margin: "20px" }}>
            <h3>{currentItem.name}</h3>
            {currentItem.type.startsWith("image/") && (
              <img src={currentItem.url} alt={currentItem.name} width="600" />
            )}
            {currentItem.type === "application/pdf" && (
              <embed
                src={currentItem.url}
                type="application/pdf"
                width="700"
                height="500"
              />
            )}
            {currentItem.type.startsWith("video/") && (
              <video width="600" height="400" controls>
                <source src={currentItem.url} type={currentItem.type} />
              </video>
            )}
          </div>
          <div>
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

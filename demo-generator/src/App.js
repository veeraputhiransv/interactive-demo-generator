// App.js
import React, { useState, useEffect } from "react";
import ImageUpload from "./components/ImageUpload";
import DemoPreview from "./components/DemoPreview";
import ExportDemo from "./components/ExportDemo";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [demos, setDemos] = useState([]);
  const [shareableLink, setShareableLink] = useState(""); // State to store the shareable link

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    const response = await fetch("http://localhost:5001/api/demos");
    const data = await response.json();
    const demosWithParsedCaptions = data.map((demo) => ({
      ...demo,
      captions: JSON.parse(demo.captions),
    }));
    setDemos(demosWithParsedCaptions);
  };

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages);
    setCaptions(Array(uploadedImages.length).fill(""));
  };

  const handleCaptionChange = (index, caption) => {
    const updatedCaptions = [...captions];
    updatedCaptions[index] = caption;
    setCaptions(updatedCaptions);
  };

  const handleDemoExport = async () => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    formData.append("captions", JSON.stringify(captions));

    const response = await fetch("http://localhost:5001/api/demos", {
      method: "POST",
      body: formData,
    });
    const newDemo = await response.json();

    // Generate the shareable link
    const demoLink = `http://localhost:3000/demo/${newDemo.id}`;
    setShareableLink(demoLink);

    alert("Demo successfully exported!");
    fetchDemos(); // Refresh the demo list after export
  };

  const handleDeleteDemo = async (id) => {
    await fetch(`http://localhost:5001/api/demos/${id}`, { method: "DELETE" });
    setDemos(demos.filter((demo) => demo.id !== id));
  };

  return (
    <div className="App">
      <h1>Interactive Demo Generator</h1>
      <ImageUpload onUpload={handleImageUpload} />
      {images.length > 0 && (
        <>
          <DemoPreview
            images={images}
            captions={captions}
            onCaptionChange={handleCaptionChange}
          />
          <ExportDemo onExport={handleDemoExport} />
        </>
      )}

      {/* Display the shareable link if available */}
      {shareableLink && (
        <div>
          <h3>Your Shareable Demo Link:</h3>
          <a href={shareableLink} target="_blank" rel="noopener noreferrer">
            {shareableLink}
          </a>
        </div>
      )}

      <h2>Existing Demos</h2>
      {demos.map((demo) => (
        <div key={demo.id}>
          <p>Demo ID: {demo.id}</p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center", // Horizontally center the items
              alignItems: "center", // Vertically center the items
            }}
          >
            {demo.images.map((image, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={`http://localhost:5001/${image}`}
                  alt={`Demo ${demo.id} Image ${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <p>{demo.captions[index]}</p>
              </div>
            ))}
          </div>
          <button onClick={() => handleDeleteDemo(demo.id)}>Delete Demo</button>
        </div>
      ))}
    </div>
  );
}

export default App;

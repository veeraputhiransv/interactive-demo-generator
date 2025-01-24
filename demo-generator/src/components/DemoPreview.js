import React from "react";

function DemoPreview({ images, captions, onCaptionChange }) {
  return (
    <div>
      {images.map((image, index) => (
        <div key={index} className="image-preview">
          <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} />
          <textarea
            value={captions[index] || ""}
            onChange={(e) => onCaptionChange(index, e.target.value)}
            placeholder="Add a caption or instruction..."
          />
        </div>
      ))}
    </div>
  );
}

export default DemoPreview;

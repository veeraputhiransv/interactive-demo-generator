import React, { useState } from "react";

function ImageUpload({ onUpload }) {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length <= 5 && files.length >= 3) {
      setSelectedImages(files);
      onUpload(files);
    } else {
      alert("You can upload a maximum of 3 or 5 images.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImageUpload;

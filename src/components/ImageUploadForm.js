import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const ImageUploadForm = () => {
  const [base64Image, setBase64Image] = useState("");

  const handleFileInputChange = (event) => {
    console.log("Aaaaa");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBase64Image(reader.result);
      console.log(base64Image);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const uploadImageToFirebaseStorage = async () => {
    try {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child("image.jpg"); // Specify the desired storage path for the image

      // Convert the base64 image to a Blob object
      const imageBlob = dataURLtoBlob(base64Image);

      // Upload the image Blob to Firebase Storage
      const uploadTask = imageRef.put(imageBlob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          // Handle upload error
          console.error("Error uploading image:", error);
        },
        () => {
          // Handle successful upload
          console.log("Image uploaded successfully");
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleFileInputChange(e)}
        accept="image/png, image/jpeg, image/jpg"
      />
      <button onClick={uploadImageToFirebaseStorage}>Upload</button>
    </div>
  );
};

export default ImageUploadForm;

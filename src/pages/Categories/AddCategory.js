//styles
import "../Main.css";
import { useContext, useState } from "react";
import { Navbar } from "../../components/Navbar";
import ImageUploadForm from "../../components/ImageUploadForm";

import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { Alert } from "bootstrap";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  //const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const { token } = useContext(AuthentificationContext);

  const category = {
    name: name,
    imageLink: selectedImage,
  };

  const handleAddCategory = async () => {
    const url = `${baseUrl}categories/secure/category`;
    const body = JSON.stringify(category);
    console.log(body);
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body,
    };

    const response = await fetch(url, options);
    if (response.ok) {
      alert("Categorie creata!");
    }
  };

  const pickImageFromGallery = async (e) => {
    return new Promise(async (resolve, reject) => {
      try {
        const image = e.target.files[0];
        console.log("imagine:", e.target.files[0]);

        const blob = new Blob([image], { type: image.type });

        const ref = firebase.storage().ref().child("categories/react.jpg");
        const snapshot = ref.put(blob);
        snapshot.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {},
          (error) => {
            console.log(error);
            blob.close();
            reject(error);
          },
          () => {
            snapshot.snapshot.ref.getDownloadURL().then((url) => {
              console.log("Download URL: ", url);
              setSelectedImage(url);
              blob.close();
              resolve(url);
            });
          }
        );
      } catch (error) {
        reject(error); // Reject with any caught error
      }
    });
  };

  return (
    <div>
      <Navbar />
      <div className="centered-text">
        <form>
          <div class="container mt-3">
            <h2 className="display-6 centered-text  margin-top margin-bottom">
              Categorie de produse noua
            </h2>
            <div class="mb-3 mt-3">
              <label className="form-label">
                Nume
                <input
                  class="form-control"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </label>
            </div>
            <div>
              {/* <button className="btn btn-light">
                Adaugare poza
              </button> */}
              <div class="mb-3 mt-3" style={{ width: "100%", margin: "auto" }}>
                <h3 className="display-6 centered-text  margin-top margin-bottom">
                  Adaugare poza
                </h3>
                <input
                  class="form-control"
                  type="file"
                  onChange={async (e) => await pickImageFromGallery(e)}
                />
              </div>
              {/* <button onClick={uploadImageToFirebaseStorage}>Upload</button> */}
              {/* <ImageUploadForm /> */}
            </div>
            <div>
              <button
                className="btn btn-secondary"
                type="button"
                title="Adaugare"
                onClick={() => {
                  handleAddCategory();
                }}
              >
                <div>Adaugare categorie</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

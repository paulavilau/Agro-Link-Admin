//styles
import "../Main.css";
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { useParams } from "react-router-dom";

import { baseUrl } from "../../context/authentification.context";

import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";

export default function ModifyCategory() {
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [categ, setCateg] = useState({});

  const { id, type } = useParams();

  console.log("Id:", id);

  const fetchCateg = useCallback(async () => {
    let url;
    if (type === "category") {
      url = `${baseUrl}categories/${id}`;
    } else {
      url = `${baseUrl}subcategories/${id}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    setName(data.name);
    setSelectedImage(data.imageLink);
    setCateg(data);
  }, [id, type]);

  useEffect(() => {
    fetchCateg();
  }, [fetchCateg]);

  const category = {
    id: id,
    name: name,
    imageLink: selectedImage,
  };

  const handleModifyCategory = async () => {
    let url;
    if (type === "category") {
      url = `${baseUrl}categories/secure/modify-category`;
    } else {
      url = `${baseUrl}categories/secure/modify-subcategory`;
    }
    const body = JSON.stringify(category);
    console.log(body);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    };

    const response = await fetch(url, options);
    if (response.ok) {
      alert("Categorie/subcategorie modificata!");
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
              Modificare categorie {name}
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
                  handleModifyCategory();
                }}
              >
                <div>Modificare categorie</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

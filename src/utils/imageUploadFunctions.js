// const pickImageFromGallery = async (e) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const image = e.target.files[0];
//         console.log("imagine:", e.target.files[0]);

//         const blob = new Blob([image], { type: image.type });

//         const ref = firebase.storage().ref().child("categories/react.jpg");
//         const snapshot = ref.put(blob);
//         snapshot.on(
//           firebase.storage.TaskEvent.STATE_CHANGED,
//           () => {},
//           (error) => {
//             console.log(error);
//             blob.close();
//             reject(error);
//           },
//           () => {
//             snapshot.snapshot.ref.getDownloadURL().then((url) => {
//               console.log("Download URL: ", url);
//               setSelectedImage(url);
//               blob.close();
//               resolve(url);
//             });
//           }
//         );
//       } catch (error) {
//         reject(error); // Reject with any caught error
//       }
//     });
//   };

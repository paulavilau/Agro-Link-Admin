import "./App.css";
import { AuthentificationContextProvider } from "./context/authentification.context";

import firebase from "firebase/compat/app";

import Router from "./Route";

const firebaseConfig = {
  apiKey: "AIzaSyDReSDJcYh_yLzIc8gMdHtQKhlUExtygE0",
  authDomain: "mealstogo-a5948.firebaseapp.com",
  projectId: "mealstogo-a5948",
  storageBucket: "mealstogo-a5948.appspot.com",
  messagingSenderId: "217690511861",
  appId: "1:217690511861:web:9b9fca3abad17855fd68bc",
};

firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <AuthentificationContextProvider>
      <Router />
    </AuthentificationContextProvider>
  );
}

export default App;

//onst [user, setUser] = useState(null);

// Check the initial authentication state
// useEffect(() => {
//   let isMounted = true; // Add a boolean flag to track if the component is mounted
//   const getUserFromStorage = async () => {
//     const email = localStorage.getItem("email");
//     const password = localStorage.getItem("password");
//     const token = localStorage.getItem("token");

//     console.log("Email:", email);
//     console.log("Password:", password);
//     console.log("Token:", token);
//     if (email && password && token) {
//       console.log("aaa");
//       const user = await onLoginAdmin(email, password);
//       console.log("IsAuthenticated:", !!user);
//       if (isMounted) {
//         // Check if the component is still mounted before updating the state
//         setUser(user);
//       }
//     } else {
//       setUser(null);
//     }
//   };
//   getUserFromStorage();
//   return () => {
//     isMounted = false; // Set the flag to false when the component is unmounted
//   };
// }, []);

import { createContext, useCallback, useEffect, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export const AuthentificationContext = createContext();

export const baseUrl = `http://localhost:8080/agrolink/`;

export function AuthentificationContextProvider({ children }) {
  //const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const baseUrl = `http://localhost:8080/agrolink/`;

  // Login admin function ----------------------------------------

  const onLoginAdmin = useCallback(
    async (email, password) => {
      //let idToken;
      setIsLoading(true);
      try {
        const u = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        //const isAuthenticated = !!user;
        setUser(u.user);
        //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        // console.log("User data:", user);

        if (u.user) {
          // localStorage.setItem("user", JSON.stringify(user));
          const idToken = await u.user.getIdToken();
          setToken(idToken);
          console.log(token);

          try {
            const url = `${baseUrl}admins/search/findByFirebaseId?firebaseId=${u.user.uid}`;
            console.log(url);
            const options = {
              headers: {
                Authorization: "Bearer" + idToken,
              },
            };
            const response = await fetch(url, options);
            const data = await response.json();

            console.log("Admin:", data);
          } catch (e) {
            console.log(e);
            return;
          }
          localStorage.setItem("token", idToken);
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
          console.log("User:", !!user);
          return u.user;
        } else {
          setIsLoading(false);
          return;
        }
      } catch (e) {
        setIsLoading(false);
        alert("Eroare la conectare !");
        console.log(e.toString());
        return;
      }
    },
    [token]
  );

  const onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("token");
        setUser(null);
        setIsLoading(false);
        //history.push("/login"); // Replace "/dashboard" with the desired URL
      });
  };

  useEffect(() => {
    const getUserFromStorage = async () => {
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");

      console.log("Email:", email);
      console.log("Password:", password);
      if (email && password) {
        await onLoginAdmin(email, password);
      }
    };
    getUserFromStorage();
  }, [onLoginAdmin]);

  return (
    <AuthentificationContext.Provider
      value={{
        isAuthenticated: !!user,
        onLoginAdmin,
        user,
        setUser,
        token,
        onLogout,
        isLoading,
      }}
    >
      {children}
    </AuthentificationContext.Provider>
  );
}

// const onLoginAdmin = async (email, password) => {
//   console.log("on login admin");
//   try {
//     console.log(email);
//     console.log(password);
//     setIsLoading(true);
//     const adminResponse = await findAdminInSqlDB(email);
//     const adminData = await adminResponse.json();
//     if (adminData.password === password) {
//       console.log(adminData);
//       setUser(adminData);
//       console.log(adminData);
//       console.log(!!user);
//       setIsLoading(false);

//       return !!user;
//     }
//   } catch (e) {
//     // console.error(e);
//     setIsLoading(false);
//     setError(e.toString());
//   }
// };

// const findAdminInSqlDB = (email) => {
//   const findAdminUrl = `${baseUrl}admins/search/findByEmail?email=${email}`;
//   return fetch(findAdminUrl);
// };

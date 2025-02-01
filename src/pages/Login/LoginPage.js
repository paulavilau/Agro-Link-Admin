import { Link, useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

//styles
import "../Main.css";
import { useContext, useState } from "react";
import { AuthentificationContext } from "../../context/authentification.context";

export default function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { onLoginAdmin, user, isLoading } = useContext(AuthentificationContext);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLoginAdmin(email, password);
    history.push("/home-page");
  };

  console.log(email, password);

  return (
    <>
      {isLoading ? (
        <div style={{ display: "flex", paddingTop: 300, alignItems: "center" }}>
          <div
            style={{
              margin: "auto",
              justifyContent: "center",
            }}
            className="spinner-border text-success"
            role="status"
          ></div>
          {/* <div style={{ textAlign: "center" }}>Loading...</div> */}
        </div>
      ) : (
        <div className="login-background">
          <div className="home">
            <div className="container-fluid" style={{ maxWidth: 500 }}>
              <form>
                <div className="container-fluid login-form centered">
                  <h1
                    className="display-6 centered-text"
                    style={{ marginBottom: 15, fontWeight: "bold" }}
                  >
                    Login
                  </h1>
                  <input
                    style={{ marginBottom: 15, maxWidth: 300 }}
                    className="form-control"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                  <input
                    style={{ marginBottom: 15, maxWidth: 300 }}
                    className="form-control"
                    type="password"
                    placeholder="Parolă"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    title="Login"
                    onClick={handleSubmit}
                  >
                    <div>Login</div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

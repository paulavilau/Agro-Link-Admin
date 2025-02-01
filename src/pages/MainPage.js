import { Link, useHistory } from "react-router-dom";

//styles
import "./Main.css";

import { Navbar } from "../components/Navbar";

export default function MainPage() {
  const history = useHistory();

  return (
    <div>
      <Navbar />
      <div className="container centered-text">
        <div className="container px-4 centered-text">
          <div style={{ width: 500, margin: "auto" }}>
            <div className="row gx-5 gy-5">
              <button
                style={{ width: 200, height: 50 }}
                className="btn btn-light column"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/orders");
                }}
              >
                <div>Comenzi</div>
              </button>
              <button
                style={{ width: 200, height: 50 }}
                className="btn btn-light column"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/farmers");
                }}
              >
                <div>Ferme</div>
              </button>
              <button
                style={{ width: 200, height: 50 }}
                className="btn btn-light column"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/pending-farmers");
                }}
              >
                <div>Solicitari inregistrare</div>
              </button>
            </div>
            <div className="row gx-5 gy-5">
              <button
                style={{ width: 200, height: 50 }}
                className="btn btn-light column"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/categories");
                }}
              >
                <div>Categorii</div>
              </button>
              <button
                style={{ width: 200, height: 50 }}
                className="btn btn-light column"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/products");
                }}
              >
                <div>Produse</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

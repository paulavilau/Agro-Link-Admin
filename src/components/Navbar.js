import { NavLink, useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useContext, useEffect } from "react";
import { AuthentificationContext } from "../context/authentification.context";
//styles
import "../pages/Main.css";

export const Navbar = () => {
  const { user, setUser, onLogout } = useContext(AuthentificationContext);

  const history = useHistory();

  return (
    <>
      <nav
        nav
        class="navbar navbar-expand-sm bg-light navbar-light grey"
        style={{ width: "100%" }}
      >
        <div className="container-fluid">
          {/* <h1 className="display-6">Administrare baza de date</h1> */}
          <img
            alt="icon"
            src="https://firebasestorage.googleapis.com/v0/b/mealstogo-a5948.appspot.com/o/plant.png?alt=media&token=d5b38708-0b3d-4ef4-b5d6-75aafd79e777&_gl=1*t9pswo*_ga*NjY2MzAyNDQ0LjE2ODAxOTg4NjA.*_ga_CW55HF8NVT*MTY4NjU5MjIxMy42OC4xLjE2ODY1OTM1MTguMC4wLjA."
            style={{ height: 100, width: 100, marginLeft: -12 }}
          />
          <h1 className="display-6">Administrare AgroLink</h1>
          <ul className="navbar-nav">
            <li>
              <div class="dropdown margin-right">
                <button
                  style={{ height: "100%" }}
                  type="button"
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <img
                    style={{ height: 30, width: 30 }}
                    src="https://static.thenounproject.com/png/4038155-200.png"
                  />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <div className="dropdown-item" href="#">
                      {user.email}
                    </div>
                  </li>
                  <li>
                    <button
                      className="btn btn-light dropdown-item "
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button
                className="btn btn-light margin-right"
                onClick={() => {
                  history.push("/home-page");
                }}
              >
                Acasă
              </button>
            </li>
            <li>
              <div class="dropdown margin-right">
                <button
                  style={{ height: "100%" }}
                  type="button"
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Comenzi
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        history.push("/pending-orders");
                      }}
                    >
                      Comenzi în curs de procesare
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        history.push("/completed-orders");
                      }}
                    >
                      Comenzi finalizate
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="dropdown margin-right">
                <button
                  type="button"
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Ferme
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        history.push("/pending-farmers");
                      }}
                    >
                      Cereri înscriere
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        history.push("/farmers");
                      }}
                    >
                      Ferme înscrise
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="dropdown margin-right">
                <button
                  type="button"
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Produse
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        history.push("/categories");
                      }}
                    >
                      Categorii produse
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="dropdown margin-right">
                <button
                  type="button"
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Clienți
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        history.push("/clients");
                      }}
                    >
                      Conturi clienți
                    </button>
                  </li>
                  {/* <li>
                    <a className="dropdown-item" href="#">
                      Produse
                    </a>
                  </li> */}
                </ul>
              </div>
            </li>
            {/* <li className="nav-item">
              <NavLink className="nav-link" to="/orders-main">
                Acasă
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/completed-orders">
                Comenzi finalizate
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/pending-orders">
                Comenzi in curs de procesare
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink className="nav-link" to="/pending-farmers">
                Solicitari inscriere
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink className="nav-link" to="/farmers">
                Ferme
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink className="nav-link" to="/categories">
                Categorii produse
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink className="nav-link" to="/clients">
                Clienti
              </NavLink>
            </li> */}
          </ul>
        </div>
      </nav>
    </>
  );
};

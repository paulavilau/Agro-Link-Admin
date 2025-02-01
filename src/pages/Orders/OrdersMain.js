import { useHistory } from "react-router-dom";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useContext } from "react";
import { AuthentificationContext } from "../../context/authentification.context";

export default function OrdersMain() {
  const history = useHistory();
  const { isLoading } = useContext(AuthentificationContext);

  return (
    <div className="main-background">
      <Navbar />
      <div
        className="container"
        style={{ height: "100%", position: "relative", top: 0 }}
      >
        <div className="centered">
          <div className="my-container">
            <div className="item light-green centered">
              <h3 className="display-6">Comenzi</h3>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mealstogo-a5948.appspot.com/o/orders.png?alt=media&token=92e11a46-65b8-44b8-932a-57eb9b076b1d&_gl=1*s29dhv*_ga*NjY2MzAyNDQ0LjE2ODAxOTg4NjA.*_ga_CW55HF8NVT*MTY4NjU5MjIxMy42OC4xLjE2ODY1OTIyNjMuMC4wLjA."
                style={{ height: 130, width: 120, paddingBottom: 20 }}
                alt="orders"
              />
              <button
                style={{ padding: 10, width: 200 }}
                className="btn btn-success"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/pending-orders");
                }}
              >
                <div>Comenzi în curs de procesare</div>
              </button>
              <button
                style={{ marginTop: 20, width: 200, height: 50 }}
                className="btn btn-success"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/completed-orders");
                }}
              >
                <div>Comenzi finalizate</div>
              </button>
            </div>
            <div className="item dark-green centered">
              <h3 className="display-6">Ferme</h3>
              <img
                alt="farm"
                style={{ height: 140, width: 130, paddingBottom: 20 }}
                src="https://firebasestorage.googleapis.com/v0/b/mealstogo-a5948.appspot.com/o/farm.png?alt=media&token=c764c3af-4fbe-4302-bad2-ed706937682d&_gl=1*121hke2*_ga*NjY2MzAyNDQ0LjE2ODAxOTg4NjA.*_ga_CW55HF8NVT*MTY4NjU5MjIxMy42OC4xLjE2ODY1OTI0MTEuMC4wLjA."
              />
              <button
                style={{ marginTop: 20, width: 200, height: 50 }}
                className="btn btn-success"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/pending-farmers");
                }}
              >
                <div>Cereri înscriere</div>
              </button>
              <button
                style={{ marginTop: 20, width: 200, height: 50 }}
                className="btn btn-success"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/farmers");
                }}
              >
                <div>Ferme</div>
              </button>
            </div>
            <div className="item dark-green centered">
              <h3 className="display-6">Produse</h3>
              <img
                style={{ height: 140, width: 130, paddingBottom: 20 }}
                src="https://firebasestorage.googleapis.com/v0/b/mealstogo-a5948.appspot.com/o/products.png?alt=media&token=dda56017-5479-4fa2-bce5-9032cdceb415&_gl=1*1nrcvvm*_ga*NjY2MzAyNDQ0LjE2ODAxOTg4NjA.*_ga_CW55HF8NVT*MTY4NjU5MjIxMy42OC4xLjE2ODY1OTI1MTEuMC4wLjA."
                alt="products"
              />
              <button
                style={{ marginTop: 20, width: 200, height: 50 }}
                className="btn btn-success"
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
                style={{ marginTop: 20, width: 200, height: 50 }}
                className="btn btn-success"
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
            <div className="item light-green centered">
              <h3 className="display-6">Clienți</h3>
              <img
                style={{ height: 140, width: 130, paddingBottom: 20 }}
                src="https://firebasestorage.googleapis.com/v0/b/mealstogo-a5948.appspot.com/o/clients.png?alt=media&token=c01e7b20-686d-45f1-b071-7272d33e3bd9&_gl=1*1q31djl*_ga*NjY2MzAyNDQ0LjE2ODAxOTg4NjA.*_ga_CW55HF8NVT*MTY4NjY1NTQwMi43MC4xLjE2ODY2NTY2MjQuMC4wLjA."
                alt="products"
              />
              <button
                style={{ width: 200 }}
                className="btn btn-success"
                type="button"
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/clients");
                }}
              >
                <div>Conturi clienți</div>
              </button>
              {/* <button
              style={{ marginTop: 20, width: 200, height: 50 }}
              className="btn btn-success"
              type="button"
              title="Login"
              onClick={(e) => {
                e.preventDefault();
                history.push("/completed-orders");
              }}
            >
              <div>Produse</div>
            </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

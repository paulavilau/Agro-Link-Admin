import { useHistory } from "react-router-dom";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";

export default function ProductsMain() {
  const history = useHistory();

  return (
    <div className="container">
      <Navbar />
      <div className="centered">
        <div className="login-form centered">
          <button
            style={{ width: 200, height: 50 }}
            className="btn btn-light"
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
            className="btn btn-light"
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
  );
}

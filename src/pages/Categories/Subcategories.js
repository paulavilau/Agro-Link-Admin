import { Link, useHistory } from "react-router-dom";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthentificationContext } from "../../context/authentification.context";
import { baseUrl } from "../../context/authentification.context";
import { useParams } from "react-router-dom";

export default function Subcategories() {
  const { id, categoryName } = useParams();

  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const [subcategoriesError, setSubcategoriesError] = useState([]);

  const history = useHistory();
  const type = "subcategory";

  const fetchSubcategories = useCallback(async () => {
    try {
      setIsLoading(true);

      const url2 = `${baseUrl}categories/${id}/subcategories`;
      const response2 = await fetch(url2);
      const data2 = await response2.json();
      const subcategs = data2._embedded.subcategories;
      setIsLoading(false);
      setSubcategories(subcategs);
    } catch (error) {
      setSubcategoriesError(error);
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  const handleDelete = async (id) => {
    const url = `${baseUrl}subcategories/${id}`;
    const headers = { "Content-Type": "application/json" };
    const options = {
      method: "DELETE",
      headers: headers,
    };
    await fetch(url, options);
    fetchSubcategories();
    //fetchCategories();
  };

  return (
    <>
      <Navbar />
      <div
        className="container-fluid centered-text"
        style={{ width: "100%", marginTop: -50 }}
      >
        <h2 className="display-6 centered-text margin-top margin-bottom">
          Subcategorii
        </h2>
        <button
          className="btn btn-secondary margin-bottom"
          onClick={() => {
            history.push(`/addSubcategory/${id}/${categoryName}`);
          }}
        >
          Adaugare subcategorie
        </button>
        {isLoading && <div>Loading...</div>}
        {subcategoriesError && <div>{subcategoriesError}</div>}
        <table className="table table-hover table-bordered table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Denumire</th>
              <th>Imagine</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          {subcategories &&
            subcategories.map((subcategory) => {
              return (
                <tbody>
                  <tr key={subcategory.id}>
                    <td>{subcategory.id}</td>
                    <td>{subcategory.name}</td>
                    <td>
                      <img
                        alt="fructe si legume"
                        style={{ height: 80, width: "auto" }}
                        src={subcategory.imageLink}
                      ></img>
                    </td>
                    <td style={{ alignItems: "center" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          history.push(
                            `/modify-category/${subcategory.id}/${type}`
                          );
                        }}
                      >
                        Modificare
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(subcategory.id)}
                        className="btn btn-secondary"
                      >
                        Stergere
                      </button>
                    </td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </>
  );
}

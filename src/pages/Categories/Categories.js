import { Link, useHistory } from "react-router-dom";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import { baseUrl } from "../../context/authentification.context";
import axios from "axios";

export default function Categories() {
  // const {
  //   data: clients,
  //   isPending,
  //   error,
  // } = useFetch("http://localhost:8080/api/categories");

  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState([]);
  const [categoriesError, setCategoriesError] = useState([]);

  const history = useHistory();

  console.log(categories);
  console.log(baseUrl);
  const type = "category";

  const fetchCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const url = `${baseUrl}categories`;
      const response = await fetch(url);
      const data = await response.json();
      const categs = data._embedded.categories;

      const categs2Promises = categs.map(async (categ) => {
        // const blob = categ.imgBlob.blob();
        // const imgSrc = URL.createObjectURL(blob);

        return {
          ...categ,
          // imgSrc: imgSrc,
        };
      });

      const categs2 = await Promise.all(categs2Promises);

      setCategories(categs2);
      // console.log(categs2);
      setIsCategoriesLoading(false);
    } catch (error) {
      setCategoriesError(error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id) => {
    const url = `${baseUrl}categories/${id}`;
    const headers = { "Content-Type": "application/json" };
    const options = {
      method: "DELETE",
      headers: headers,
    };
    await fetch(url, options);
    fetchCategories();
  };

  return (
    <>
      <Navbar />
      <div
        className="container-fluid centered-text"
        style={{ width: "90%", marginTop: -50 }}
      >
        <div className="centered-text">
          <h2 className="display-6 margin-top margin-bottom">
            Categorii produse
          </h2>
          <button
            className="btn btn-secondary margin-bottom"
            onClick={() => {
              history.push(`/addCategory`);
            }}
          >
            Adaugare categorie
          </button>
        </div>

        {isCategoriesLoading && <div>Loading...</div>}
        {categoriesError && <div>{categoriesError}</div>}
        <table className="table table-hover table-bordered table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Denumire</th>
              <th>Poza</th>
              {/* <th></th>
              <th></th>
              <th></th> */}
            </tr>
          </thead>
          {categories &&
            categories.map((category) => {
              return (
                <tbody>
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <img
                        alt="fructe si legume"
                        style={{ height: 80, width: "auto" }}
                        src={category.imageLink}
                      ></img>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          history.push(
                            `/subcategories/${category.id}/${category.name}`
                          );
                        }}
                      >
                        Subcategorii
                      </button>
                    </td>
                    <td style={{ alignItems: "center" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          history.push(
                            `/modify-category/${category.id}/${type}`
                          );
                        }}
                      >
                        Modificare
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(category.id)}
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

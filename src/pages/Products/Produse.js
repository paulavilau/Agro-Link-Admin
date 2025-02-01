import { Link } from "react-router-dom";
import { baseUrl } from "../../context/authentification.context";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import { PageButtons } from "../../components/PageButtons";

export default function Produse() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchAllProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = `${baseUrl}products?size=10&page=${page}`;
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      const totalPages = data.page.totalPages;
      const totalElements = data.page.totalElements;
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      const farmersData = data._embedded.products;

      setProducts(farmersData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <>
      <Navbar />
      <div
        className="container-fluid centered-text"
        style={{ width: "100%", marginTop: -50 }}
      >
        <div
          className="centered-text"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <h2 className="display-6 centered-text">Produse</h2>
          {/* <div>Pagina: {page + 1}</div>
          <div>Total produse: {totalElements}</div> */}
        </div>

        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        <table className="table table-hover table-bordered table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Cod</th>
              <th>Denumire</th>
              <th>Descriere</th>
              <th>UM</th>
              <th>Masura</th>
              <th>Categorie</th>
              <th>Poza</th>
              <th>Producator</th>
              <th>Sezon</th>
              <th>Pret</th>
              <th>In stoc</th>
            </tr>
          </thead>
          {products &&
            products.map((product) => {
              return (
                <tbody>
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>
                      <Link to={`/order/${product.id}`}>Detalii</Link>
                    </td>
                    <td>{product.unit}</td>
                    <td>{product.measure}</td>
                    <td>...</td>
                    <td>...</td>
                    <td>{product.image}</td>
                    <td>{product.season}</td>
                    <td>{product.price}</td>
                    <td>{product.inStock ? "Da" : "nu"}</td>
                  </tr>
                </tbody>
              );
            })}
        </table>

        <PageButtons
          style={{ position: "absolute" }}
          page={page}
          setPage={setPage}
          fetchFunction={fetchAllProducts}
          totalPages={totalPages}
        />

        {/* <div>Total produse: {totalElements}</div> */}
      </div>
    </>
  );
}

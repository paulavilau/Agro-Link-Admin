//styles
import "../Main.css";
import { useHistory, useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";
import { PageButtons } from "../../components/PageButtons";

export default function SearchFarms() {
  const [farmers, setFarmers] = useState([]);
  const [isFarmersLoading, setIsFarmersLoading] = useState(false);
  const [farmersError, setFarmersError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const history = useHistory();
  const [counties, setCounties] = useState([]);
  const { token } = useContext(AuthentificationContext);
  const [searchUrl, setSearchUrl] = useState("");

  const { type } = useParams();

  useEffect(() => {
    const fetchAllFarmers = async (countyId, pageNumber) => {
      try {
        setIsFarmersLoading(true);
        let url;
        if (type === "name") {
          url = `${baseUrl}farms/search/findByNameContaining?name=${searchUrl}`;
        } else {
          url = `${baseUrl}farms/search/findByEmailContaining?email=${searchUrl}`;
        }

        const options = { headers: { Authorization: `Bearer ${token}` } };
        console.log(url);
        const response = await fetch(url, options);
        const data = await response.json();

        let farmersData;
        if (countyId) {
          farmersData = data.content;
          const totalPages = data.totalPages;
          setTotalPages(totalPages);
        } else {
          farmersData = data._embedded.farms;
          const totalPages = data.page.totalPages;
          setTotalPages(totalPages);
        }

        const countiesPromises = farmersData.map(async (farm) => {
          const countyUrl = `${baseUrl}farms/${farm.id}/county`;
          const countyResponse = await fetch(countyUrl, options);
          const countyData = await countyResponse.json();

          return { ...farm, county: countyData };
        });

        const farmersWithCounties = await Promise.all(countiesPromises);

        setFarmers(farmersWithCounties);
        setIsFarmersLoading(false);
      } catch (error) {
        setFarmersError(error);
        setIsFarmersLoading(false);
      }
    };
    fetchAllFarmers();
  }, [token, searchUrl, type]);

  return (
    <>
      <Navbar />
      <div className="container-fluid centered-text" style={{ width: "100%" }}>
        <div style={{ width: 500, margin: "auto" }}>
          <input
            placeHolder={
              type === "name"
                ? "Cautați ferme după nume"
                : "Cautați ferme adresa de email"
            }
            style={{ width: 500, margin: 20 }}
            className="form-control"
            type="text"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
          ></input>
        </div>
        {isFarmersLoading && <div>Loading...</div>}
        {farmersError && <div>{farmersError}</div>}
        <table className="table table-hover table-bordered table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nume</th>
              <th>Dată înscriere</th>
              <th>Județ</th>
              <th>Email</th>
              <th>Detalii</th>
            </tr>
          </thead>
          {farmers &&
            farmers.map((farmer) => {
              return (
                <tbody>
                  <tr key={farmer.id}>
                    <td>{farmer.id}</td>
                    <td>{farmer.name}</td>
                    <td>
                      {farmer.creationDt && farmer.creationDt.split("T")[0]}
                    </td>
                    <td>{farmer.county.name}</td>
                    <td>{farmer.email}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          history.push(`/farm-details/${farmer.id}`);
                        }}
                      >
                        <div>Detalii</div>
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

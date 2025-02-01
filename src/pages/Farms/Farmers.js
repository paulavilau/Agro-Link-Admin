//styles
import "../Main.css";
import { useHistory } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";
import { PageButtons } from "../../components/PageButtons";

export default function Farms() {
  const [farmers, setFarmers] = useState([]);
  const [isFarmersLoading, setIsFarmersLoading] = useState(false);
  const [farmersError, setFarmersError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const history = useHistory();
  const [counties, setCounties] = useState([]);
  const { token } = useContext(AuthentificationContext);
  const [filtered, setFiltered] = useState(false);

  useEffect(() => {
    let isMounted = true; // Create a mutable flag
    const fetchCounties = async () => {
      const url = `${baseUrl}counties?size=44`;
      const response = await fetch(url);
      const countiesData = await response.json();
      console.log("Judete:", countiesData);
      if (isMounted) {
        // Only update state if the component is still mounted
        setCounties(countiesData._embedded.counties);
      }
    };

    fetchCounties();

    return () => {
      isMounted = false; // Clean up the flag when the component unmounts
    };
  }, []);

  const fetchAllFarmers = useCallback(
    async (countyId, pageNumber) => {
      try {
        setIsFarmersLoading(true);
        let pageNmbr;
        if (pageNumber) {
          pageNmbr = pageNumber;
        } else {
          pageNmbr = page;
        }
        let url;
        if (countyId) {
          url = `${baseUrl}farms/farmsFromCounty?countyId=${countyId}&validated=1`;
        } else {
          url = `${baseUrl}farms/search/findByValidated?validated=1&size=7&page=${pageNmbr}`;
        }

        const options = { headers: { Authorization: `Bearer ${token}` } };
        console.log(url);
        const response = await fetch(url, options);
        const data = await response.json();

        let farmersData;
        if (countyId) {
          farmersData = data;
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
    },
    [page, token]
  );

  useEffect(() => {
    fetchAllFarmers();
  }, [fetchAllFarmers]);

  return (
    <>
      <Navbar />
      <div
        className="container-fluid centered-text"
        style={{ width: "100%", marginTop: -60 }}
      >
        <h2 className="display-6  centered-text margin-top margin-bottom">
          Ferme
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 800,
            margin: "auto",
          }}
        >
          <div class="accordion" id="accordionExample" style={{ width: 300 }}>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  Județ
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div
                  class="accordion-body"
                  style={{
                    padding: 0,
                    position: "absolute",
                    zIndex: 1,
                    maxHeight: 300,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <button
                    onClick={() => {
                      setFiltered(false);
                      fetchAllFarmers();
                    }}
                    style={{ width: 300 }}
                    className="btn btn-light"
                  >
                    Toate
                  </button>
                  {counties.map((county) => {
                    return (
                      <button
                        onClick={() => {
                          setFiltered(true);
                          fetchAllFarmers(county.id, 0);
                        }}
                        style={{ width: 300 }}
                        className="btn btn-light"
                      >
                        {county.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              history.push(`/search-farm/${"name"}`);
            }}
            className="btn btn-secondary"
            style={{ margin: 15 }}
          >
            Căutare după nume
          </button>
          <button
            onClick={() => {
              history.push(`/search-farm/${"email"}`);
            }}
            className="btn btn-secondary"
            style={{ margin: 15 }}
          >
            Căutare după email
          </button>
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
        {!filtered && (
          <PageButtons
            page={page}
            setPage={setPage}
            fetchFunction={fetchAllFarmers}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
}

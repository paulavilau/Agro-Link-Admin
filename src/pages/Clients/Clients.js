import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import { PageButtons } from "../../components/PageButtons";
import { date } from "../../utils/date-functions";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchUrl, setSearchUrl] = useState("");
  const [searchType, setSearchType] = useState("");
  //const token = localStorage.getItem("idToken");
  const { token } = useContext(AuthentificationContext);
  const getClients = useCallback(async () => {
    try {
      let clientsUrl;
      if (searchUrl) {
        clientsUrl = `${baseUrl}clients/search/findByEmailContaining?email=${searchUrl}`;
        console.log(clientsUrl);
      } else {
        clientsUrl = `${baseUrl}clients?size=15&page=${page}`;
      }
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log("Bearer " + token);
      const clientsResponse = await fetch(clientsUrl, options);
      const clientsData = await clientsResponse.json();

      const totalPages = clientsData.page.totalPages;
      const totalElements = clientsData.page.totalElements;
      setTotalPages(totalPages);
      setTotalElements(totalElements);

      const clientsArray = clientsData._embedded.clients;

      const clientsPromises = clientsArray.map(async (client) => {
        const url = `${baseUrl}clients/${client.id}/county`;
        const response = await fetch(url, options);
        const countyData = await response.json();

        return {
          ...client,
          county: countyData,
        };
      });

      const clientsWithCounties = await Promise.all(clientsPromises);

      setClients(clientsWithCounties);
    } catch (e) {
      console.log(e.toString());
    }
  }, [page, token, searchUrl]);

  useEffect(() => {
    getClients();
  }, [getClients]);

  const activateAccount = async (clientId, value) => {
    const url = `${baseUrl}clients/modifyClient`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: clientId,
        active: value,
      }),
    };
    const response = await fetch(url, options);
    if (response.ok) {
      getClients();
      alert("Contul a fost activat/dezactivat !");
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="container-fluid"
        style={{ width: "100%", marginTop: -60 }}
      >
        <div className="centered-text">
          <h2 className="display-6 margin-top margin-bottom">Clienți</h2>
        </div>
        <div style={{ width: 500, margin: "auto" }}>
          <input
            placeHolder="Cautați după adresa de email"
            style={{ width: 500 }}
            className="form-control"
            type="text"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
          ></input>
        </div>
        <br />
        {isPending && <div>Loading...</div>}
        {error && <div>{error}</div>}
        <table className="table table-hover centered-text table-bordered table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Dată înscriere</th>
              <th>Nume</th>
              <th>Prenume</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Denumire firma</th>
              <th>Cif</th>
              <th>Adresa</th>
              <th>Judet</th>
              <th>Localitate</th>
              <th>Activ</th>
              <th></th>
            </tr>
          </thead>
          {clients &&
            clients.map((client) => {
              return (
                <tbody>
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{date(client.creationDt)}</td>
                    <td>{client.firstName}</td>
                    <td>{client.lastName}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{client.companyName}</td>
                    <td>{client.cif}</td>
                    <td>{client.address}</td>
                    <td>{client.county.name}</td>
                    <td>{client.locality}</td>
                    <td>{client.active ? "Da" : "Nu"}</td>

                    <th>
                      {client.active ? (
                        <button
                          onClick={() => {
                            activateAccount(client.id, 0);
                          }}
                          className="btn btn-secondary"
                        >
                          Dezactivare
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            activateAccount(client.id, 1);
                          }}
                          className="btn btn-secondary"
                        >
                          Activare
                        </button>
                      )}
                    </th>
                  </tr>
                </tbody>
              );
            })}
        </table>
        {!searchUrl && (
          <PageButtons
            page={page}
            setPage={setPage}
            fetchFunction={getClients}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
}

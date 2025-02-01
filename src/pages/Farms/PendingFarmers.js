//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";
import { PageButtons } from "../../components/PageButtons";

export default function PendingFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [isFarmersLoading, setIsFarmersLoading] = useState(false);
  const [farmersError, setFarmersError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { token } = useContext(AuthentificationContext);

  const fetchAllFarmers = useCallback(async () => {
    try {
      setIsFarmersLoading(true);
      const url = `${baseUrl}farms/search/findByValidated?validated=0&size=15&page=${page}`;
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      const totalPages = data.page.totalPages;
      setTotalPages(totalPages);
      const farmersData = data._embedded.farms;

      setFarmers(farmersData);
      setIsFarmersLoading(false);
    } catch (error) {
      setFarmersError(error);
      setIsFarmersLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAllFarmers();
  }, [fetchAllFarmers]);

  const validateFarmer = async (farmer, booleanValue) => {
    setIsValidating(true);
    console.log("validare");
    const value = booleanValue ? 1 : 0;

    try {
      setIsFarmersLoading(true);
      const url = `${baseUrl}farms/secure/validateFarm?farmId=${farmer.id}&value=${value}`;
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, requestOptions);

      console.log(response.ok);
      if (response.ok) {
        const url = `${baseUrl}farms/${farmer.id}`;
        const response = await fetch(url);
        const data = await response.json();

        const message = ` Contul tau pe platforma Bio Mag a fost validat. \n Pentru a crea conturi in cadrul fermei tale, utilizeaza codul: \n ${data.code}`;
        const subject = "Activare cont";

        const sendMailUrl = `${baseUrl}emails/sendEmail`;
        const mailBody = {
          to: "vilaupaula@yahoo.ro",
          body: message,
          subject: subject,
        };
        const sendMailOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mailBody),
        };
        await fetch(sendMailUrl, sendMailOptions);
      }

      fetchAllFarmers();
      setIsFarmersLoading(false);
      setIsValidating(false);
    } catch (error) {
      setFarmersError(error);
      setIsFarmersLoading(false);
      setIsValidating(false);
    }
  };

  const deleteFarmer = async (farmer) => {
    setIsValidating(true);

    try {
      setIsFarmersLoading(true);
      const url = `${baseUrl}farms/${farmer.id}`;
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authotization: `Bearer ${token}`,
        },
      };
      const response = await fetch(url, requestOptions);
      //const data = response.json();

      console.log(response.ok);
      if (response.ok) {
        // const userUrl = `${baseUrl}farms/${farmer.id}/farmUsers`;
        // const userResponse = await fetch(userUrl);
        // const userData = await userResponse.json();
        // const farmUser = userData._embedded.farmUsers[0];

        // const deleteUserUrl = `${baseUrl}farmUsers/${farmUser.id}`;
        // await fetch(deleteUserUrl, requestOptions);

        const message = `Bună ziua, \n Din păcate, înscrierea fermei dumneavaostră pe platforma AgroLink nu a fost aprobată. Pentru detalii, contactați-ne la adresa de email: admin@admin.com sau telefonic la numărul 1234567890`;
        const subject = "Răspuns solicitare";
        const sendMailUrl = `${baseUrl}emails/sendEmail`;
        const mailBody = {
          to: "vilaupaula@yahoo.ro",
          body: message,
          subject: subject,
        };
        const sendMailOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mailBody),
        };
        await fetch(sendMailUrl, sendMailOptions);
      }

      fetchAllFarmers();
      setIsFarmersLoading(false);
      setIsValidating(false);
    } catch (error) {
      setFarmersError(error);
      setIsFarmersLoading(false);
      setIsValidating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="container-fluid centered-text"
        style={{ width: "100%", marginTop: -60 }}
      >
        <div style={{ marginTop: -60 }}>
          <h2 className="display-6 margin-top margin-bottom">
            Cereri înscriere fermă
          </h2>
        </div>
        {/* <button
        style={{ marginRight: 10, marginBottom: 10 }}
        className="btn btn-success"
        onClick={() => filterValidatedFarmers(1)}
      >
        Validati
      </button>
      <button
        className="btn btn-danger"
        style={{ marginRight: 10, marginBottom: 10 }}
        onClick={() => filterValidatedFarmers(0)}
      >
        Nevalidati
      </button>
      <button
        className="btn btn-light"
        style={{ marginRight: 10, marginBottom: 10 }}
        onClick={() => fetchAllFarmers()}
      >
        Toti
      </button> */}
        {isFarmersLoading && <div>Loading...</div>}
        {farmersError && <div>{farmersError}</div>}
        <table className="table table-hover table-bordered table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Dată adăugare</th>
              <th>Nume</th>
              <th>Județ</th>
              <th>Localitate</th>
              <th>Adresă</th>
              <th>Telefon</th>
              <th>Email</th>

              <th>
                {isValidating && (
                  <div
                    style={{ width: 30, margin: "auto" }}
                    className="spinner-grow text-light centered"
                  ></div>
                )}
              </th>
              <th>
                {isValidating && (
                  <div
                    style={{ width: 30, margin: "auto" }}
                    className="spinner-grow text-light centered"
                  ></div>
                )}
              </th>
            </tr>
          </thead>
          {farmers &&
            farmers.map((farmer) => {
              return (
                <tbody>
                  <tr key={farmer.id}>
                    <td>{farmer.id}</td>
                    <td>{farmer.creationDt.split("T")[0]}</td>
                    {/* <td>{farmer.active}</td>
                <td>{farmer.activationDate}</td> */}
                    <td>{farmer.name}</td>
                    <td>{farmer.county}</td>
                    <td>{farmer.locality}</td>
                    <td>{farmer.address}</td>
                    <td>{farmer.phone}</td>
                    <td>{farmer.email}</td>
                    {farmer.validated ? (
                      <td>
                        <button
                          className="btn btn-danger"
                          style={{ width: "100%" }}
                          onClick={() => {
                            validateFarmer(farmer, false);
                          }}
                        >
                          Dezactivare cont
                        </button>
                      </td>
                    ) : (
                      <td>
                        <button
                          style={{ width: "100%" }}
                          className="btn btn-success"
                          onClick={() => {
                            validateFarmer(farmer, true);
                          }}
                        >
                          Validare cont
                        </button>
                      </td>
                    )}
                    {farmer.validated ? (
                      <td>
                        <button
                          className="btn btn-danger"
                          style={{ width: "100%" }}
                          onClick={() => {
                            validateFarmer(farmer, false);
                          }}
                        >
                          Respingere
                        </button>
                      </td>
                    ) : (
                      <td>
                        <button
                          style={{ width: "100%" }}
                          className="btn btn-danger"
                          onClick={() => {
                            deleteFarmer(farmer, true);
                          }}
                        >
                          Respingere
                        </button>
                      </td>
                    )}
                  </tr>
                </tbody>
              );
            })}
        </table>
        <PageButtons
          page={page}
          setPage={setPage}
          fetchFunction={fetchAllFarmers}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}

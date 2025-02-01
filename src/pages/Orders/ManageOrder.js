import { Link, useParams } from "react-router-dom";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";

import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";
import userEvent from "@testing-library/user-event";

export default function ManageOrder() {
  const { id, completed } = useParams();
  const [order, setOrder] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isDistributing, setisDistributing] = useState(false);
  const [fundsDistribs, setFundsDistribs] = useState([]);
  const { token } = useContext(AuthentificationContext);

  const getOrder = useCallback(async () => {
    let isMounted = true; // Flag to track if the component is mounted
    try {
      // const token = localStorage.getItem("idToken");
      console.log(token);

      const orderUrl = `${baseUrl}orders/${id}`;
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const orderResponse = await fetch(orderUrl, options);
      const orderData = await orderResponse.json();

      console.log("Order:", orderData);

      if (isMounted) {
        setOrder(orderData);
      }

      const getResponsesUrl = `${baseUrl}orders/${id}/orderStatuses`;
      const responsesResponse = await fetch(getResponsesUrl, options);
      const responsesData = await responsesResponse.json();

      console.log("responses:", responsesData._embedded.orderStatuses);

      const distribs = [];
      const additionalInfoResponses = responsesData._embedded.orderStatuses.map(
        async (status) => {
          const statusId = status.id;

          const farmerUrl = `${baseUrl}orderStatuses/${statusId}/farm`;
          const farmerResponse = await fetch(farmerUrl, options);
          const farmerInfo = await farmerResponse.json();

          console.log("Farm:", farmerInfo);

          const isDistribUrl = `${baseUrl}orders/isFundsDistrib?orderStatusId=${statusId}`;
          const isDistribResponse = await fetch(isDistribUrl, options);
          console.log("Response:", isDistribResponse);

          if (isDistribResponse.ok) {
            const fundsDistribUrl = `${baseUrl}orders/findFundsDistrib?orderStatusId=${statusId}`;
            const fundsDistribResponse = await fetch(fundsDistribUrl, options);
            const fundsDistribData = await fundsDistribResponse.json();

            console.log("Distribuire:", fundsDistribData);

            distribs.push(fundsDistribData);
          }

          return {
            ...status,
            farmer: farmerInfo,
          };
        }
      );
      const orderResponsesArray = await Promise.all(additionalInfoResponses);
      setFundsDistribs(distribs);
      console.log(distribs);

      if (isMounted) {
        setOrderStatuses(orderResponsesArray);
      }
    } catch (e) {
      if (isMounted) {
        setError(e);
      }

      // Cleanup function
      return () => {
        isMounted = false; // Update the mounted flag when the component unmounts
      };
    }
  }, [id, token]);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted

    getOrder();

    return () => {
      isMounted = false; // Update the mounted flag when the component unmounts
    };
  }, [getOrder]);

  const distributeFunds = async (status) => {
    console.log("Status:", status);
    if (!status.clientFee && !status.farmFee) {
      alert("Nu sunt sume de distribuit");
      return;
    }
    try {
      // const promises = orderStatuses.map(async (status) => {
      const url = `${baseUrl}orders/secure/distributeFunds`;
      const body = {
        orderStatusId: status.id,
        clientSum: status.clientFee ? status.clientFee : null,
        farmSum: status.farmFee ? status.farmFee : null,
        adminId: 1,
      };
      console.log(body);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      };
      await fetch(url, options);
      // });
      // await Promise.all(promises);

      getOrder();
      setisDistributing(false);
    } catch (e) {
      setisDistributing(false);
      console.log(e);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid centered-text" style={{ width: "100%" }}>
        <h2 className="display-6 centered-text margin-top">
          Comanda numarul {id} /{" "}
          {order.creationDt && order.creationDt.toString().split("T")[0]}
        </h2>
        <br />
        {isPending && <div>Loading...</div>}
        {error && <div>{error}</div>}
        <table
          className="table table-hover table-bordered table-striped"
          width="70%"
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Fermă</th>
              <th>Subtotal comanda (lei)</th>
              <th>Cost transport (lei)</th>
              <th>Status</th>
              <th>Suma datorată fermă (lei)</th>
              <th>Suma datorată client (lei)</th>
              {completed === "0" && <th>Distribuire venit</th>}
            </tr>
          </thead>
          {orderStatuses.length > 0 &&
            orderStatuses.map((status) => (
              <tbody>
                <tr key={status.id}>
                  <td>{status.id}</td>
                  <td>
                    <Link
                      style={{ textDecoration: "underline", color: "purple" }}
                      to={`/farm-details/${status.farmer.id}`}
                    >
                      {status.farmer.name}
                    </Link>
                  </td>
                  <td>{status.orderSubtotal}</td>
                  <td>{status.deliveryFee}</td>
                  {status.status === -1 && <td>Respinsa</td>}
                  {status.status === 0 && <td>În curs de procesare</td>}
                  {status.status === 1 && <td>Acceptată</td>}
                  {status.status === 2 && <td>Livrată</td>}
                  {status.status === 3 && <td>Finalizată</td>}
                  <td>{status.farmFee ? status.farmFee : "-"}</td>
                  <td>{status.clientFee ? status.clientFee : "-"}</td>
                  {completed === "0" && (
                    <td>
                      <button
                        className="btn btn-light"
                        onClick={() => {
                          distributeFunds(status);
                        }}
                        style={{ marginTop: 20, marginBottom: 20 }}
                      >
                        <span>Distribuire venit</span>
                      </button>
                    </td>
                  )}
                </tr>
              </tbody>
            ))}
        </table>
        <div className="centered-text">
          {isDistributing && (
            <button className="btn btn-primary">
              <span className="spinner-border spinner-border-sm"></span>
              Loading..
            </button>
          )}
        </div>
        {/* <div className="centered-text">
          {isDistributing ? (
            <button className="btn btn-primary">
              <span className="spinner-border spinner-border-sm"></span>
              Loading..
            </button>
          ) : (
            <button
              className="btn btn-light"
              onClick={() => {
                distributeFunds();
              }}
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              <span>Distribuire venituri</span>
            </button>
          )}
        </div> */}
        <div
          className="container-fluid centered-text"
          style={{ width: "100%" }}
        >
          {fundsDistribs && fundsDistribs.length > 0 ? (
            fundsDistribs.map((fundsDistrib) => (
              <>
                <h3 className="display-6 centered-text margin-top">
                  Tabel distribuire venituri
                </h3>
                <br />
                <div className="centered-text">
                  <table
                    className="table table-hover table-bordered table-striped"
                    // width="70%"
                    // style={{ width: "70%" }}
                  >
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Sumă virată client (lei)</th>
                        <th>Suma virată fermă (lei)</th>
                        <th>Data</th>
                        <th>Ora</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={fundsDistrib.id}>
                        <td>{fundsDistrib.id}</td>

                        <td>
                          {fundsDistrib.clientSum
                            ? fundsDistrib.clientSum
                            : "-"}
                        </td>
                        <td>
                          {fundsDistrib.farmSum ? fundsDistrib.farmSum : "-"}
                        </td>
                        <td>{fundsDistrib.date.split("T")[0]}</td>
                        <td>
                          {fundsDistrib.date.split("T")[1].substring(0, 5)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ))
          ) : (
            <div>Veniturile nu au fost distribuite.</div>
          )}
        </div>
      </div>
    </>
  );
}

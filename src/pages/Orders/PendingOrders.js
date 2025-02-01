import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";
import ReactDatePicker from "react-datepicker";
import ButtonMailto from "../../utils/MailButton";

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [orderDates, setOrderDates] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [allOrders, setAllOrders] = useState([]);
  const { user } = useContext(AuthentificationContext);

  //alert(startDate);

  console.log(orders);
  console.log(orderDates);

  const history = useHistory();

  //const token = localStorage.getItem("idToken");
  const { token } = useContext(AuthentificationContext);
  console.log(token);

  const finishOrder = async (orderId) => {
    const url = `${baseUrl}orders/modifyOrder`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        adminId: user.id,
        completed: 1,
      }),
    };
    console.log("Body:", {
      orderId: orderId,
      adminId: user.id,
      completed: 1,
    });
    const response = await fetch(url, options);

    if (response.ok) {
      await getOrders();
      alert("Comanda finalizata!");
    } else {
      alert("Eroare la finalizare comanda");
    }
  };

  const getOrders = useCallback(async () => {
    try {
      setIsPending(true);
      // const ordersUrl = `${baseUrl}orders/search/findByCompleted?completed=0&size=10&page=${page}`;
      const ordersUrl = `${baseUrl}orders/search/findByCompleted?completed=0&all=true`;
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const ordersResponse = await fetch(ordersUrl, options);
      const ordersData = await ordersResponse.json();

      const totalPages = ordersData.page.totalPages;
      const totalElements = ordersData.page.totalElements;
      setTotalPages(totalPages);
      setTotalElements(totalElements);

      const additionalInfoPromises = ordersData._embedded.orders.map(
        async (order) => {
          const clientUrl = `${baseUrl}orders/${order.id}/client`;
          const clientResponse = await fetch(clientUrl, options);
          const clientData = await clientResponse.json();

          return {
            ...order,
            client: clientData,
          };
        }
      );

      const additionalInfoData = await Promise.all(additionalInfoPromises);

      setAllOrders(additionalInfoData);

      const todayDate = startDate.toISOString().split("T")[0];

      //alert(todayDate);

      const filteredOrders = additionalInfoData.filter((order) => {
        const orderDate = order.creationDt.split("T")[0];
        return orderDate === todayDate;
      });

      const sortedOrders = filteredOrders.sort((a, b) => b.id - a.id);

      setOrders(sortedOrders);
      setIsPending(false);
    } catch (e) {
      setIsPending(false);
      setError(e);
    }
  }, [token, page]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    const filteredOrders = allOrders.filter((order) => {
      const orderDate = order.creationDt.split("T")[0];
      const selectedDate = startDate.toISOString().split("T")[0];
      console.log(orderDate);
      console.log(selectedDate);
      return orderDate === selectedDate;
    });
    setOrders(filteredOrders);
    console.log("Comenzi:", filteredOrders);
  }, [allOrders, startDate]);

  return (
    <>
      <Navbar />
      <div
        className="container-fluid centered-text"
        style={{ width: "100%", marginTop: -60 }}
      >
        <div
          className="centered-text"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <h1
            className="display-6 margin-bottom margin-top"
            style={{ width: 800 }}
          >
            Comenzi în curs de procesare
          </h1>
          <div style={{ marginTop: 35, display: "flex", flexDirection: "row" }}>
            <div className="margin-right">Data: </div>
            <ReactDatePicker
              style={{ width: 50 }}
              selected={startDate}
              dateFormat="yyyy-MM-dd"
              onChange={(date) => setStartDate(date)}
            />
          </div>
        </div>

        {error && <div>{error}</div>}
        {!isPending ? (
          <table className="table table-hover table-bordered table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Data</th>
                <th>Ora</th>
                <th>Client</th>
                <th>Telefon</th>
                <th>Valoare plată</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            {orders &&
              orders.map((order) => {
                return (
                  <tbody key={order.id}>
                    <tr>
                      <td>{order.id}</td>
                      <td>{order.creationDt.split("T")[0]}</td>
                      <td>{order.creationDt.split("T")[1].substring(0, 5)}</td>
                      <td>
                        <ButtonMailto
                          label={order.client.email}
                          mailto={`mailto:${order.client.email}`}
                        />
                      </td>
                      <td>{order.phone}</td>
                      <td>{order.paymentValue}</td>
                      <td>
                        <button
                          className="btn btn-light"
                          onClick={() => {
                            history.push(`/order/${order.id}/${0}`);
                          }}
                        >
                          Gestionați
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-light"
                          onClick={() => {
                            finishOrder(order.id);
                          }}
                        >
                          Marcare ca finalizata
                        </button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </table>
        ) : (
          <div
            style={{ display: "flex", paddingTop: 300, alignItems: "center" }}
          >
            <div
              style={{
                margin: "auto",
                justifyContent: "center",
              }}
              className="spinner-border text-success"
              role="status"
            ></div>
          </div>
        )}
      </div>
    </>
  );
}

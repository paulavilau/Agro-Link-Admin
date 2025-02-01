import { Link, useHistory } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

//styles
import "../Main.css";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";
import { PageButtons } from "../../components/PageButtons";
import ReactDatePicker from "react-datepicker";

export default function CompletedOrders() {
  const [orders, setOrders] = useState([]);
  const [orderDates, setOrderDates] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [allOrders, setAllOrders] = useState([]);

  console.log(orders);
  console.log(orderDates);

  const history = useHistory();

  //const token = localStorage.getItem("idToken");
  const { token } = useContext(AuthentificationContext);
  console.log(token);

  const getOrders = useCallback(async () => {
    try {
      const ordersUrl = `${baseUrl}orders/search/findByCompleted?completed=1&size=10&page=${page}`;
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

      const todayDate = selectedDate.toISOString().split("T")[0];

      //alert(todayDate);

      const filteredOrders = additionalInfoData.filter((order) => {
        const orderDate = order.creationDt.split("T")[0];
        return orderDate === todayDate;
      });

      const sortedOrders = filteredOrders.sort((a, b) => b.id - a.id);

      setOrders(sortedOrders);

      setOrders(sortedOrders);
    } catch (e) {
      setError(e);
    }
  }, [token, selectedDate, page]);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    const filteredOrders = allOrders.filter((order) => {
      const orderDate = order.creationDt.split("T")[0];
      const date = selectedDate.toISOString().split("T")[0];
      console.log(orderDate);
      console.log(date);
      return orderDate === date;
    });
    setOrders(filteredOrders);
    console.log("Comenzi:", filteredOrders);
  }, [allOrders, selectedDate]);

  return (
    <>
      <Navbar />
      <div
        className="container-fluid"
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
            Comenzi finalizate
          </h1>
          <div style={{ marginTop: 35, display: "flex", flexDirection: "row" }}>
            <div className="margin-right">Data: </div>
            <ReactDatePicker
              style={{ width: 50 }}
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
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
                <th>Client</th>
                <th>Telefon</th>
                <th>Valoare articole</th>
                <th>Valoare transport</th>
                <th>Localitate</th>
                <th>Adresa</th>
                <th></th>
              </tr>
            </thead>
            {orders &&
              orders.map((order) => {
                return (
                  <tbody>
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.creationDt}</td>
                      <td>
                        <Link to={`/order/${order.id}`}>
                          {order.client.email}
                        </Link>
                      </td>
                      <td>{order.phone}</td>
                      <td>{order.productsValue}</td>
                      <td>{order.deliveryFee}</td>
                      <td>{order.locality}</td>
                      <td>{order.address}</td>
                      <td>
                        <button
                          className="btn btn-light"
                          onClick={() => {
                            history.push(`/order/${order.id}/${1}`);
                          }}
                        >
                          Detalii
                        </button>
                        {/* <Link to={`/order/${order.id}`}>Gestionare</Link> */}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </table>
        ) : (
          <div class="spinner-grow text-primary"></div>
        )}
        {/* <PageButtons
          page={page}
          setPage={setPage}
          fetchFunction={getOrders}
          totalPages={totalPages}
        /> */}
      </div>
    </>
  );
}

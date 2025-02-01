import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthentificationContext } from "./context/authentification.context";
import OrdersMain from "./pages/Orders/OrdersMain";
import CompletedOrders from "./pages/Orders/CompletedOrders";
import PendingOrders from "./pages/Orders/PendingOrders";
import Order from "./pages/Orders/ManageOrder";
import Clients from "./pages/Clients/Clients";
import PendingFarmers from "./pages/Farms/PendingFarmers";
import Farmers from "./pages/Farms/Farmers";
import ProductsMain from "./pages/Products/ProductsMain";
import Produse from "./pages/Products/Produse";
import Categories from "./pages/Categories/Categories";
import AddCategory from "./pages/Categories/AddCategory";
import Subcategories from "./pages/Categories/Subcategories";
import AddSubcategory from "./pages/Categories/AddSubcategory";
import ModifyCategory from "./pages/Categories/ModifyCategory";
import LoginPage from "./pages/Login/LoginPage";
import FarmDetails from "./pages/Farms/FarmDetails";
import SearchFarms from "./pages/Farms/SearchFarms";

const Router = () => {
  const { user } = useContext(AuthentificationContext);

  return (
    <BrowserRouter>
      <Switch>
        {!user ? (
          <Route path="/">
            <LoginPage />
          </Route>
        ) : (
          <>
            <Route exact path="/">
              <OrdersMain />
            </Route>
            <Route path="/home-page">
              <OrdersMain />
            </Route>
            <Route path="/completed-orders">
              <CompletedOrders />
            </Route>
            <Route path="/pending-orders">
              <PendingOrders />
            </Route>
            <Route path="/order/:id/:completed">
              <Order />
            </Route>
            <Route path="/clients">
              <Clients />
            </Route>
            <Route path="/pending-farmers">
              <PendingFarmers />
            </Route>
            <Route path="/farmers">
              <Farmers />
            </Route>
            <Route path="/farm-details/:id">
              <FarmDetails />
            </Route>
            <Route path="/search-farm/:type">
              <SearchFarms />
            </Route>
            <Route path="/products-main">
              <ProductsMain />
            </Route>
            <Route path="/products">
              <Produse />
            </Route>
            <Route path="/categories">
              <Categories />
            </Route>
            <Route path="/addCategory">
              <AddCategory />
            </Route>
            <Route path="/subcategories/:id">
              <Subcategories />
            </Route>
            <Route path="/addSubcategory/:id/:categoryName">
              <AddSubcategory />
            </Route>
            <Route path="/modify-category/:id/:type">
              <ModifyCategory />
            </Route>
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
};

export default Router;

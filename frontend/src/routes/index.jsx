import { Route, Routes, BrowserRouter } from "react-router-dom";
import routes from "./routes";

const Router = () => {
  const generateRoute = (routes) => {
    if (!routes.length) return <></>;

    return routes?.map((route) => (
      <Route path={route.pathname} element={route.element}>
        {generateRoute(route?.children)}
      </Route>
    ));
  };

  return (
    <BrowserRouter>
      <Routes>{generateRoute(routes)}</Routes>
    </BrowserRouter>
  );
};

export default Router;

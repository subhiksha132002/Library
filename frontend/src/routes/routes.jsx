import { Members } from "../views/Members";
import { Books } from "../views/Books";
import Login from "../views/Login";
import { ProtectedRoute } from "../shared/ProtectedRoute";
import Home from "../views/Home";
import { Navigate } from "react-router";
import Book from "../views/Book";
import Report from "../views/Report";

const routes = [
  {
    pathname: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      {
        pathname: "/members",
        element: <Members />,
        children: [],
      },
      {
        pathname: "/books",
        element: <Books />,
        children: [],
      },
      {
        pathname: "/books/:id",
        element: <Book />,
        children: [],
      },
      {
        pathname: "/report",
        element: <Report />,
        children: [],
      },
    ],
  },
  {
    pathname: "/auth/login",
    element: <Login />,
    children: [],
  },
  {
    pathname: "/*",
    element: <Navigate to="/auth/login" />,
    children: [],
  },
];

export default routes;

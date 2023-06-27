import React, { useState } from "react";
import UserContext from "./Context/UserContext";
import Router from "./routes";

import "./App.css";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("MEMBER")) || {}
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router />
    </UserContext.Provider>
  );
}

export default App;

import React, { useContext } from "react";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { Outlet, useLocation, useNavigate } from "react-router";
import getMenus from "./sidebar";
import UserContext from "../../Context/UserContext";

import "./home.css";

export default function Home() {
  const { user, setUser } = useContext(UserContext);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  return (
    <Layout className="app">
      <Sider collapsible breakpoint="lg">
        <Menu
          activeKey={pathname}
          items={getMenus(user)}
          mode="inline"
          onClick={({ key }) => {
            const isLogoutButton = "/auth/login" === key;

            if (isLogoutButton) {
              localStorage.clear();
              setUser({});
            }
            navigate(key);
          }}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

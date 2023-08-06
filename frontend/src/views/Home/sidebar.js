import {
  AreaChartOutlined,
  BarChartOutlined,
  BookOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

const getMenus = (user) => {
  let menus = [
    {
      key: "/books",
      label: "Books",
      icon: <BookOutlined />,
    },
  ];

  const isAdmin = user?.type === "admin";

  if (isAdmin)
    menus = [
      ...menus,
      {
        key: "/members",
        label: "Members",
        icon: <UserOutlined />,
      },
      {
        key: "/report",
        label: "Reports",
        icon: <AreaChartOutlined />,
      },
      {
        key: "/analytics",
        label: "Analytics",
        icon: <BarChartOutlined />,
      },
    ];

  return [
    ...menus,
    {
      key: "/auth/login",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];
};

export default getMenus;

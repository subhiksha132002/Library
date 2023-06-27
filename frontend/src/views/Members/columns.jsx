import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default (handleEdit, handleDelete) => [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
  },
  {
    title: "Register Number",
    dataIndex: "registerNumber",
  },
  {
    render: (member) => <EditOutlined onClick={() => handleEdit(member)} />,
  },
  {
    render: (member) => <DeleteOutlined onClick={() => handleDelete(member)} />,
  },
];

const generateColumns = (
  onIssueBook,
  type = "requested",
  disableButton = false
) => [
  {
    title: "Name",
    dataIndex: ["member", "name"],
  },
  {
    title: "Email",
    dataIndex: ["member", "email"],
  },
  {
    title: "Role",
    dataIndex: ["member", "type"],
    className: "text-capitalize",
  },
  {
    title: "Phone Number",
    dataIndex: ["member", "phone"],
  },
  {
    title: "Register Number",
    dataIndex: ["member", "registerNumber"],
  },

  {
    title: "",
    render: (book) =>
      !disableButton && (
        <span
          className="cursor-pointer"
          style={{ color: "#0000EE" }}
          onClick={() => onIssueBook(book, type)}
        >
          {type === "requested" ? "Issue" : "Return"} Book
        </span>
      ),
  },
];

export default generateColumns;

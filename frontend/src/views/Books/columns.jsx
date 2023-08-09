import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const generateColumns = (handleEdit, handleDelete, user, onBookRequest) => [
  {
    title: "Access No",
    dataIndex: "edition",
    align: "center",
  },
  {
    title: "Title",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "Author",
    dataIndex: "author",
  },
  {
    title: "Availability",
    dataIndex: "count",
    align: "center",
  },
  ...(user?.type === "admin"
    ? [
        {
          title: "Requests",
          dataIndex: "requested",
          align: "center",
          render: (requested) => requested?.length,
        },
        {
          title: "Issued",
          dataIndex: "issuedTo",
          align: "center",
          render: (issuedTo) => issuedTo?.length,
        },
        {
          render: (book) => (
            <EditOutlined
              onClick={(evt) => {
                evt?.stopPropagation();
                handleEdit(book);
              }}
            />
          ),
        },
        {
          render: (book) => (
            <DeleteOutlined
              onClick={(evt) => {
                evt?.stopPropagation();
                handleDelete(book);
              }}
            />
          ),
        },
      ]
    : [
        {
          render: (book) => {
            const isBookAlreadyIssued = book?.issuedTo?.some(
              (issued) => issued?.member?._id === user?._id
            );

            const isBookAlreadyRequested = book?.requested?.some(
              (request) => request?.member?._id === user?._id
            );

            return isBookAlreadyIssued ? (
              <span>Issued</span>
            ) : (
              <span
                className={`link ${isBookAlreadyRequested ? "disabled" : ""}`}
                onClick={(evt) => {
                  if (isBookAlreadyRequested) return;

                  evt?.stopPropagation();
                  onBookRequest?.(book);
                }}
              >
                {isBookAlreadyRequested ? "Already Requested" : "Request Book"}
              </span>
            );
          },
        },
      ]),
];

export default generateColumns;

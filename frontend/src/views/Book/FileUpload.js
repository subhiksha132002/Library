import React, { useState, useRef } from "react";
import { Button, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./FileUpload.css";
import { ApiRoutes } from "../../routes/apiRoutes";
import { axiosInstance } from "../../axiosInstance";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadComplete(false);
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      return; // Do nothing if no file is selected
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    axiosInstance
      .post(ApiRoutes.UPLOAD, formData)
      .then((response) => {
        console.log(response.data);
        setUploadComplete(true);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    setUploadComplete(false);
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-buttons">
        <Button
          className="custom-upload-Button"
          onClick={handleCustomButtonClick}
          disabled={loading}
        >
          <UploadOutlined /> Select File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the default file input
        />
        {selectedFile && (
          <div className="selected-file-name">
            Selected file: {selectedFile.name}
          </div>
        )}
        <Button
          className="upload-file-Button"
          onClick={handleFileUpload}
          disabled={!selectedFile || loading}
        >
          Upload
        </Button>
      </div>
      <Modal
        visible={uploadComplete}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        <h3>File upload complete!</h3>
      </Modal>
    </div>
  );
};

export default FileUpload;

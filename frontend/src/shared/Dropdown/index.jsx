import React from "react";
import { useField } from "formik";
import { Select } from "antd";

import "./dropdown.css";

const Dropdown = ({ label, name, options = [], defaultValue }) => {
  const [{ value }, { error, touched }, { setValue }] = useField(name);

  return (
    <div className="dropdown">
      <label htmlFor={name}>{label}</label>
      <Select
        name={name}
        onChange={(value) => setValue(value)}
        options={options}
        value={value}
      />
      {error && touched && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default Dropdown;

import React from "react";
import { Space } from "antd";
import { Field } from "formik";
import { Input as AntInput } from "antd";
import "./input.css";

const Input = ({ name, label }) => {
  return (
    <div className="input">
      <span>{label}</span>
      <Field name={name} as={AntInput} />
    </div>
  );
};

export default Input;

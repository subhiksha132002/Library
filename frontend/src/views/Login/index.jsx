import React from "react";
import { Form, Formik } from "formik";
import AuthService from "../../service/AuthService/auth.service";
import { Button } from "antd";
import loginValidation from "./loginValidation";
import Input from "../../shared/Input";

import "./login.css";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const { loginUser } = AuthService();

  return (
    <div className="login">
      <h1 className="text-white">Welcome to Mathematics Department Library</h1>
      <div className="login__form">
        <Formik
          initialValues={initialValues}
          onSubmit={loginUser}
          validationSchema={loginValidation}
        >
          {() => (
            <Form autoComplete="off">
              <Input name="email" label="Email" autoComplete="off" />
              <Input
                name="password"
                label="Password"
                type="password"
                autoComplete="off"
              />
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;

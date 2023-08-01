import React from "react";
import { Formik, Form } from "formik";
import Input from "../../../shared/Input";
import Dropdown from "../../../shared/Dropdown";
import { Button } from "antd";
import { MemberService } from "../../../service/MemberService/member.service";
import validationSchema from "./memberForm.validation";

import "./memberForm.css";

const MemberForm = ({ member = { type: "student" }, onSubmit, onCancel }) => {
  const { addMember, updateMember } = MemberService();

  const handleSubmit = async (member) => {
    const newMember = await (member._id ? updateMember : addMember)(member);
    if (newMember) onSubmit?.(newMember);
  };

  return (
    <Formik
      initialValues={member}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="member-form">
          <Dropdown
            name="type"
            label="Member Type"
            options={[
              {
                label: "Staff",
                value: "staff",
              },
              {
                label: "Student",
                value: "student",
              },
            ]}
          />
          <Input name="name" label="Name" autocomplete="off" />
          <Input name="email" label="Email" autocomplete="off" />
          <Input name="phone" label="Phone Number" autocomplete="off" />
          <Input
            name="registerNumber"
            label="Register Number"
            autocomplete="off"
          />
          <div className="member-form__footer">
            <Button htmlType="reset" onClick={onCancel}>
              Cancel
            </Button>
            <Button htmlType="submit" type="primary" loading={isSubmitting}>
              {member?._id ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default MemberForm;

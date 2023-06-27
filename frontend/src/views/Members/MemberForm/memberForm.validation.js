import * as Yup from "yup";

export default Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  name: Yup.string().required().label("Name"),
  phone: Yup.string().min(10).max(10).required().label("Phone Number"),
  registerNumber: Yup.string().required().label("Register Number"),
  type: Yup.string().oneOf(["staff", "student"]).required().label("Type"),
});

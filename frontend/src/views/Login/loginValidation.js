import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters")
    .required()
    .label("Password"),
});

export default validationSchema;

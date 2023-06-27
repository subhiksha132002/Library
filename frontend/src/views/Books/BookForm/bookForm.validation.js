import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  author: Yup.string().required().label("Author"),
  count: Yup.number().required().label("Availability"),
  edition: Yup.string(),
  title: Yup.string().required().label("Title"),
});

export default validationSchema;

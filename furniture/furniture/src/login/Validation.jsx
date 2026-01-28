
import * as Yup from "yup";

const registerValidation = Yup.object({
  firstName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces allowed")
    .required("First name is required"),
  secondName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces allowed")
    .required("Second name is required"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default registerValidation;

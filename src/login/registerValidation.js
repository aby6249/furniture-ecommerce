import * as Yup from "yup";

const nameRegex = /^[A-Za-z0-9 ]+$/;

const registerValidation = Yup.object({
  firstName: Yup.string()
    .matches(nameRegex, "Only letters, numbers, and spaces are allowed")
    .test(
      "has-letter",
      "First name must contain at least one letter",
      (value) => /[A-Za-z]/.test(value || "")
    )
    .required("First name is required"),

  secondName: Yup.string()
    .matches(nameRegex, "Only letters, numbers, and spaces are allowed")
    .test(
      "has-letter",
      "Second name must contain at least one letter",
      (value) => /[A-Za-z]/.test(value || "")
    )
    .required("Second name is required"),

  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords not match")
    .required("Confirm password is required"),
});

export default registerValidation;

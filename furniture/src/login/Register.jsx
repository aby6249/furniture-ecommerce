import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import registerValidation from "./registerValidation";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const handleNameChange = (e, fieldName, formik) => {
    const value = e.target.value;
    if (/^[A-Za-z0-9\s]*$/.test(value)) {
      formik.setFieldValue(fieldName, value);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      secondName: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidation,

    onSubmit: async (values, { resetForm }) => {
      try {
        
        const payload = {
          first_name: values.firstName,
          second_name: values.secondName,
          mobile: values.mobile,
          email: values.email,
          password: values.password,
          confirm_password: values.confirmPassword,
        };

        await axios.post(
          "http://127.0.0.1:8000/api/accounts/register/",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Registration successful!", { autoClose: 2000 });
        resetForm();
        navigate("/login");
      } catch (err) {
        console.error(err);


        if (err.response?.data) {
          const errors = err.response.data;

          if (typeof errors === "string") {
            toast.error(errors);
          } else {
            Object.values(errors).forEach((msg) => {
              toast.error(Array.isArray(msg) ? msg[0] : msg);
            });
          }
        } else {
          toast.error("Something went wrong during registration.");
        }
      }
    },
  });

  return (
    <div className="register-page">
      <div className="register">
        <form onSubmit={formik.handleSubmit}>
          <div className="text-4xl font-extrabold italic bg-gradient-to-r from-[#d62828] via-[#f77f00] to-[#fcbf49] text-transparent bg-clip-text tracking-wide text-center mb-2">
            UrbanNest
          </div>

          <h2 className="register-title mb-4">Create an account</h2>

          <label className="heading"></label>
          <input
            type="text"
            placeholder="First Name *"
            value={formik.values.firstName}
            onChange={(e) => handleNameChange(e, "firstName", formik)}
            onBlur={formik.handleBlur}
            className="text-one"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="error-text">{formik.errors.firstName}</p>
          )}

          <label className="heading"></label>
          <input
            type="text"
            placeholder="Second Name *"
            value={formik.values.secondName}
            onChange={(e) => handleNameChange(e, "secondName", formik)}
            onBlur={formik.handleBlur}
            className="text-one"
          />
          {formik.touched.secondName && formik.errors.secondName && (
            <p className="error-text">{formik.errors.secondName}</p>
          )}

          <label className="heading"></label>
          <input
            type="tel"
            placeholder="Mobile Number *"
            {...formik.getFieldProps("mobile")}
            className="text-one"
          />
          {formik.touched.mobile && formik.errors.mobile && (
            <p className="error-text">{formik.errors.mobile}</p>
          )}

          <label className="heading"></label>
          <input
            type="email"
            placeholder="Email Address *"
            {...formik.getFieldProps("email")}
            className="text-one"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="error-text">{formik.errors.email}</p>
          )}

          <label className="heading"></label>
          <input
            type="password"
            placeholder="Password *"
            {...formik.getFieldProps("password")}
            className="text-one"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="error-text">{formik.errors.password}</p>
          )}

          <label className="heading"></label>
          <input
            type="password"
            placeholder="Confirm Password *"
            {...formik.getFieldProps("confirmPassword")}
            className="text-one"
          />
          {formik.touched.confirmPassword &&
            formik.errors.confirmPassword && (
              <p className="error-text">
                {formik.errors.confirmPassword}
              </p>
            )}

          <button type="submit" className="button-register">
            Submit
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;

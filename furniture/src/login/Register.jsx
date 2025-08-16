import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import registerValidation from "./registerValidation";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!formik.values.email) {
      toast.error("Please enter an email first!");
      return;
    }
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpEmail(formik.values.email);
    toast.info(`OTP: ${randomOtp}`, { autoClose: 10000 });
  };

  const handleNameChange = (e, fieldName) => {
    const value = e.target.value;
    if (/^[A-Za-z0-9\s]*$/.test(value)) {
      formik.setFieldValue(fieldName, value);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const verifyOtp = () => {
    if (formik.values.email !== otpEmail) {
      toast.error("OTP does not match the current email.");
      return;
    }
    if (otp.join("") === generatedOtp) {
      setIsEmailVerified(true);
      toast.success("OTP verified successfully!", { autoClose: 2000 });
      setGeneratedOtp("");
      setOtp(Array(6).fill(""));
    } else {
      toast.error("Invalid OTP. Please try again.", { autoClose: 2000 });
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
      if (!isEmailVerified || values.email !== otpEmail) {
        toast.error("Please verify your email before registering.");
        return;
      }

      try {
        const usersRes = await axios.get("http://localhost:3000/users");
        const existingUser = usersRes.data.find(
          (user) => user.email === values.email
        );

        if (existingUser) {
          toast.error("User with this email already exists");
          return;
        }

        let newId;
        if (usersRes.data.length === 0) {
          newId = "001";
        } else {
          const lastUser = usersRes.data[usersRes.data.length - 1];
          const lastId = parseInt(lastUser.id, 10);
          newId = (lastId + 1).toString().padStart(3, "0");
        }

        await axios.post("http://localhost:3000/users", {
          id: newId,
          ...values,
          role: "user",
          isBlocked: false,
          isDeleted: false,
          
        });

        toast.success("Registration successful!", { autoClose: 2000 });
        resetForm();
        setOtp(Array(6).fill(""));
        setGeneratedOtp("");
        setOtpEmail("");
        setIsEmailVerified(false);
        navigate("/login");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong during registration.");
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

          <label className="heading">First Name</label>
          <input
            type="text"
            placeholder="First Name *"
            value={formik.values.firstName}
            onChange={(e) => handleNameChange(e, "firstName")}
            onBlur={formik.handleBlur}
            className="text-one"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="error-text">{formik.errors.firstName}</p>
          )}

          <label className="heading">Second Name</label>
          <input
            type="text"
            placeholder="Second Name *"
            value={formik.values.secondName}
            onChange={(e) => handleNameChange(e, "secondName")}
            onBlur={formik.handleBlur}
            className="text-one"
          />
          {formik.touched.secondName && formik.errors.secondName && (
            <p className="error-text">{formik.errors.secondName}</p>
          )}

          <label className="heading">Mobile Number</label>
          <input
            type="tel"
            placeholder="Mobile Number *"
            {...formik.getFieldProps("mobile")}
            className="text-one"
          />
          {formik.touched.mobile && formik.errors.mobile && (
            <p className="error-text">{formik.errors.mobile}</p>
          )}

          <label className="heading">Email</label>
          <input
            type="email"
            placeholder="Email Address *"
            {...formik.getFieldProps("email")}
            className="text-one"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="error-text">{formik.errors.email}</p>
          )}

          <label className="heading">OTP</label>
          <button type="button" className="button-register" onClick={sendOtp}>
            Send OTP
          </button>
          <div className="otp-container">
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                className="otp-box"
                value={otp[index]}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpBackspace(e, index)}
              />
            ))}
          </div>
          <button type="button" className="button-register" onClick={verifyOtp}>
            Verify OTP
          </button>

          <label className="heading">Password</label>
          <input
            type="password"
            placeholder="Password *"
            {...formik.getFieldProps("password")}
            className="text-one"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="error-text">{formik.errors.password}</p>
          )}

          


          <label className="heading">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password *"
            {...formik.getFieldProps("confirmPassword")}
            className="text-one"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="error-text">{formik.errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            className="button-register"
            disabled={!isEmailVerified}
          >
            Submit
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;

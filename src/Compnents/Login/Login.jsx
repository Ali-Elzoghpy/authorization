import React, { useContext, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { contextAuth } from "./../Context/AuthContextProvider";

export default function Login() {
  let userInfo = useContext(contextAuth);
  let { token, setToken } = userInfo;
  let [loadingSpiner, setLoading] = useState(true);
  let navigat = useNavigate();
  let [displayErro, setErr] = useState(false);
  let validationSchema = yup.object({
    email: yup
      .string()
      .required("email is required")
      .email("email must be vaalid"),
    password: yup
      .string()
      .required("passowrd is required")
      .matches(/^[a-zA-Z0-9!@#$%^&*]{6,16}$/, "passowed must be valid"),
  });
  function logInApi(data) {
    setLoading(false);
    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/signin", data)
      .then((res) => {
        if (res.data.message == "success") {
          setLoading(true);
          setToken(res.data.token)
          localStorage.setItem("token",res.data.token)
          navigat("/");
        }
      })
      .catch((res) => {
        setLoading(true);

        setErr(res.response.data.message);
      });
  }

  let logInFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: logInApi,
  });

  return (
    <>
      {displayErro ? (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          {displayErro}
        </div>
      ) : (
        ""
      )}

      <h1 className="my-5">Log In :</h1>
      <form action="" onSubmit={logInFormik.handleSubmit}>
        <div className="mb-3">
          <input
            value={logInFormik.values.email}
            onChange={logInFormik.handleChange}
            onBlur={logInFormik.handleBlur}
            name="email"
            type="email"
            className=" border w-full  p-1 focus:outline-none "
            placeholder="Email"
          />
          {logInFormik.errors.email && logInFormik.touched.email ? (
            <p className="text-red-700 mb-3 "> {logInFormik.errors.email} </p>
          ) : (
            ""
          )}
        </div>
        <div className="mb-3">
          <input
            value={logInFormik.values.password}
            onChange={logInFormik.handleChange}
            onBlur={logInFormik.handleBlur}
            name="password"
            type="password"
            className=" border w-full  p-1 focus:outline-none "
            placeholder="password"
          />
          {logInFormik.errors.password && logInFormik.touched.password ? (
            <p className="text-red-700 mb-3 ">
              {" "}
              {logInFormik.errors.password}{" "}
            </p>
          ) : (
            ""
          )}
        </div>

        <div className="flex  flex flex-col items-start">
          <button
            disabled={!(logInFormik.isValid && logInFormik.dirty)}
            type="submit"
            className="bg-mainColor rounded p-1 text-white mt-3  disabled:bg-opacity-20  d-bl"
          >
            {loadingSpiner ? "Submit" : <i class="fas fa-spinner fa-spin"></i>}
          </button>

          <Link to="/forgetPassword" className="">
            {" "}
            Forget Pass ?{" "}
          </Link>
        </div>
      </form>
    </>
  );
}

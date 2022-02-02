import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions/authActions';
import Layout from '../components/Layout';

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";

import Notice from "../components/notice";
import Input from "../components/input";

const form = {
  id: "login",
  inputs: [
    {
      id: "email",
      type: "email",
      label: "E-Mail Address",
      required: true,
      value: "",
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      required: true,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Login",
  },
  button: {
    type: "button",
    label: "Forgot password ?",
  },
};

const LoginPage = (props) => {
  const RESET_NOTICE = { type: "", message: "" };
  const [notice, setNotice] = useState(RESET_NOTICE);
  const router = useRouter();

  const values = {};
  form.inputs.forEach((input) => (values[input.id] = input.value));
  const [formData, setFormData] = useState(values);

  const handleInputChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotice(RESET_NOTICE);
    try {
      props.authenticate(
        { email: formData.email, password: formData.password },
        'login'
      );
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    router.push("/forgotPassword");
  };

  return (
    <>
      <div className="boxContainer auth">
        <h1 className="pageHeading">Login</h1>
        <form id={form.id} onSubmit={handleSubmit}>
          {form.inputs.map((input, key) => {
            return (
              <Input
                key={key}
                formId={form.id}
                id={input.id}
                type={input.type}
                label={input.label}
                required={input.required}
                value={formData[input.id]}
                setValue={(value) => handleInputChange(input.id, value)}
              />
            );
          })}
          {notice.message && (
            <Notice status={notice.type} mini>
              {notice.message}
            </Notice>
          )}
          <button type={form.submitButton.type}>{form.submitButton.label}</button>
          <button type={form.button.type} onClick={handlePasswordReset}>
            {form.button.label}
          </button>
        </form>
        <p>
          Don't have an account yet?{" "}
          <a href="/signup" rel="noreferrer noopener">
            <strong>Sign up here.</strong>
          </a>
        </p>
      </div>
    </>
  );
};

export default connect(
  state => state,
  actions
)(LoginPage);

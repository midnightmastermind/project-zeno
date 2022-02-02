import { useState, useContext } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";
import actions from '../redux/actions/authActions';
import Input from "../components/input";
import Notice from "../components/notice";
import { connect } from 'react-redux';

const form = {
  id: "signup",
  inputs: [
    {
      id: "name",
      type: "text",
      label: "Name",
      required: true,
      value: "",
    },
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
    {
      id: "confirm_password",
      type: "password",
      label: "Confirm Password",
      required: true,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Sign up",
  },
};

const SignupPage = (props) => {
  const RESET_NOTICE = { type: "", message: "" };
  const [notice, setNotice] = useState(RESET_NOTICE);
  const router = useRouter();

  const values = {};
  form.inputs.forEach((input) => (values[input.id] = input.value));
  const [formData, setFormData] = useState(values);

  const handleInputChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(RESET_NOTICE);
    try {
        props.signup(
          { name: formData.name, email: formData.email, password: formData.password, confirm_password: formData.confirm_password },
          'signup'
        );
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
    }
  };

  return (
    <>
      <div className="boxContainer auth">
        <h1 className="pageHeading">Signup</h1>
        <form id={form.id} method="post" onSubmit={handleSubmit}>
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
        </form>
      </div>
    </>
  );
};

export const getServerSideProps = (context) => {
  const { token } = cookies(context);
  const res = context.res;
  if (token) {
    res.writeHead(302, { Location: `/account` });
    res.end();
  }
  return { props: {} };
};


export default connect(
  state => state,
  actions
)(SignupPage);

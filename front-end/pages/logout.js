import { useEffect } from "react";
import useRouter from "next/router";
import { connect } from 'react-redux';
import actions from '../redux/actions/authActions'
import cookies from "next-cookies";

const LogoutPage = (props) => {
  useEffect(() => {
    const logoutOnServer = async () => {
      const router = useRouter;
      try {
        props.deauthenticate();
        router.push("/login");
      } catch (err) {
        console.log(err);
      }
    };
    logoutOnServer();
  }, []);
  return null;
};

export const getServerSideProps = async (context) => {
  const { token } = cookies(context);
  const res = context.res;

  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
  }

  return { props: {} };
};

export default connect(
  state => state,
  actions
)(LogoutPage);

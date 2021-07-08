import Router from 'next/router';
import axios from 'axios';
import { AUTHENTICATE, DEAUTHENTICATE, USER } from '../types';
import { setCookie, removeCookie } from '../../utils/cookie';
import { fetchBlocks } from './blockActions';
// register user
const signup = ({ name, email, password, confirm_password }, type) => {
  if (type !== 'signup') {
    throw new Error('Wrong API call!');
  }
  return (dispatch) => {
    axios.post(`${process.env.NEXT_PUBLIC_API}/users/${type}`, {name, email, password, confirm_password })
      .then((response) => {
        Router.push('/login');
        console.log(response.data.message);
      })
      .catch((err) => {
          alert(err);
      });
  };
};
// gets token from the api and stores it in the redux store and in cookie
const authenticate = ({ email, password }, type) => {
  if (type !== 'login') {
    throw new Error('Wrong API call!');
  }
  return (dispatch) => {
    axios.post(`${process.env.NEXT_PUBLIC_API}/users/${type}`, { email, password })
      .then((response) => {

        setCookie('token', response.data.token);
        Router.push('/');
        dispatch(fetchBlocks());
        dispatch({type: AUTHENTICATE, payload: response.data.token});
      })
      .catch((err) => {
        alert(err);
      });
  };
};

// gets the token from the cookie and saves it in the store
const reauthenticate = (token) => {
  return (dispatch) => {
    dispatch({type: AUTHENTICATE, payload: token});
  };
};

// removing the token
const deauthenticate = () => {
  return (dispatch) => {
    removeCookie('token');
    Router.push('/');
    dispatch({type: DEAUTHENTICATE});
  };
};

const getUser = ({ token }, type) => {
  console.log(token)
  return (dispatch) => {
    axios.get(`${process.env.NEXT_PUBLIC_API}/${type}`,{headers: {
      "Authorization" : "bearer " + token
    }
  })
      .then((response) => {
        dispatch({ type: USER, payload: response.data.data.user });
      })
      .catch((err) => {
        switch (err.response.status) {
          case 401:
            Router.push('/');
            break;
          case 422:
            alert(err.response.data.meta.message);
            break;
          case 500:
          alert('Interval server error! Try again!');
          case 503:
          alert(err.response.data.meta.message);
          Router.push('/');
            break;
          default:
          alert(err.response.data.meta.message);
            break;
        }
      });
  };
};


export default {
  signup,
  authenticate,
  reauthenticate,
  deauthenticate,
  getUser,
};


import Router from 'next/router';
import actions from '../redux/actions/authActions';
import { getCookie, setCookie } from './cookie';

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
export default function(ctx) {
  if(!ctx.reduxStore.getState().auth.token) {
    if(ctx.req.headers.cookie) {
      let token = getCookie('token', ctx.req);
      ctx.reduxStore.dispatch(actions.reauthenticate(token));
    }
  } else {
    const token = ctx.reduxStore.getState().auth.token;

    if(token && (ctx.pathname === '/login' || ctx.pathname === '/signup')) {
      setTimeout(function() {
        Router.push('/');
      }, 0);
    }
  }
}

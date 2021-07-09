import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions/authActions';
import Layout from '../components/Layout';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  static getInitialProps(ctx) {
    return {props: {}}
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.authenticate(
      { email: this.state.email_id, password: this.state.password },
      'login'
    );
  }

  render() {
    return (
      <div className="boxContainer fullWidth">
        <h3 className="title is-3">Sign In</h3>
        <form
          onSubmit={this.handleSubmit.bind(this)}
          className="container"
          style={{ width: '540px' }}
        >
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="email"
                placeholder="Email ID"
                required
                value={this.state.email_id}
                onChange={e => this.setState({ email_id: e.target.value })}
              />
            </p>
          </div>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="password"
                placeholder="Password"
                required
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </p>
          </div>
          <div className="field">
            <p className="control has-text-centered">
              <button type="submit" className="button is-success">
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  state => state,
  actions
)(Login);

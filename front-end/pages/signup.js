import React from 'react';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import actions from '../redux/actions/authActions';
import initialize from '../utils/initialize';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      password: '',
      confirm_password:''
    };
  }

  static getInitialProps(ctx) {
    initialize(ctx);

    return {props: {}}
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    this.props.signup(
      { name: this.state.name, email: this.state.email, password: this.state.password, confirm_password: this.state.confirm_password },
      'signup'
    );
  }

  render() {
    return (
      <div class="boxContainer fullWidth">
        <h3 className="title is-3">Sign Up</h3>
        <form
          onSubmit={this.handleSubmit.bind(this)}
          className="container"
          style={{ width: '540px' }}
        >
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                placeholder="Name"
                required
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </p>
          </div>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="email"
                placeholder="Email"
                required
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
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
            <p className="control">
              <input
                className="input"
                type="password"
                placeholder="Password"
                required
                value={this.state.confirm_password}
                onChange={e => this.setState({ confirm_password: e.target.value })}
              />
            </p>
          </div>
          <div className="field">
            <p className="control has-text-centered">
              <button type="submit" className="button is-success">
                Register
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
)(Signup);

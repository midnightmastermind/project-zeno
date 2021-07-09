import React from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Button from "../components/button";
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import { useRouter } from 'next/router'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  render() {
    return (
      <div className={`${styles.homepageContainer} boxContainer fullWidth`}>
        <h1>Welcome to project<span style={{ fontSize: "1.75rem" }}>.zeno</span></h1>
        <div className={styles.homepageContent}>
          <div className={styles.homepagePreview}>
            <div className={styles.preview}>
              <h2>Journal</h2>
            </div>
            <div className={styles.preview}>
              <h2>Notes</h2>
            </div>
            <div className={styles.preview}>
              <h2>Calendar</h2>
            </div>
            <div className={styles.preview}>
              <h2>Tasks</h2>
            </div>
          </div>
            { !(this.props.auth.token) && (<div className={styles.loginBar}>
              <Button className={styles.login} href="/login">Login</Button>
              <Button className={styles.login} href="/signup">Sign Up</Button>
            </div>) }
        </div>
      </div>
    )
  }
}

export default connect(
  state => state
)(Home);

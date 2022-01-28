import React, { Fragment } from "react";
import { useState } from "react";
import { Link,Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

function Login({ login,isAuthenticated }) {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  function onchange(e) {
    setformData({ ...formData, [e.target.name]: e.target.value });
  }

  function onsubmit(e) {
    e.preventDefault();
    //  console.log("success")
    login(email, password);
  }


  if(isAuthenticated){
    return <Navigate to="/dashboard" replace={true}/>
  }

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign into Your Account
        </p>
        <form className="form" onSubmit={onsubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={onchange}
              required
              value={email}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={onchange}
              value={password}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </section>
    </Fragment>
  );
}

Login.propTypes={
 login:PropTypes.func.isRequired,
 isAuthenticated:PropTypes.bool
}

const mapStateToProps = (state)=>({
  isAuthenticated :state.auth.isAuthenticated
})

export default connect(mapStateToProps,{login}) (Login);

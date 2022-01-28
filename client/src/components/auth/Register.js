import React, { useState,Fragment } from "react";
import { Link, Navigate  } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from 'prop-types';

function Register({setAlert,register,isAuthenticated}){

const [formData,setformData] = useState({
  name:"",
  email:"",
  password:"",
  password2:"",
})

const {name,email,password,password2} = formData

function onchange(e){
  setformData({...formData,[e.target.name]:e.target.value})
}

 function onsubmit(e){
  e.preventDefault()
  if(password !== password2){
    setAlert("passwords do not match",'danger',2000)
  }else{
    //not worked but for refernce
  //   const newUser ={
  //     name,
  //     email,
  //     password
  //   }
    
  //  try {
  //    const config = {
  //      headers:{
  //        "content-type":"application/json"
  //      }
  //    }
    
  //    const body = JSON.stringify(newUser)

  //    const res = await axios.post("/api/users",body,config)
  //    console.log(res.data);
  //  } catch (err) {
  //    console.error(err.response.data)
  //  }
  // console.log("success");
  register({name,email,password});
  }
}

if(isAuthenticated){
  return <Navigate  to="/dashboard" replace={true}/>
}

  return (
    <Fragment>
    <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={onsubmit}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} required onChange={onchange}  />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" value={email} onChange={onchange} required name="email" />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} onChange={onchange} 
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2} onChange={onchange} 
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
    </Fragment>
  )
}

Register.propTypes={
  setAlert:PropTypes.func.isRequired,
  register:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool
}

const mapStateToProps = state =>({
  isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStateToProps,{setAlert,register})(Register);

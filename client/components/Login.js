import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { loginUser } from '../store';



const Login = (props) => {
  const { name, displayName, handleSubmit, error } = props

  return (
    <div>
      <h3 className='login-title'>Welcome back! Log in to your account.</h3>
      <div id='form-panel'>
        <form onSubmit={handleSubmit} name='login' id="login-submit">
          <div className='login-container'>
            {/*<label htmlFor="email"><small>Email</small></label>*/}
            <input name="email" type="text" placeholder="Email" className="input" />
          </div>
          <div className='login-container'>
            {/*<label htmlFor="password"><small>Password</small></label>*/}
            <input name="password" type="password" placeholder="Password" className="input" />
          </div>
          <div className='login-container'>
            <button className="login-button" type='submit'>{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
      </div>
    </div>
  )
}

const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Log in',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(loginUser(email, password))
    }
  }
}

const LoginContainer = connect(mapLogin, mapDispatch)(Login)

export default LoginContainer

/**
 * PROP TYPES
 */
// Login.propTypes = {
//   name: PropTypes.string.isRequired,
//   displayName: PropTypes.string.isRequired,
//   handleSubmit: PropTypes.func.isRequired,
//   error: PropTypes.object
// }


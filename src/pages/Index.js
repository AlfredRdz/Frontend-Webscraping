import React, { useState } from 'react'
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom'

import './index.css'

const Index = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorP, setErrorP] = useState(null);
  const [errorE, setErrorE] = useState(null);

  const navigate = useNavigate();

  const guardarDatos = async(e) => {
    e.preventDefault();

    setErrorE(null);
    setErrorP(null);
    if (!email.trim()) {
      setErrorE('Por favor ingresa un Email');
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setErrorE('Por favor ingresa un Email valido');
      return;
    }
    if (!password.trim()) {
      setErrorP('Por favor ingresa una contraseña');
      return;
    }

    console.log(email, " ", password);
    
    
    const url = 'https://localhost:44310/api/User/Login';
    await axios.post(url, {
      email, 
      password
    })
    .then(response => {    
      if (response.data) {
        localStorage.setItem('autenticado', response.data);
        navigate('/dashboard')

        setEmail('');
        setPassword('');
        setErrorE(null);
        setErrorP(null);

        return response.data; 
      } else {
        setErrorP('Usuario y/o contraseña incorrecta');
      }
    })
    .catch(error => {
      setErrorE(error.response.data.errors.Email[0]);
      console.log("error", error.response.data.errors.Email[0]);
    })

    
  }

  return (
    <div className="App">
          <div className="appAside" />
          <div className="appForm">
            <div className="pageSwitcher">
              
              <NavLink
                to="/"
                className="pageSwitcherItem pageSwitcherItem-active"
              >
                Iniciar Sesion
              </NavLink>
            </div>

            <div className="formCenter">
              <form className="formFields" onSubmit={guardarDatos}>
                <div className="formField">
                  <label className="formFieldLabel" htmlFor="email">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="formFieldInput"
                    placeholder="Ingresa tu email"
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                  />
                  {
                    errorE ? (
                        <div className="formFieldAlert">
                            {errorE}
                        </div>
                    ) : null
                  }
                </div>

                <div className="formField">
                  <label className="formFieldLabel" htmlFor="password">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="formFieldInput"
                    placeholder="Ingresa tu contraseña"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                  />
                  {
                    errorP ? (
                        <div className="formFieldAlert">
                            {errorP}
                        </div>
                    ) : null
                  }
                </div>

                <div className="formField">
                  <button className="formFieldButton" type='submit'>Ingresar</button>
                </div>
              </form>
          </div>
          </div>
        </div>
  )
}

export default Index
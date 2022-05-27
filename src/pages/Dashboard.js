import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'

import './dashboard.css'

const Dashboard = () => {
    const [name, setName] = useState('');
    const [results, setResults] = useState([]);
    const [exito, setExito] = useState(false);
    const [errorB, setErrorB] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const consultar = async() => {
        const url = `https://localhost:44310/api/Company/0`;
          await axios.get(url)
          .then(response => {
              if (response.data.length > 0) {
                setResults(response.data)
                console.log(response.data)
                return response.data;
              } else {
                  setError('No hay registros')
              }
              
          }).catch(error => {
              setError('Hubo un error');
          })
      }


    useEffect(() => {
        if (!localStorage.getItem('autenticado')) {
            navigate('/', { replace: true });
        }

        consultar();
    }, [])
    

    const obtenerDatos = async(e) => {
        const order = e.target.value;
        const url = `https://localhost:44310/api/Company/${order}`;
          await axios.get(url)
          .then(response => {
              setResults(response.data)
              console.log(response.data)
              setError(false);
              return response.data;
          }).catch(error => {
              setError('Hubo un error', error);
          })
    }      
    
    const guardarDatos = async(e) => {
        e.preventDefault();
        setExito(false);
        setName('');
        if (!name.trim()) {
            setErrorB('Por favor ingrese una busqueda');
            return;
        }

        if (!/^[a-zA-Z\s]*$/.test(name)) {
            setErrorB('Por favor ingrese una busqueda valida');
            return;
        }

        console.log(name);

        const url = 'https://localhost:44310/api/Company';
        await axios.post(url, {name})
        .then(response => {
            console.log(response.data)
            if (response.data.length > 0) {
                setExito('Busqueda exitosa')
                setResults(response.data)

                setName('');
                
                setErrorB(false);
                setError(false);
                return response.data;
            }
            
        }).catch(error => {
            setErrorB('No se encontraron resultados');
        })
 
    }

    const cerrarSesion = () => {
        localStorage.clear();
    }

  return (
    <div className='Container'>
        <div className='ContainerTop'>
            <div className="pageSession">
              
                <NavLink
                    to="/"
                    onClick={cerrarSesion}
                    className="pageSessionItem pageSessionItem-active"
                >
                    Cerrar Sesion
                </NavLink>
            </div>
            <div className='formulario'>
                <form onSubmit={guardarDatos}>
                    <div className="formuField">
                        <label className="formuFieldLabel" htmlFor="name">
                            Buscador de empresas en occ
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="formuFieldInput"
                            placeholder="Ingresa tu busqueda"
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <button className='formuFieldButton' type='submit'>Buscar</button>
                        { exito ?
                            (
                                <div className='formuFieldAlertE'>
                                    {exito}
                                </div>
                            ) : null
                        }
                        
                        { errorB ?
                            (
                                <div className="formuFieldAlert">
                                    {errorB}
                                </div>
                            ) : null
                        }
                    </div>
                    
                </form>
            </div>
        </div>
        <div className='ContainerBottom'>
            <div className="table-users">
                <div className="header">
                    Historial de busquedas
                    
                    <select onChange={e => obtenerDatos(e)}>
                        <option value={0}>Todos</option>
                        <option value={1}>Nombre</option>
                        <option value={2}>Numero de trabajos</option>
                        <option value={3}>Fecha (Desc)</option>
                        <option value={4}>Fecha (Asc)</option>

                    </select>
                </div>
                
                <table className='customTable'>
                    <thead>
                        <tr>
                            <th>Numero</th>
                            <th>Nombre</th>
                            <th>Numero Trabajos</th>
                            <th>Fecha Busqueda</th>
                        </tr>
                    </thead>
                    <tbody>
                        { results.map((result, index) => (
                            <tr key={result.id}>
                                <td>{index + 1}</td>
                                <td>{result.name}</td>
                                <td>{result.numberJobs}</td>
                                
                                <td>{result.date.slice(0, 10).replace(/-/g, "/")}</td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
                {
                    error ?
                    <div className='formuFieldAlert'>
                        {error}
                    </div> : null
                }
            </div>
        </div>
    </div>
  )
}

export default Dashboard
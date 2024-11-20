import React, { useState } from 'react';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [userSignUpData, setUserSignUpData] = useState({
    email: '',
    fullname: '',
    username: '',
    password: ''
  });

  const [companySignUpData, setCompanySignUpData] = useState({
    companyName: '',
    email: '',
    password: '',
    cif: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleOpenModal = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsCompany(false); 
  };

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setUserSignUpData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCompanyInputChange = (event) => {
    const { name, value } = event.target;
    setCompanySignUpData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    if (isCompany) {
      if (!companySignUpData.companyName || !companySignUpData.cif || !companySignUpData.email || !companySignUpData.password || !confirmPassword) {
        alert('¡Todos los campos son obligatorios para el registro de empresa!');
        return;
      }
      if (companySignUpData.password.length < 8) {
        alert('¡La contraseña debe tener al menos 8 caracteres!');
        return;
      }
      if (companySignUpData.password !== confirmPassword) {
        alert('¡Las contraseñas no coinciden!');
        return;
      }
      setConfirmPassword('');

      if (companySignUpData.cif.length !== 9) {
        alert('¡El CIF debe tener 9 caracteres!');
        return;
      }
      if (!/^[A-Z]{1}[0-9]{8}$/.test(companySignUpData.cif)) {
        alert('¡El CIF debe tener un formato válido!');
        return;
      }
      if (!/^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(companySignUpData.email)) {
        alert('¡El correo electrónico debe tener un formato válido!');
        return;
    }


    } else {
      if (!userSignUpData.fullname || !userSignUpData.username || !userSignUpData.email || !userSignUpData.password || !confirmPassword) {
        alert('¡Todos los campos son obligatorios para el registro de usuario!');
        return;
      }
      if (userSignUpData.password !== confirmPassword) {
        alert('¡Las contraseñas no coinciden!');
        return;
      }
      setConfirmPassword('');

      if (userSignUpData.password.length < 8) {
        alert('¡La contraseña debe tener al menos 8 caracteres!');
        return;
      }
      if (!/^[A-Za-z\s]+$/.test(userSignUpData.fullname)) {
        alert('¡El nombre completo solo puede contener letras y espacios!');
        return;
      }
      if (userSignUpData.username.length < 4 || userSignUpData.username.length > 20) {
        alert('¡El nombre de usuario debe tener entre 4 y 20 caracteres!');
        return;
      }
      if (!/^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userSignUpData.email)) {
        alert('¡El correo electrónico debe tener un formato válido!');
        return;
    }
    }


    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(isCompany ? companySignUpData : userSignUpData)
      });

      if (response.ok) {
        console.log('Registro exitoso');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error('Error al registrar:', errorData.message);
        alert('El registro falló: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error durante el registro.');
    }
  };

  const toggleIsCompany = () => {
    setIsCompany((prev) => !prev);
  };


  const handleLogin = async (event) => {
    event.preventDefault();
  
    // Validación básica de campos
    if (!loginData.username || !loginData.password) {
      alert("¡Todos los campos son obligatorios!");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: isCompany ? null : loginData.username, // Si es usuario, usar username
          cif: isCompany ? loginData.username : null, // Si es empresa, usar CIF
          email: loginData.username, // El email aplica en ambos casos
          password: loginData.password,
          isCompany, // Enviar el indicador de si es empresa
        }),
        credentials: "include", // Enviar cookies de sesión si son necesarias
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data);
        
        if (isCompany) {
          window.location.href = "/company"; // Cambiar según tu aplicación
        }
        else {window.location.href = "/home"; // Cambiar según tu aplicación
        }
      } else {
        const errorData = await response.json();
        console.error("Error al iniciar sesión:", errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Ocurrió un error durante el inicio de sesión.");
    }
  };
  
  

  return (
    <div className="App">
      <main className="main-content">
        <div className="logo">
          <img src={"/Planner_name.png"} alt="Logo de Planner" />
        </div>
        <div className="auth-box">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              placeholder={isCompany ? "CIF o Email" : "Usuario o Email"}
              required
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              placeholder="Contraseña"
              required
            />
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isCompany}
                  onChange={() => setIsCompany((prev) => !prev)}
                />
                Iniciar sesión como empresa
              </label>
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>

          <p className="create-account">
            ¿No tienes cuenta? <a href="/signup" onClick={handleOpenModal}>Regístrate</a>.
          </p>
        </div>
      </main>
      <div className="slogan">
        <p>¿No tienes un plan? Déjalo en manos de <strong>PLANNER</strong></p>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content" role="dialog" aria-modal="true">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <button className="toggle-company" onClick={toggleIsCompany}>
              {isCompany ? 'Registrarse como Usuario' : 'Registrarse como Empresa'}
            </button>
            <h2>{isCompany ? 'Registro de Empresa' : 'Registro de Usuario'}</h2>
            <form onSubmit={handleSignUpSubmit}>
              {isCompany ? (
                <>
                  <input
                    type="text"
                    name="companyName"
                    value={companySignUpData.companyName}
                    onChange={handleCompanyInputChange}
                    placeholder="Nombre de la Empresa"
                    required
                  />
                  <input
                    type="text"
                    name="cif"
                    value={companySignUpData.cif}
                    onChange={handleCompanyInputChange}
                    placeholder="CIF"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={companySignUpData.email}
                    onChange={handleCompanyInputChange}
                    placeholder="Correo Electrónico"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={companySignUpData.password}
                    onChange={handleCompanyInputChange}
                    placeholder="Contraseña"
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="fullname"
                    value={userSignUpData.fullname}
                    onChange={handleUserInputChange}
                    placeholder="Nombre Completo"
                    required
                  />
                  <input
                    type="text"
                    name="username"
                    value={userSignUpData.username}
                    onChange={handleUserInputChange}
                    placeholder="Usuario"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={userSignUpData.email}
                    onChange={handleUserInputChange}
                    placeholder="Correo Electrónico"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={userSignUpData.password}
                    onChange={handleUserInputChange}
                    placeholder="Contraseña"
                    required
                  />
                </>
              )}
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir Contraseña"
                required
              />
              <button type="submit">Registrarse</button>
            </form>
          </div>
        </div>
      )}
      <footer>
        <p>&copy; 2024 Planner. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;

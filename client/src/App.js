import React, { useState } from 'react';
import './App.css';

import { useNavigate } from 'react-router-dom';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [signUpData, setSignUpData] = useState({
    email: '',
    fullname: '',
    username: '',
    password: ''
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
});

  const navigate = useNavigate();


  const handleOpenModal = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    console.log('loginData:', loginData);

    if (!loginData.username || !loginData.password) {
        alert('All fields are required!');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);

            // Store the user ID in localStorage
            localStorage.setItem('user_id', data.user_id);

            // Redirect to the home page
            navigate('/home');
            
        } else {
            const errorText = await response.text();
            console.error('Error logging in:', errorText);
            alert('Login failed: ' + errorText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
};


  const handleSignupInputChange = (event) => {
    const { name, value } = event.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    console.log('signUpData:', signUpData);

    if (!signUpData.email || !signUpData.fullname || !signUpData.username || !signUpData.password) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
      });

      if (response.ok) {
        console.log('User created successfully');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error('Error creating user:', errorData.message);
        alert('Signup failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during signup.');
    }
  };

  return (
    <div className="App">
      <main className="main-content">
        <div className="logo">
          <img src={"/Planner_name.png"} alt="Planner Logo" />
        </div>
        <div className="auth-box">
          <h2>Login</h2>
          <div className="credentials-box">
          <form onSubmit={handleLoginSubmit}>
            <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginInputChange}
                placeholder="Username"
                required
            />
            <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
          </div>
          <p className="create-account">
            Don’t have a plan? <a href="/signup" onClick={handleOpenModal}>Sign up</a>.
          </p>
        </div>
      </main>
      <div className="slogan">
        <p>Don't have a plan, leave it to <strong>PLANNER</strong></p>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content" role="dialog" aria-modal="true">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUpSubmit}>
              <input
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleSignupInputChange}
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="fullname"
                value={signUpData.fullname}
                onChange={handleSignupInputChange}
                placeholder="Full Name"
                required
              />
              <input
                type="text"
                name="username"
                value={signUpData.username}
                onChange={handleSignupInputChange}
                placeholder="Username"
                required
              />
              <input
                type="password"
                name="password"
                value={signUpData.password}
                onChange={handleSignupInputChange}
                placeholder="Password"
                required
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}
      <footer>
        <p>&copy; 2024 Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

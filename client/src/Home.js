import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import Chat from './components/Chat';  // Import the Chat component
import './Home.css';
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toastify

function Home() {
    useEffect(() => {
        const checkUserType = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/home', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                console.log(response);

                if (response.ok) {
                    const data = await response.json();
                    if (data.message === 'Company logged in') {
                        window.location.href = '/company';
                    }
                    else if (data.message === 'User logged in') {
                    }
                    else { 
                        window.location.href = '/   ';
                    }
                }
                else {
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };

        checkUserType();
    }, []);

    return (
        <div>
            <Sidebar />
            <Chat /> 
        </div>
    );
}

export default Home;
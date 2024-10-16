import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import './Home.css';
import FloatingButton from './components/FloatingButton';
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toastify


function Home() {


    useEffect(() => {
        fetch('http://127.0.0.1:5000/home', {
            method: 'GET',
            credentials: 'include', 
          })
            .then(response => response.json())

            .catch(error => {
                console.error(error);
            });
    }, []);


    
    return (
        <div>
            <Sidebar />
            <FloatingButton />

        </div>
    );
}

export default Home;

import React, { useEffect } from 'react';
import Sidebar from './components/sidebar';
import './Home.css';
import FloatingButton from './components/FloatingButton';

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

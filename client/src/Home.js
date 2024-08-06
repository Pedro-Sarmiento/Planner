import React, { useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import './Home.css';

function Home() {

    useEffect(() => {
        fetch('/api/home')
            .then(response => response.json())
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    return (
            <Sidebar />

    );
}

export default Home;

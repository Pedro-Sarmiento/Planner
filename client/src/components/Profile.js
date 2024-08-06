import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar';  // Assuming Sidebar is already created
import './Profile.css';  // Ensure you create a corresponding CSS file for styling

function Profile() {
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem('user_id');

        fetch(`/api/profile?user_id=${userId}`)
            .then(response => response.json())
            .then(data => setProfile(data))
            .catch(error => console.error('Error fetching profile data:', error));
    }, []);

    return (
        <div className="profile-container">
            <Sidebar />
            <div className="profile-content">
                <div className="profile-header">
                    <img src={profile.profile_photo} alt="Profile" className="profile-photo" />
                    <h1>{profile.username}</h1>
                </div>
                <div className="profile-stats">
                    <div className="stat">
                        <h2>{profile.followers}</h2>
                        <p>Followers</p>
                    </div>
                    <div className="stat">
                        <h2>{profile.following}</h2>
                        <p>Following</p>
                    </div>
                    <div className="stat">
                        <h2>{profile.posts}</h2>
                        <p>Posts</p>
                    </div>
                    <div className="stat">
                        <h2>{profile.plans}</h2>
                        <p>Plans</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;

import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import './Profile.css'; 

function Profile() {
    const [profile, setProfile] = useState({});
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/profile', {
            method: 'POST',
            credentials: 'include',  
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error("User not logged in");
            }
            return response.json();
        })
        .then(data => {
            setProfile(data); 
            setIsCurrentUser(true); 
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    }, []);  
    
    return (
        <div className="profile-container">
            <Sidebar />
            <div className="profile-content">
                <div className="profile-header">
                    <img src={profile.profile_photo} alt="Profile" className="profile-photo" />
                    <h1>{profile.username}</h1>
                    {isCurrentUser && (
                        <button className="edit-profile-btn">
                            Edit Profile
                        </button>
                    )}
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

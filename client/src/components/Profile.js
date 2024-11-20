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
                window.location.href = '/';
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
                            Editar Perfil
                        </button>
                    )}
                </div>
                <div className="profile-stats">
                    <div className="stat">
                        <h2>{profile.plans}</h2>
                        <p>Nº Planes</p>
                    </div>
                </div>
                <div className="saved-plans">
                    <h2>Saved Plans</h2>
                    {profile.saved_plans && profile.saved_plans.length > 0 ? (
                        profile.saved_plans.map((plan, index) => (
                            <div key={index} className="plan-card">
                                <h3>{plan.title}</h3>
                                <p>{plan.description}</p>
                                <p><strong>Location:</strong> {plan.location}</p>
                                <p><strong>Budget:</strong> {plan.budget}</p>
                                <p><strong>Time Required:</strong> {plan.time_required}</p>
                                <p><strong>Season:</strong> {plan.season}</p>
                                <p><strong>Activity Type:</strong> {plan.activity_type}</p>
                                <p><strong>Target Audience:</strong> {plan.target_audience}</p>
                            </div>
                        ))
                    ) : (
                        <p>No saved plans.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
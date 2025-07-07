import React, { useState } from 'react';
import '../styles/login.css';

export default function LoginPage({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (onLogin(password)) {
            setError('');
        } else {
            setError('Invalid password. Please try again.');
            setPassword('');
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Access Required</h1>
                <p>Please enter the password to access the Scenario Manager</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="password-input"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-button">
                        Access Site
                    </button>
                </form>
            </div>
        </div>
    );
}
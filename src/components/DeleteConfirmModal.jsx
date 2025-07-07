import React, { useState } from 'react';
import '../styles/delete.css';

export default function DeleteConfirmModal({ onConfirm, onCancel }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const success = await onConfirm(password);
        if (success) {
            setError('');
        } else {
            setError('Invalid password. Please try again.');
            setPassword('');
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>This action cannot be undone. Please enter the deletion password to confirm.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter deletion password"
                            className="password-input"
                            autoComplete="current-password"
                            required
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-buttons">
                        <button type="button" onClick={onCancel} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="confirm-delete-button">
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
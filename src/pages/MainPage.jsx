import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function MainPage({ scenarios, deleteScenario }) {
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    async function handleDelete(id, event) {
        event.preventDefault(); // Prevent navigation when clicking delete
        event.stopPropagation();

        setItemToDelete(id);
        setDeleteModalOpen(true);
    }

    async function confirmDelete(password) {
        if (password === 'neverRemember') {
            await deleteScenario(itemToDelete);
            setDeleteModalOpen(false);
            setItemToDelete(null);
            return true;
        }
        return false;
    }

    function cancelDelete() {
        setDeleteModalOpen(false);
        setItemToDelete(null);
    }

    // Function to create a preview of the text content
    function createPreview(text) {
        if (!text) return 'No content...';
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }

    return (
        <div className="main-container">
            <header className="main-header">
                <h1>Scenario Manager</h1>
                <button className="add-button" onClick={() => navigate('/add')}>
                    + Add New Scenario
                </button>
            </header>

            <div className="scenarios-grid">
                {scenarios.map(({ id, title, text }) => (
                    <div key={id} className="scenario-card">
                        <Link to={`/detail/${id}`} className="card-link">
                            <div className="card-header">
                                <h3 className="card-title">{title || 'Untitled'}</h3>
                            </div>
                            <div className="card-preview">
                                <div className="preview-content">
                                    {createPreview(text)}
                                </div>
                            </div>
                        </Link>
                        <div className="card-actions">
                            <button
                                className="delete-button"
                                onClick={(e) => handleDelete(id, e)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {scenarios.length === 0 && (
                    <div className="empty-state">
                        <p>No scenarios yet. Create your first one!</p>
                    </div>
                )}
            </div>

            {deleteModalOpen && (
                <DeleteConfirmModal
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}
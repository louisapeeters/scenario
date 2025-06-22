import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddScenarioPage({ addScenario }) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const navigate = useNavigate();

    function handleSave() {
        if (title.trim() && text.trim()) {
            addScenario(title, text);
            navigate('/');
        }
    }

    return (
        <div>
            <button onClick={() => navigate('/')}>Back</button>
            <h1>Add Scenario</h1>

            <input
                type="text"
                placeholder="Enter title here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '595px', fontSize: '1.2rem', marginBottom: '10px' }}
            />

            <textarea
                style={{ width: '595px', height: '842px' }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your scenario text here..."
            />

            <div style={{ marginTop: '10px' }}>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}

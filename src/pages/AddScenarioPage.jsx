import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddScenarioPage({ addScenario }) {
    const [text, setText] = useState('');
    const navigate = useNavigate();

    function handleSave() {
        addScenario(text);
        navigate('/');
    }

    return (
        <div>
            <button onClick={() => navigate('/')}>Back</button>
            <h1>Add Scenario</h1>
            <textarea
                style={{ width: '595px', height: '842px' }} // A4 at 72dpi approx
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

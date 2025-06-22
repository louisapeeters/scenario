import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';

export default function DetailPage({ scenarios, updateScenario }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const scenario = useMemo(() => {
        return scenarios.find((s) => s.id === Number(id)) || {};
    }, [scenarios, id]);

    const [title, setTitle] = useState(scenario.title || '');
    const [text, setText] = useState(scenario.text || '');

    useEffect(() => {
        setTitle(scenario.title || '');
        setText(scenario.text || '');
    }, [scenario]);

    function handleSave() {
        updateScenario(Number(id), title, text);
        navigate('/');
    }

    if (!scenario.id) {
        return (
            <div>
                <button onClick={() => navigate('/')}>Back</button>
                <h1>Scenario not found</h1>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => navigate('/')}>Back</button>
            <h1>Detail Page for Item {id}</h1>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '595px', fontSize: '1.5rem', marginBottom: '10px' }}
            />

            <textarea
                style={{ width: '595px', height: '842px' }}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <div style={{ marginTop: '10px' }}>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}

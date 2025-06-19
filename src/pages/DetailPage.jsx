import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';

export default function DetailPage({ scenarios, updateScenario }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const scenario = useMemo(() => {
        return scenarios.find((s) => s.id === Number(id)) || {};
    }, [scenarios, id]);

    const [text, setText] = useState(scenario.text || '');

    useEffect(() => {
        setText(scenario.text || '');
    }, [scenario]);

    function handleSave() {
        updateScenario(Number(id), text);
        navigate('/');
    }

    return (
        <div>
            <button onClick={() => navigate('/')}>Back</button>
            <h1>Detail Page for Item {id}</h1>
            <textarea
                style={{ width: '595px', height: '842px' }}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
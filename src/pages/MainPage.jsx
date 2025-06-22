import { Link, useNavigate } from 'react-router-dom';

export default function MainPage({ scenarios, deleteScenario }) {
    const navigate = useNavigate();

    async function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this scenario?')) {
            await deleteScenario(id);
        }
    }

    return (
        <div>
            <h1>Main Page</h1>
            <button onClick={() => navigate('/add')}>+</button>
            <ul>
                {scenarios.map(({ id, title }) => (
                    <li key={id} style={{ marginBottom: '8px' }}>
                        <Link to={`/detail/${id}`} style={{ marginRight: '10px' }}>
                            {title}
                        </Link>
                        <button onClick={() => handleDelete(id)} style={{ color: 'red' }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

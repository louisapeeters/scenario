import { Link, useNavigate } from 'react-router-dom';

export default function MainPage({ scenarios }) {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Main Page</h1>
            <button onClick={() => navigate('/add')}>+</button>
            <ul>
                {scenarios.map(({ id, text }) => (
                    <li key={id}>
                        <Link to={`/detail/${id}`}>{text.slice(0, 30)}...</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

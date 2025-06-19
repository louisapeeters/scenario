// src/pages/MainPage.jsx
import { Link } from "react-router-dom";

const items = [
    { id: 1, name: "Thing One" },
    { id: 2, name: "Thing Two" },
];

export default function MainPage() {
    return (
        <div>
            <h1>Main Page</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <Link to={`/detail/${item.id}`}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

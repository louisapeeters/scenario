// src/pages/DetailPage.jsx
import { useParams } from "react-router-dom";

export default function DetailPage() {
    const { id } = useParams();

    return (
        <div>
            <h1>Detail Page for Item {id}</h1>
            {/* Fetch or display item details here */}
        </div>
    );
}

import { index, route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';

export default [
    index('/', <MainPage />),
    route('/detail/:id', <DetailPage />),
];

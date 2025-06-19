import { index, route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import AddScenarioPage from './pages/AddScenarioPage';

export default [
    index('/', <MainPage />),
    route('/add', <AddScenarioPage />),
    route('/detail/:id', <DetailPage />),
];

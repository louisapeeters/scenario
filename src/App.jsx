import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import AddScenarioPage from './pages/AddScenarioPage';
import { supabase } from './supabaseClient';
import './styles/main-page.css';
import './styles/base.css';

function App() {
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    fetchScenarios();
  }, []);

  async function fetchScenarios() {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .order('id', { ascending: true });

    if (error) console.error('Fetch error:', error);
    else setScenarios(data);
  }

  async function addScenario(title, text, formatSegments = []) {
    const { data, error } = await supabase
      .from('scenarios')
      .insert([{
        title,
        text,
        formatsegments: formatSegments
      }])
      .select();

    if (error) console.error('Insert error:', error);
    else setScenarios((prev) => [...prev, data[0]]);
  }

  async function updateScenario(id, newTitle, newText, formatSegments = []) {
    const { error } = await supabase
      .from('scenarios')
      .update({
        title: newTitle,
        text: newText,
        formatsegments: formatSegments
      })
      .eq('id', id);

    if (error) console.error('Update error:', error);
    else fetchScenarios();
  }

  async function deleteScenario(id) {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id);

    if (error) console.error('Delete error:', error);
    else setScenarios((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<MainPage scenarios={scenarios} deleteScenario={deleteScenario} />}
        />
        <Route path="/add" element={<AddScenarioPage addScenario={addScenario} />} />
        <Route
          path="/detail/:id"
          element={<DetailPage scenarios={scenarios} updateScenario={updateScenario} />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
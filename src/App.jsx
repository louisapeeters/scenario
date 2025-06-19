import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState } from 'react';
import routes from './routes';
import React from 'react';

// Wrap route elements to inject props like scenarios, addScenario, updateScenario
function App() {
  const [scenarios, setScenarios] = useState([]);

  function addScenario(text) {
    setScenarios((prev) => [
      ...prev,
      { id: Date.now(), text },
    ]);
  }

  function updateScenario(id, newText) {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text: newText } : s))
    );
  }

  // Wrap each route's element with scenario props
  const routesWithProps = routes.map(({ path, element }) => {
    let newElement = element;

    if (path === '/') {
      newElement = React.cloneElement(element, { scenarios });
    } else if (path === '/add') {
      newElement = React.cloneElement(element, { addScenario });
    } else if (path.startsWith('/detail')) {
      newElement = React.cloneElement(element, { scenarios, updateScenario });
    }

    return { path, element: newElement };
  });

  const router = createBrowserRouter(routesWithProps);

  return <RouterProvider router={router} />;
}

export default App;
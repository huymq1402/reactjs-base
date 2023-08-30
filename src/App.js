import React from 'react';
import publicRoutes from './modules/routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from './modules/components/Layout';

function App() {
  return <>
    <Router>
      <div className="App">
        <Routes>
          {
            publicRoutes.map(({ path, component, layout }, index) => {
              let Layout = DefaultLayout;
              if (layout) {
                Layout = layout;
              } else if (layout === null) {
                Layout = Fragment;
              }
              const Page = component;
              return <Route
                key={index}
                path={path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            })
          }
        </Routes>
      </div>
    </Router>
  </>;
}

export default App;

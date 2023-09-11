import React from 'react';
import publicRoutes from './modules/routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from '@components/Layout';
import Login from './modules/containers/Login';
import Home from './modules/containers/Home';

function App() {
  let Layout = DefaultLayout;

  return <>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          {
            publicRoutes.map(({ path, component, layout }, index) => {
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
          <Route path="*" element={<Layout><Home /></Layout>} />
        </Routes>
      </div>
    </Router>
  </>;
}

export default App;

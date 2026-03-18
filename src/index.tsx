import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { Provider } from 'react-redux';
import store from './services/store';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);
const isGitHubPagesHost =
  typeof window !== 'undefined' &&
  window.location.hostname.endsWith('github.io');
const pathParts =
  typeof window !== 'undefined'
    ? window.location.pathname.split('/').filter(Boolean)
    : [];
const routerBasename =
  process.env.NODE_ENV === 'production' && isGitHubPagesHost && pathParts.length
    ? `/${pathParts[0]}`
    : '/';

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={routerBasename}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

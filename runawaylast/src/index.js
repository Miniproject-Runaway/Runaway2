import React from 'react';
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';


// const entryPoint = document.getElementById("root");
// ReactDOM.createRoot(entryPoint).render(<App />);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="307131914161-mp331ecodiej5fcbi3sv91gk6bj0f80k.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

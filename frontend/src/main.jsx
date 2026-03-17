import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
     <GoogleOAuthProvider clientId="801917400681-u4n60uf5ea81gpncg2vemqp2alviafm2.apps.googleusercontent.com">
       <App />
     </GoogleOAuthProvider>
    </BrowserRouter>
  </>
);


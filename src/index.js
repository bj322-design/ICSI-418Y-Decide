import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup' 
import CreateProject from './CreateProject';
import Home from './Home';
import ViewProjects from './ViewProjects';
import ViewTeams from './ViewTeams';
import HostSignup from "./HostRegistration";
import CreateEvent from "./CreateEvent";
import HostHome from "./HostHome";
import ViewEvents from "./ViewEvents";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
        <Route path="/HostSignup" element={<HostSignup />}></Route>
        <Route path="/CreateProject" element={<CreateProject/>}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/HostHome" element={<HostHome />}></Route>
        <Route path="/ViewProjects" element={<ViewProjects />}></Route>
        <Route path="/ViewTeams" element={<ViewTeams />}></Route>
        <Route path="/CreateEvent" element={<CreateEvent />}></Route>
        <Route path="/ViewEvents" element={<ViewEvents />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
  
  /*(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);*/


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import MyEvents from "./MyEvents";
import HostHome from "./HostHome";
import ViewEvents from "./ViewEvents";
import CreateEvent from "./CreateEvent";
import CreateProject from "./CreateProject";
import SocialPlanner from "./SocialPlanner";
import HostSignup from "./HostRegistration";

function App() {
  return (
   <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Signup" element={<Signup />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          <Route path="/Events" element={<MyEvents />}></Route>
          {/*<Route path="/Profile" element={<Profile />}></Route>
          <Route path="/Settings" element={<Settings />}></Route>
          <Route path="/Chat" element={<Chat />}></Route>*/}
          <Route path="/HostHome" element={<HostHome />}></Route>
          <Route path="/CreateEvent" element={<CreateEvent />}></Route>
          <Route path="/ViewEvents" element={<ViewEvents />}></Route>
          <Route path="/CreateProject" element={<CreateProject />}></Route>
          <Route path="/SocialPlanner" element={<SocialPlanner />}></Route>
          <Route path="/HostSignup" element={<HostSignup />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  );
}

export default App;

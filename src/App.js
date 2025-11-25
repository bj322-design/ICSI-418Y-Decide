import logo from './logo.svg';
import './App.css';
import CreateProject from './CreateProject';


function App() {
  return (
   <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
        <Route path="/CreateProject" element={<CreateProject />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  );
}

export default App;

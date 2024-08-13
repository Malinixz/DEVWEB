import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react';
import { authToken } from './helpers/Utils'
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import GroupHome from './pages/GroupHome'

function App() {
  //??? ajustar a logica de verificar se ja esta logado
  const [isLogged, setIsLogged] = useState(authToken() ? false : true);
  // console.log(isLogged);  //???
  function handleLogin(isAuth) {
    setIsLogged(isAuth);
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={ isLogged ? <Home /> : <SignIn onLogin={handleLogin} />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Groups" element={<Groups />} />
          <Route path="/Groups2" element={<GroupHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import GroupMembers from './pages/Group/GroupMembers';
import GroupActivities from './pages/Group/GroupActivities';
import GroupHome from './pages/GroupHome';

function App() {
  const [isLogged, setIsLogged] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  function handleLogin(isAuth) {
    setIsLogged(isAuth);
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={isLogged ? <Home /> : <Navigate to="/SignIn" />} 
          />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/Home" element={isLogged ? <Home /> : <Navigate to="/SignIn" />} />
          <Route path="/Profile" element={isLogged ? <Profile /> : <Navigate to="/SignIn" />} />
          <Route path="/Groups" element={isLogged ? <Groups /> : <Navigate to="/SignIn" />} />
          <Route path="/Groups/:id" element={isLogged ? <GroupHome /> : <Navigate to="/SignIn" />} />
          <Route path="/GroupMembers/:id" element={isLogged ? <GroupMembers /> : <Navigate to="/SignIn" />} />
          <Route path="/GroupActivities/:id" element={isLogged ? <GroupActivities /> : <Navigate to="/SignIn" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
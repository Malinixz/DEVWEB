import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import GroupMembers from './pages/Group/GroupMembers';
import GroupActivities from './pages/Group/GroupActivities';
import GroupHome from './pages/GroupHome'
import ProtectedRoute from './components/RoutesComponents/ProtectedRoute';
import GroupRoute from './components/RoutesComponents/GroupProtectedRoute';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={ <SignIn/>} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/Groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
          <Route path="/Groups/:id" element={<GroupRoute><GroupHome /></GroupRoute>} />
          <Route path="/GroupMembers/:id" element={<GroupRoute><GroupMembers /></GroupRoute>}/>
          <Route path="/GroupActivities/:id" element={<GroupRoute><GroupActivities /></GroupRoute>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
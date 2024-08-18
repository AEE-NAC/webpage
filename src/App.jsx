import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useState } from 'react';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/Signup';
import SignIn from './pages/Signin';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import './App.css';

// Création du contexte
export const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;


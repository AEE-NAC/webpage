import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useState } from 'react';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/Signup';
import SignIn from './pages/Signin';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Donation from './pages/Donation';
import Library from './pages/library';
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
          <Route path="/Home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;


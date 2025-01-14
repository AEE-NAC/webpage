import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useState } from 'react';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/Signup';
import SignIn from './pages/Signin';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import { LanguageProvider } from './context/Languagecontext';
import Donation from './pages/Donation';
import ResetPassword from './pages/ResetPassword';
import Library from './pages/library';
import ProfileForm from './pages/profile';
import Complete_profile from './pages/complete-profile.jsx';
import Ministries from './pages/apropos.jsx';
import Contact from './pages/Contact.jsx';
import ImpliquezVous from './pages/implicate.jsx';
import Haiti_page from './pages/country/haiti.jsx';
import Guyanne_page from './pages/country/guyanne.jsx';
import Martinique_page from './pages/country/martinique.jsx';
import STMARTIN_page from './pages/country/stmartin.jsx';
import Canada_page from './pages/country/canada.jsx';
import './App.css';

// Création du contexte
export const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  //

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/library" element={<Library />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Complete_profile/>} />
          <Route path="/apropos" element={<Ministries />} />
          <Route path="/implicate" element={<ImpliquezVous />} />
          <Route path="/haiti" element={<Haiti_page />} />
          <Route path="/guyanne" element={<Guyanne_page />} />
          <Route path="/martinique" element={<Martinique_page />} />
          <Route path="/stmartin" element={<STMARTIN_page />} />
          <Route path="/canada" element={<Canada_page />} />
        </Routes>
      </Router>
      </LanguageProvider>
    </AppContext.Provider>
  );
}

export default App;


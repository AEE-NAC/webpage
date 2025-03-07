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
import ClubSave from './pages/backoffice/club_save.jsx';
import Staff from './pages/staff.jsx';
import HaitiForm from './pages/country/haiti/form.jsx';
import Newsletter from './pages/Newsletter';
import StudentRegistration from './pages/StudentRegistration';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/newsletter" element={<Newsletter />} />
          {/* Remove /signup and /signin routes */}
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/library" element={<Library />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Complete_profile/>} />
          <Route path="/apropos" element={<Ministries />} />
          <Route path="/implicate" element={<ImpliquezVous />} />
          <Route path="country/haiti" element={<Haiti_page />} />
          <Route path="country/guyanne-francaise" element={<Guyanne_page />} />
          <Route path="country/martinique" element={<Martinique_page />} />
          <Route path="country/st-martin" element={<STMARTIN_page />} />
          <Route path="country/canada" element={<Canada_page />} />
          <Route path="/club-save" element={<ClubSave />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="haiti/form" element={<HaitiForm />} />
          <Route path="/student-registration" element={<StudentRegistration />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;


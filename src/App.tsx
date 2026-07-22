import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Achievements } from './pages/Achievements';
import { Archive } from './pages/Archive';
import { Contests } from './pages/Contests';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { Join } from './pages/Join';
import { People } from './pages/People';
import { Present } from './pages/Present';
import { ResearchCareer } from './pages/ResearchCareer';
import { TrainingRules } from './pages/TrainingRules';
import { TrainingStanding } from './pages/TrainingStanding';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const isPresent = location.pathname === '/present';

  return (
    <div className="min-h-screen bg-paper text-ink">
      <ScrollToTop />
      {!isPresent && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/present" element={<Present />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/people" element={<People />} />
        <Route path="/research-career" element={<ResearchCareer />} />
        <Route path="/events" element={<Events />} />
        <Route path="/join" element={<Join />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/training" element={<TrainingRules />} />
        <Route path="/training/standing" element={<TrainingStanding />} />
      </Routes>
      {!isPresent && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AppShell />
    </BrowserRouter>
  );
}

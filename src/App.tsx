import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget/ChatWidget';

import Home from './pages/Home';
import Mission from './pages/Mission';
import Tools from './pages/Tools';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Documents from './pages/Documents';
import Profile from './pages/Profile';
import Impressum from './pages/Impressum';
import Privacy from './pages/Privacy';

const App: React.FC = () => {
    return (
        <Router>
            <LanguageProvider>
                <ThemeProvider>
                    <Main />
                </ThemeProvider>
            </LanguageProvider>
        </Router>
    );
};

// Separate component to use hooks
const Main = () => {
    React.useEffect(() => {
        document.body.classList.add('demo-mode');
        return () => document.body.classList.remove('demo-mode');
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mission" element={<Mission />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/impressum" element={<Impressum />} />
                    <Route path="/privacy" element={<Privacy />} />
                </Routes>
            </main>
            <Footer />
            <ChatWidget />
        </div>
    );
};

export default App;

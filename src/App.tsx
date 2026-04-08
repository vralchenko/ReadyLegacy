import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DemoProvider } from './context/DemoContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Mission from './pages/Mission';
import Tools from './pages/Tools';
// Team page temporarily hidden (Olga's bank compliance disclosure requirement)
// import Team from './pages/Team';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Documents from './pages/Documents';
import Profile from './pages/Profile';
import Impressum from './pages/Impressum';
import Privacy from './pages/Privacy';
import Pricing from './pages/Pricing';

const App: React.FC = () => {
    return (
        <Router>
            <LanguageProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <DemoProvider>
                            <Main />
                        </DemoProvider>
                    </AuthProvider>
                </ThemeProvider>
            </LanguageProvider>
        </Router>
    );
};

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
                    <Route path="/team" element={<Navigate to="/" replace />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/impressum" element={<Impressum />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/pricing" element={<Pricing />} />
                </Routes>
            </main>
            <Footer />
            <ChatWidget />
        </div>
    );
};

export default App;

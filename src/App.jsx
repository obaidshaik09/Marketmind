import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ChatView from './pages/ChatView';
import HowItWorksPage from './pages/HowItWorksPage';
import './styles/global.css';
import './styles/navbar.css';
import './styles/chatbot.css';
import './styles/howItWorks.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <Routes>
          <Route path="/" element={<ChatView />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

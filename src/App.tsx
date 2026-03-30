import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import EggHunt from './pages/EggHunt';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/egg-hunt" element={<EggHunt />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
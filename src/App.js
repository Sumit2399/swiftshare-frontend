import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "./styles.css"; // Ensure this is present

import Upload from './components/Upload';
import Retrieve from './components/Retrieve';
import Home from './pages/home';
import About from './pages/About';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/retrieve" element={<Retrieve />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;

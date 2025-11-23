import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AdoptaPage from './pages/AdoptaPage';
import ReportarPage from './pages/ReportarPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import { useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import CreateGatoPage from './pages/CreateGatoPage';
import Footer from './components/Footer';
import GatoDetailPage from './pages/GatoDetailPage';

// Creamos este componente "interno" para poder usar el hook useTheme
// (No podemos usar useTheme directamente dentro de App porque App es el que tiene el Provider)
const AppContent = () => {
  const { theme } = useTheme(); // <--- 2. Obtenemos el estado actual (light o dark)
  
  return (
    // 3. AQUÍ ESTÁ LA MAGIA DEL FONDO:
    // Si theme es 'dark', usa 'bg-katze-dark' (negro). Si no, 'bg-white'.
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-katze-dark' : 'bg-white'}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adopta" element={<AdoptaPage />} />
        <Route path="/adopta/:id" element={<GatoDetailPage />} />
        <Route path="/reportar" element={<ReportarPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/crear-gato"
          element={
            <ProtectedRoute>
              <CreateGatoPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
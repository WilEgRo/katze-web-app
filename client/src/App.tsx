import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AdoptaPage from './pages/AdoptaPage';
import ReportarPage from './pages/ReportarPage';
import AdminLoginPage from './pages/LoginPage';
import DashboardPage from './pages/Admin/DashboardPage';
import { useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import CreateGatoPage from './pages/Admin/CreateGatoPage';
import Footer from './components/Footer';
import GatoDetailPage from './pages/GatoDetailPage';
import GatoPerdidoDetailPage from './pages/GatoPerdidoDetailPage';
import ScrollToTop from './components/ScrollToTop';
import DonarPage from './pages/DonarPage';
import ConfigManager from './pages/Admin/ConfigManager';
import ComunidadPage from './pages/ComunidadPage';
import AdminRoute from './components/AdminRoute';
import PerfilPage from './pages/PerfilPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


// Creamos este componente "interno" para poder usar el hook useTheme
// (No podemos usar useTheme directamente dentro de App porque App es el que tiene el Provider)
const AppContent = () => {
  const { theme } = useTheme(); // Obtenemos el estado actual (light o dark)

  return (
    // Si theme es 'dark', usa 'bg-katze-dark' (negro). Si no, 'bg-white'.
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-katze-dark' : 'bg-white'}`}>
      <Navbar />
      <div className='pt-24 md:pt-24'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/adopta" element={<AdoptaPage />} />
          <Route path="/adopta/:id" element={<GatoDetailPage />} />
          <Route path="/reporte/:id" element={<GatoPerdidoDetailPage />} />
          <Route path="/reportar" element={<ReportarPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/donar" element={<DonarPage />} />
          <Route path="/comunidad" element={<ComunidadPage />} />
          <Route path="*" element={<NotFoundPage />} />
          
          {/* RUTAS PROTEGIDAS */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/crear-gato"
            element={
              <AdminRoute>
                <CreateGatoPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/configuracion"
            element={
              <AdminRoute>
                <div className="container mx-auto px-4 pt-19 pb-12">
                  <ConfigManager />
                </div>
              </AdminRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Opciones: "light", "dark", "colored"
      />
      <AppContent />
    </Router>
  );
}

export default App;
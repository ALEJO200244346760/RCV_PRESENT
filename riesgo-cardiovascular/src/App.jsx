import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Estadisticas from './components/Estadisticas';
import Formulario from './components/Formulario';
import FormularioPaciente from './components/FormularioPaciente';
import FormularioPacienteMenor from './components/FormularioPacienteMenor';
import EstadisticaMenor from './components/EstadisticaMenor';
import EditarPaciente from './components/EditarPaciente';
import TomarPresion from './components/TomarPresion';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {

  return (
    <Router>
      <Header />
      <Routes>

        <Route path="/" element={<Formulario />} />

        <Route path="/formulario-paciente" element={<FormularioPaciente />} />

        <Route path="/formulario-paciente-menor" element={<FormularioPacienteMenor />} />
        
        <Route path="/estadistica-menor" element={<EstadisticaMenor />} />

        <Route path="/tomarPresion" element={<TomarPresion />} />

        <Route 
          path="/estadisticas" 
          element={
            <RoleProtectedRoute 
              element={<Estadisticas />} 
              allowedRoles={['ROLE_CARDIOLOGO']} 
            />
          } 
        />

        <Route
          path="/editar-paciente/:id"
          element={
            <RoleProtectedRoute
              element={<EditarPaciente />}
              allowedRoles={['ROLE_CARDIOLOGO']}
            />
          }
        />

        <Route
          path="/admin-panel"
          element={
            <RoleProtectedRoute
              element={<AdminPanel />}
              allowedRoles={['ROLE_CARDIOLOGO']}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
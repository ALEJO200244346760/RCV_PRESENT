import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, logout, user, roles } = useAuth();
  const [userInitials, setUserInitials] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getInitials = (name, surname) => {
    if (!name || !surname) return '';
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  useEffect(() => {
    if (user) {
      setUserInitials(getInitials(user.nombre, user.apellido));
    }
  }, [user]);

  const handleLoginLogout = () => {
    if (token) {
      logout();
    } else {
      window.location.href = '/login';
    }
  };

  const hasCardiologoRole = Array.isArray(roles) && roles.includes('ROLE_CARDIOLOGO');

  return (
    <header className="bg-red-600 text-white py-4 px-6 flex justify-between items-center relative">
      <Link to="/formulario" className="flex items-center text-2xl font-bold hover:text-gray-300">
        <img src="/logo192.png" alt="Logo" className="h-8 mr-2" />
        <h1>RCV</h1>
        <img src="/Daspu.jpg" alt="Daspu" className="h-8 ml-2" />
      </Link>

      <button 
        onClick={toggleMenu} 
        className="lg:hidden flex items-center text-white"
      >
        {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Visible en desktop */}
      <div className="hidden lg:flex lg:items-center lg:space-x-4">
        <Link to="/formulario" className="hover:text-gray-300">RCV</Link>
        {hasCardiologoRole && (
          <Link to="/estadisticas" className="hover:text-gray-300">Estadísticas</Link>
        )}
        {token ? (
          <div className="flex items-center space-x-4">
            <div className="user-initials-circle bg-white text-red-600 rounded-full w-8 h-8 flex items-center justify-center">
              {userInitials}
            </div>
            <button onClick={handleLoginLogout} className="hover:text-gray-300">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="hover:text-gray-300">Iniciar Sesión</Link>
        )}
      </div>

      {/* Menú hamburguesa: visible siempre que se abra */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-red-700 text-white p-4 lg:hidden z-50">
          <Link to="/formulario" className="block py-1 hover:text-gray-300">RCV</Link>
          <Link to="/tomarPresion" className="block py-1 hover:text-gray-300">Diagnóstico</Link>
          {hasCardiologoRole && (
            <>
              <Link to="/estadisticas" className="block py-1 hover:text-gray-300">Estadísticas</Link>
              <Link to="/admin-panel" className="block py-1 hover:text-gray-300">Panel de Admin</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;

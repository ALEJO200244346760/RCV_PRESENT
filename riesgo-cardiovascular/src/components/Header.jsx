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

      <nav className={`lg:flex lg:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <Link to="/tomarPresion" className="block lg:inline-block hover:text-gray-300">Diagnóstico</Link>
        <Link to="/formulario" className="block lg:inline-block hover:text-gray-300">RCV</Link>

        {hasCardiologoRole && (
          <Link to="/estadisticas" className="block lg:inline-block hover:text-gray-300">Estadísticas</Link>
        )}
        {hasCardiologoRole && (
          <Link to="/admin-panel" className="block lg:inline-block hover:text-gray-300">Panel de Admin</Link>
        )}
        {token ? (
          <div className="flex items-center space-x-4">
            <div className="user-initials-circle bg-white text-red-600 rounded-full w-8 h-8 flex items-center justify-center">
              {userInitials}
            </div>
            <button 
              onClick={handleLoginLogout} 
              className="block lg:inline-block hover:text-gray-300"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="block lg:inline-block hover:text-gray-300">
            Iniciar Sesión
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
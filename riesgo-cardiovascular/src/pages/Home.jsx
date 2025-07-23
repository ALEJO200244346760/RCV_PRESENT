import React from 'react';
import Header from '../components/Header';

const Home = () => {
  return (
    <div>
      <Header />
      <div className="p-4">
        <h2 className="text-2xl">Bienvenido al Sistema de Evaluación de Riesgo Cardiovascular</h2>
        <p>Por favor, seleccione una opción del menú para comenzar.</p>
      </div>
    </div>
  );
};

export default Home;

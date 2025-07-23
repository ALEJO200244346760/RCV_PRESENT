// Modal.jsx
import React from 'react';

function Modal({ isOpen, onClose, onSave, paciente }) {
  if (!isOpen) return null;

  const [formData, setFormData] = React.useState(paciente || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Editar Paciente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Edad</label>
            <input
              type="number"
              name="edad"
              value={formData.edad || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Presión Sistólica</label>
            <input
              type="number"
              name="presionSistolica"
              value={formData.presionSistolica || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Diabetes</label>
            <select
              name="diabetes"
              value={formData.diabetes || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Niveles de Colesterol</label>
            <select
              name="nivelesColesterol"
              value={formData.nivelesColesterol || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Género</label>
            <select
              name="genero"
              value={formData.genero || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tabaquismo</label>
            <select
              name="tabaquismo"
              value={formData.tabaquismo || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nivel de Riesgo</label>
            <select
              name="nivelRiesgo"
              value={formData.nivelRiesgo || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccionar</option>
              <option value="Poco">Poco</option>
              <option value="Moderado">Moderado</option>
              <option value="Alto">Alto</option>
              <option value="Muy Alto">Muy Alto</option>
              <option value="Crítico">Crítico</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;

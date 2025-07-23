import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUsers,
  updateUserRoleAndLocation,
  addLocation,
  updateLocation,
  deleteLocation,
  addRole,
  updateRole,
  deleteRole,
  deleteUser,
  getRoles,
  getLocations,
  updateUserLocation
} from '../services/userService';

// Componente para la tabla de ubicaciones
const LocationTable = ({ locations, onAdd, onEdit, onDelete }) => {
  const [newLocation, setNewLocation] = useState('');
  const [editLocationId, setEditLocationId] = useState(null);
  const [editLocationName, setEditLocationName] = useState('');
  const [message, setMessage] = useState(null);

  const handleAdd = () => {
    onAdd(newLocation).then(() => {
      setMessage('Ubicación agregada exitosamente');
      setNewLocation('');
    }).catch(() => setMessage('Error al agregar ubicación'));
  };

  const handleEdit = (id, name) => {
    setEditLocationId(id);
    setEditLocationName(name);
  };

  const handleSaveEdit = () => {
    if (editLocationName.trim() === '') {
      setMessage('El nombre de la ubicación no puede estar vacío');
      return;
    }
    onEdit(editLocationId, editLocationName).then(() => {
      setMessage('Ubicación actualizada exitosamente');
      setEditLocationId(null);
      setEditLocationName('');
    }).catch(() => setMessage('Error al actualizar ubicación'));
  };

  const handleDelete = (id) => {
    onDelete(id).then(() => setMessage('Ubicación eliminada exitosamente'))
      .catch(() => setMessage('Error al eliminar ubicación'));
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Ubicaciones</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 mr-2 rounded"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="Nueva ubicación"
        />
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleAdd}>
          Agregar Ubicación
        </button>
      </div>
      {message && <p className="text-green-500">{message}</p>}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(location => (
            <tr key={location.id}>
              <td className="py-2 px-4">
                {editLocationId === location.id ? (
                  <input
                    type="text"
                    className="border border-gray-300 p-1 rounded"
                    value={editLocationName}
                    onChange={(e) => setEditLocationName(e.target.value)}
                    placeholder="Nombre de ubicación"
                  />
                ) : (
                  location.nombre // Asegúrate de usar 'nombre' en lugar de 'name'
                )}
              </td>
              <td className="py-2 px-4">
                {editLocationId === location.id ? (
                  <>
                    <button className="bg-green-500 text-white p-1 rounded mr-2" onClick={handleSaveEdit}>Guardar</button>
                    <button className="bg-red-500 text-white p-1 rounded" onClick={() => setEditLocationId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="bg-yellow-500 text-white p-1 rounded mr-2" onClick={() => handleEdit(location.id, location.nombre)}>Editar</button>
                    <button className="bg-red-500 text-white p-1 rounded" onClick={() => handleDelete(location.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente para la tabla de roles
const RoleTable = ({ roles, onAdd, onEdit, onDelete }) => {
  const [newRole, setNewRole] = useState('');
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState('');
  const [message, setMessage] = useState(null);

  const handleAdd = async () => {
    if (!newRole) {
      setMessage('Por favor, ingresa un nombre de rol');
      return;
    }
    
    try {
      await onAdd(newRole); // Asegúrate de que onAdd sea una función asíncrona
      setMessage('Rol agregado exitosamente');
      setNewRole('');
    } catch (error) {
      setMessage('Error al agregar rol: ' + error.message);
    }
  };
  

  const handleEdit = (id, name) => {
    setEditRoleId(id);
    setEditRoleName(name);
  };

  const handleSaveEdit = () => {
    if (!editRoleName) {
      setMessage('Por favor, ingresa un nombre de rol');
      return;
    }
    onEdit(editRoleId, editRoleName)
      .then(() => {
        setMessage('Rol actualizado exitosamente');
        setEditRoleId(null);
        setEditRoleName('');
      })
      .catch(() => setMessage('Error al actualizar rol'));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      onDelete(id)
        .then(() => setMessage('Rol eliminado exitosamente'))
        .catch(() => setMessage('Error al eliminar rol'));
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Roles</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 mr-2 rounded"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Nuevo rol"
        />
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleAdd}>
          Agregar Rol
        </button>
      </div>
      {message && <p className="text-green-500">{message}</p>}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td className="py-2 px-4">
                {editRoleId === role.id ? (
                  <input
                    type="text"
                    className="border border-gray-300 p-1 rounded"
                    value={editRoleName}
                    onChange={(e) => setEditRoleName(e.target.value)}
                  />
                ) : (
                  role.nombre
                )}
              </td>
              <td className="py-2 px-4">
                {editRoleId === role.id ? (
                  <>
                    <button className="bg-green-500 text-white p-1 rounded mr-2" onClick={handleSaveEdit}>Guardar</button>
                    <button className="bg-red-500 text-white p-1 rounded" onClick={() => setEditRoleId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="bg-yellow-500 text-white p-1 rounded mr-2" onClick={() => handleEdit(role.id, role.nombre)}>Editar</button>
                    <button className="bg-red-500 text-white p-1 rounded" onClick={() => handleDelete(role.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente para la tabla de usuarios
const UserTable = ({ users, roles, locations, onRoleChange, onLocationChange, onDelete }) => {
  const [message, setMessage] = useState(null);

  const handleRoleChange = (userId, role) => {
    if (role) {
      onRoleChange(userId, role).then(() => {
        setMessage('Rol actualizado exitosamente');
      }).catch(() => setMessage('Error al actualizar rol'));
    }
  };

  const handleLocationChange = (userId, location) => {
    if (location) {
      onLocationChange(userId, location).then(() => {
        setMessage('Ubicación actualizada exitosamente');
      }).catch(() => setMessage('Error al actualizar ubicación'));
    }
  };

  const handleDelete = (userId) => {
    onDelete(userId).then(() => setMessage('Usuario eliminado exitosamente'))
      .catch(() => setMessage('Error al eliminar usuario'));
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Usuarios</h2>
      {message && <p className="text-green-500">{message}</p>}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Rol</th>
            <th className="py-2 px-4 text-left">Ubicación</th>
            <th className="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4">{user.nombre} {user.apellido}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">
                <select
                  className="border border-gray-300 p-1 rounded"
                  value={user.rol?.nombre || ''}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="">Seleccionar Rol</option>
                  {roles.filter(role => role.nombre).map(role => (
                    <option key={role.id} value={role.nombre}>
                      {role.nombre}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-4">
                <select
                  className="border border-gray-300 p-1 rounded"
                  value={user.ubicacion?.nombre || ''}
                  onChange={(e) => handleLocationChange(user.id, e.target.value)}
                >
                  <option value="">Seleccionar Ubicación</option>
                  {locations.filter(location => location.nombre).map(location => (
                    <option key={location.id} value={location.nombre}>
                      {location.nombre}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-4">
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// Componente principal del panel de administración
const AdminPanel = () => {
  const { roles } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roles.includes('ROLE_CARDIOLOGO')) {
      cargarDatos();
    } else {
      console.error('Acceso denegado: Rol insuficiente.');
    }
  }, [roles]);

  const cargarDatos = async () => {
    try {
      const [users, roles, locations] = await Promise.all([
        getUsers(),
        getRoles(),
        getLocations()
      ]);
      setUsuarios(users);
      setRolesData(roles); // Asegúrate de que 'roles' tenga el formato correcto
      setLocationsData(locations); // Verifica también aquí
      setLoading(false);
    } catch (error) {
      setError('Error cargando datos, vuelva a iniciar sesión.');
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };  

  const handleAddLocation = async (locationName) => {
    await addLocation(locationName);
    cargarDatos();
  };

  const handleEditLocation = async (locationId, locationName) => {
    await updateLocation(locationId, locationName);
    cargarDatos();
  };

  const handleDeleteLocation = async (locationId) => {
    await deleteLocation(locationId);
    cargarDatos();
  };

  const handleAddRole = async (roleName) => {
    await addRole(roleName);
    cargarDatos();
  };

  const handleEditRole = async (roleId, roleName) => {
    await updateRole(roleId, roleName);
    cargarDatos();
  };

  const handleDeleteRole = async (roleId) => {
    await deleteRole(roleId);
    cargarDatos(); // Recarga los datos después de eliminar
  };

  const handleRoleChange = async (userId, newRole) => {
    console.log(`Intentando cambiar rol para el usuario ID: ${userId} a ${newRole}`);
    try {
        await updateUserRoleAndLocation(userId, newRole);
        cargarDatos(); // Cargar datos después de actualizar
    } catch (error) {
        console.error('Error al cambiar rol:', error.message); // Captura y muestra el error
    }
  };
  
  const handleLocationChange = async (userId, locationName) => {
    try {
      // Encuentra la ubicación en el array de locationsData usando el nombre
      const location = locationsData.find(loc => loc.nombre === locationName);
      
      if (!location) {
        throw new Error('Ubicación no encontrada');
      }
  
      const locationToUpdate = { id: location.id }; // Asegúrate de que estás pasando solo la ID de la ubicación
      await updateUserLocation(userId, locationToUpdate);
      cargarDatos(); // Cargar datos después de actualizar
    } catch (error) {
      console.error('Error al cambiar ubicación:', error.message);
    }
  };  

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    cargarDatos();
  };

  if (loading) {
    return <div className="text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const filteredRoles = rolesData.filter(role => role.nombre);
  const filteredLocations = locationsData.filter(location => location.nombre);

  return (
    <div className="admin-panel">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
      <LocationTable
        locations={filteredLocations}
        onAdd={handleAddLocation}
        onEdit={handleEditLocation}
        onDelete={handleDeleteLocation}
      />
      <RoleTable
        roles={filteredRoles}
        onAdd={handleAddRole}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
      />
      <UserTable
        users={usuarios}
        roles={filteredRoles}
        locations={filteredLocations}
        onRoleChange={handleRoleChange}
        onLocationChange={handleLocationChange}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default AdminPanel;

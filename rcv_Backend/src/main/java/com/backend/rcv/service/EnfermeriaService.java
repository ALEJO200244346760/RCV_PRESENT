package com.backend.rcv.service;

import com.backend.rcv.model.Enfermeria;
import com.backend.rcv.repository.EnfermeriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnfermeriaService {

    @Autowired
    private EnfermeriaRepository enfermeriaRepository;

    // Método para crear los datos de enfermería para un nuevo paciente
    public Enfermeria crearDatosEnfermeria(Enfermeria datosEnfermeria) {
        // Aquí no se requiere el DNI, ya que se supone que el paciente es nuevo
        return enfermeriaRepository.save(datosEnfermeria);
    }

    // Método para crear o actualizar los datos de enfermería usando el DNI
    public Enfermeria crearOActualizarEnfermeria(String dni, Enfermeria datosEnfermeria) {
        // Verifica si ya existen datos de enfermería para el paciente usando el DNI
        Enfermeria enfermeriaExistente = enfermeriaRepository.findByDni(dni);

        if (enfermeriaExistente != null) {
            // Si existe, actualizamos los datos
            enfermeriaExistente.setPeso(datosEnfermeria.getPeso());
            enfermeriaExistente.setTalla(datosEnfermeria.getTalla());
            enfermeriaExistente.setTensionArterial(datosEnfermeria.getTensionArterial());
            return enfermeriaRepository.save(enfermeriaExistente);
        } else {
            // Si no existe, creamos un nuevo registro con el DNI
            datosEnfermeria.setDni(dni);
            return enfermeriaRepository.save(datosEnfermeria);
        }
    }

    // Método para obtener los datos de enfermería por DNI
    public Enfermeria obtenerDatosEnfermeriaPorDni(String dni) {
        return enfermeriaRepository.findByDni(dni);
    }
}

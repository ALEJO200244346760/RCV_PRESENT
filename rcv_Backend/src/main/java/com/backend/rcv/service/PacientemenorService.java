package com.backend.rcv.service;

import com.backend.rcv.model.Pacientemenor;
import com.backend.rcv.repository.PacientemenorRepository;
import com.backend.rcv.exception.PacienteNoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacientemenorService {

    private final PacientemenorRepository pacientemenorRepository;

    @Autowired
    public PacientemenorService(PacientemenorRepository pacientemenorRepository) {
        this.pacientemenorRepository = pacientemenorRepository;
    }

    // Obtener todos los pacientes
    public List<Pacientemenor> obtenerTodosLosPacientes() {
        try{
        return pacientemenorRepository.findAll();
        // Devuelve la lista de todos los pacientes
        } catch (Exception e) {
            // Log the error
            throw new RuntimeException("Error fetching all pacientes", e);
        }
    }

    // Obtener paciente por DNI
    public Pacientemenor obtenerPacientePorDni(String dni) {
        // Usamos orElseThrow para lanzar una excepción si no se encuentra el paciente
        return pacientemenorRepository.findByDni(dni)
                .orElseThrow(() -> new PacienteNoEncontradoException(dni)); // Lanzamos una excepción personalizada si no se encuentra
    }

    // Crear o actualizar paciente
    public Pacientemenor crearOActualizarPaciente(Pacientemenor pacienteData) {
        // Buscar el paciente por DNI
        Optional<Pacientemenor> pacienteExistente = pacientemenorRepository.findByDni(pacienteData.getDni());

        if (pacienteExistente.isPresent()) {
            // Actualizar paciente existente
            Pacientemenor paciente = pacienteExistente.get(); // Aquí se obtiene el paciente si existe
            paciente.setPeso(pacienteData.getPeso());
            paciente.setTalla(pacienteData.getTalla());
            paciente.setTensionArterial(pacienteData.getTensionArterial());
            paciente.setFechaNacimiento(pacienteData.getFechaNacimiento());
            paciente.setHipertenso(pacienteData.getHipertenso());
            paciente.setDiabetes(pacienteData.getDiabetes());
            paciente.setAsma(pacienteData.getAsma());
            paciente.setFuma(pacienteData.getFuma());
            paciente.setAntecedentesSoplo(pacienteData.getAntecedentesSoplo());
            paciente.setArritmias(pacienteData.getArritmias());
            paciente.setEnfermedadCronica(pacienteData.getEnfermedadCronica());
            paciente.setCirugiaPrevia(pacienteData.getCirugiaPrevia());
            paciente.setAlergias(pacienteData.getAlergias());
            paciente.setAntecedentesFamiliaresMarcapaso(pacienteData.getAntecedentesFamiliaresMarcapaso());
            paciente.setDesfibriladores(pacienteData.getDesfibriladores());
            paciente.setTensionArterialMaxima(pacienteData.getTensionArterialMaxima());
            paciente.setTensionArterialMinima(pacienteData.getTensionArterialMinima());
            paciente.setElectrocardiograma(pacienteData.getElectrocardiograma());

            return pacientemenorRepository.save(paciente); // Guardamos el paciente actualizado
        } else {
            // Si no existe, lo creamos como nuevo
            return pacientemenorRepository.save(pacienteData);
        }
    }
}

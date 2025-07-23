package com.backend.rcv.service;

import com.backend.rcv.model.Paciente;
import com.backend.rcv.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public List<Paciente> getAllPacientes() {
        try {
            return pacienteRepository.findAll();
        } catch (Exception e) {
            // Log the error
            throw new RuntimeException("Error fetching all pacientes", e);
        }
    }

    public Optional<Paciente> getPacienteById(Long id) {
        try {
            return pacienteRepository.findById(id);
        } catch (Exception e) {
            // Log the error
            throw new RuntimeException("Error fetching paciente by id", e);
        }
    }

    public Paciente savePaciente(Paciente paciente) {
        try {
            return pacienteRepository.save(paciente);
        } catch (Exception e) {
            // Log the error
            throw new RuntimeException("Error saving paciente", e);
        }
    }

    public void deletePaciente(Long id) {
        try {
            pacienteRepository.deleteById(id);
        } catch (Exception e) {
            // Log the error
            throw new RuntimeException("Error deleting paciente", e);
        }
    }
}

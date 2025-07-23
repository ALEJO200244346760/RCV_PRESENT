package com.backend.rcv.exception;

public class PacienteNoEncontradoException extends RuntimeException {

    public PacienteNoEncontradoException(String dni) {
        super("Paciente con DNI " + dni + " no encontrado");
    }
}

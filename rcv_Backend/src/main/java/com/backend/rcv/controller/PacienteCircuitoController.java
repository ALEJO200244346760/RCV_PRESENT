package com.backend.rcv.controller;

import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/circuito")
@CrossOrigin(origins = "*")
public class PacienteCircuitoController {

    @Autowired
    private PacienteCircuitoRepository repository;

    @PostMapping("/recibir")
    public ResponseEntity<?> recibirDatos(@RequestBody PacienteCircuito datos) {
        try {
            PacienteCircuito guardado = repository.save(datos);
            return new ResponseEntity<>(guardado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
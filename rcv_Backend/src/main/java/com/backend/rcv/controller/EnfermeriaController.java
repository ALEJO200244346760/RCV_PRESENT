package com.backend.rcv.controller;

import com.backend.rcv.model.Enfermeria;
import com.backend.rcv.service.EnfermeriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enfermeria")
public class EnfermeriaController {

    @Autowired
    private EnfermeriaService enfermeriaService;

    // Crear los datos de enfermería para un nuevo paciente (sin DNI en la URL)
    @PostMapping
    public ResponseEntity<Enfermeria> crearDatosEnfermeria(@RequestBody Enfermeria datosEnfermeria) {
        try {
            Enfermeria enfermeria = enfermeriaService.crearDatosEnfermeria(datosEnfermeria);
            return new ResponseEntity<>(enfermeria, HttpStatus.CREATED);  // 201 Created
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Crear o actualizar los datos de enfermería para un paciente (buscando por DNI)
    @PostMapping("/{dni}")
    public ResponseEntity<Enfermeria> crearOActualizarDatosEnfermeria(@PathVariable String dni, @RequestBody Enfermeria datosEnfermeria) {
        try {
            Enfermeria enfermeria = enfermeriaService.crearOActualizarEnfermeria(dni, datosEnfermeria);
            return new ResponseEntity<>(enfermeria, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Consultar los datos de enfermería por DNI
    @GetMapping("/{dni}")
    public ResponseEntity<Enfermeria> obtenerDatosEnfermeria(@PathVariable String dni) {
        Enfermeria enfermeria = enfermeriaService.obtenerDatosEnfermeriaPorDni(dni);
        if (enfermeria != null) {
            return new ResponseEntity<>(enfermeria, HttpStatus.OK);  // Si encuentra datos, responde con los datos
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // Si no hay datos, responde sin contenido (sin error 404)
        }
    }
}

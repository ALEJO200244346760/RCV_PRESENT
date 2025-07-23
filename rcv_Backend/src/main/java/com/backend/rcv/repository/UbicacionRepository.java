package com.backend.rcv.repository;

import com.backend.rcv.model.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {
    Ubicacion findByNombre(String nombre);
}

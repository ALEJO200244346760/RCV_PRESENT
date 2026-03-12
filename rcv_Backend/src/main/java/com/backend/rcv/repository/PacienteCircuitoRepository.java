package com.backend.rcv.repository;

import com.backend.rcv.model.PacienteCircuito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteCircuitoRepository extends JpaRepository<PacienteCircuito, Long> {
}
package com.train.backend.repository;

import com.train.backend.model.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {
    Optional<Employe> findByEmployeEmail(String email);
    List<Employe> findByEmployeNomContaining(String nom);
}

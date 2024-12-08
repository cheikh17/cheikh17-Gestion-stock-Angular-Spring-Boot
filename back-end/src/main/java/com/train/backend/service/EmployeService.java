package com.train.backend.service;

import com.train.backend.model.Employe;
import com.train.backend.repository.EmployeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class EmployeService {
    @Autowired
    private EmployeRepository employeRepository;

    public Employe saveEmploye(Employe employe) {
        return employeRepository.save(employe);
    }

    public List<Employe> getAllEmployes() {
        return employeRepository.findAll();
    }

    public Employe getEmployeById(Long id) {
        return employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
    }

    public void deleteEmploye(Long id) {
        employeRepository.deleteById(id);
    }
}
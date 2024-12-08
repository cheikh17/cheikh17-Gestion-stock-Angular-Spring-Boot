package com.train.backend.service;

import com.train.backend.model.Achat;
import com.train.backend.model.Employe;
import com.train.backend.model.Stock;
import com.train.backend.repository.AchatRepository;
import com.train.backend.repository.EmployeRepository;
import com.train.backend.repository.StockRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AchatService {
    @Autowired
    private AchatRepository achatRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private EmployeRepository employeRepository;

    public Achat saveAchat(Achat achat) {
        // Vérification de l'existence de l'employé
        Employe employe = employeRepository.findById(achat.getEmploye().getId())
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));

        // Vérification de l'existence du stock
        Stock stock = stockRepository.findById(achat.getStock().getId())
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));

        // Mise à jour du stock
        Number nouvelleQuantite = stock.getQuantite().intValue() + achat.getQuantite();
        stock.setQuantite(nouvelleQuantite);
        stockRepository.save(stock);

        // Calcul du montant total
        achat.setMontantTotal(achat.getQuantite() * achat.getPrixUnitaire());
        achat.setDateAchat(LocalDateTime.now());

        return achatRepository.save(achat);
    }

    public List<Achat> getAllAchats() {
        return achatRepository.findAll();
    }

    public Achat getAchatById(Long id) {
        return achatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Achat non trouvé"));
    }

    public List<Achat> getAchatsByPeriode(LocalDateTime debut, LocalDateTime fin) {
        return achatRepository.findByDateAchatBetween(debut, fin);
    }
}


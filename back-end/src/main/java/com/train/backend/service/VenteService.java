package com.train.backend.service;

import com.train.backend.model.Employe;
import com.train.backend.model.Vente;
import com.train.backend.repository.EmployeRepository;
import com.train.backend.repository.StockRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.train.backend.repository.VenteRepository;
import com.train.backend.model.Stock;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class VenteService {
    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private EmployeRepository employeRepository;

    public Vente saveVente(Vente vente) {
        // Vérification de l'existence de l'employé
        Employe employe = employeRepository.findById(vente.getEmploye().getId())
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));

        // Vérification de l'existence du stock
        Stock stock = stockRepository.findById(vente.getStock().getId())
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));

        // Vérification de la disponibilité du stock
        if (stock.getQuantite().intValue() < vente.getQuantite()) {
            throw new RuntimeException("Stock insuffisant");
        }

        // Mise à jour du stock
        Number nouvelleQuantite = stock.getQuantite().intValue() - vente.getQuantite();
        stock.setQuantite(nouvelleQuantite);
        stockRepository.save(stock);

        // Calcul du montant total
        vente.setMontantTotal(vente.getQuantite() * vente.getPrixUnitaire());
        vente.setDateVente(LocalDateTime.now());

        return venteRepository.save(vente);
    }

    public List<Vente> getAllVentes() {
        return venteRepository.findAll();
    }

    public Vente getVenteById(Long id) {
        return venteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));
    }

    public List<Vente> getVentesByPeriode(LocalDateTime debut, LocalDateTime fin) {
        return venteRepository.findByDateVenteBetween(debut, fin);
    }
}

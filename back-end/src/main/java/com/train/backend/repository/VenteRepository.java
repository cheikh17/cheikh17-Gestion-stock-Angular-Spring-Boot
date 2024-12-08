package com.train.backend.repository;

import com.train.backend.model.Vente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.train.backend.model.Employe;
import com.train.backend.model.Stock;
import java.util.List;
import java.time.LocalDateTime;


@Repository
public interface VenteRepository extends JpaRepository<Vente, Long> {
    List<Vente> findByEmploye(Employe employe);
    List<Vente> findByStock(Stock stock);
    List<Vente> findByDateVenteBetween(LocalDateTime debut, LocalDateTime fin);
    List<Vente> findByMontantTotalGreaterThan(Double montant);
}

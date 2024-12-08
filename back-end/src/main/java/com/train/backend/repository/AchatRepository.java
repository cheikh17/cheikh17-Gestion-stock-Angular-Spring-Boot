package com.train.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.train.backend.model.Achat;
import com.train.backend.model.Employe;
import com.train.backend.model.Stock;
import java.util.List;
import java.time.LocalDateTime;


@Repository
public interface AchatRepository extends JpaRepository<Achat, Long> {
    List<Achat> findByEmploye(Employe employe);
    List<Achat> findByStock(Stock stock);
    List<Achat> findByDateAchatBetween(LocalDateTime debut, LocalDateTime fin);
    List<Achat> findByMontantTotalGreaterThan(Double montant);
}

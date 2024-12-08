package com.train.backend.repository;

import com.train.backend.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByNomProduitContaining(String nomProduit);
    List<Stock> findByQuantiteLessThan(Number quantite);
    Optional<Stock> findByNomProduit(String nomProduit);
}

package com.train.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nomProduit;
    private String description;
    private Number quantite;
    private Double prix;

    @OneToMany(mappedBy = "stock")
    private List<Achat> achats;

    @OneToMany(mappedBy = "stock")
    private List<Vente> ventes;

}


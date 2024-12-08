package com.train.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "employe")
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String employeNom;
    private String employePrenom;
    private String employeEmail;
    private Number employePhone;

    @OneToMany(mappedBy = "employe")
    private List<Achat> achats;

    @OneToMany(mappedBy = "employe")
    private List<Vente> ventes;

}

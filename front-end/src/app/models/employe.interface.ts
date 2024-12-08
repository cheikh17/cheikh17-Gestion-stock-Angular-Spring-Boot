import { Achat } from './achat.interface';
import { Vente } from './vente.interface';

export interface Employe {
  id: number;
  employeNom: string;
  employePrenom: string;
  employeEmail: string;
  employePhone: string;
  achats: Achat;
  ventes: Vente;
}

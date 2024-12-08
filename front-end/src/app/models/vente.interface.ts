import { Employe } from './employe.interface';
import { Stock } from './stock.interface';

export interface Vente {
  id: number;
  employe: Employe;
  stock: Stock;
  dateVente: Date;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
}
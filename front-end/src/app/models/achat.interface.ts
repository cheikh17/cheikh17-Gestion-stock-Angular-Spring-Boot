import { Employe } from './employe.interface';
import { Stock } from './stock.interface';

export interface Achat {
  id: number;
  employe: Employe;
  stock: Stock;
  dateAchat: Date;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
}
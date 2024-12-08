import { Achat } from './achat.interface';
import { Vente } from './vente.interface';

export interface Stock {
  id: number;
  nomProduit: string;
  description: string;
  quantite: number;
  prix: number;
  achats: Achat;
  ventes: Vente;
}
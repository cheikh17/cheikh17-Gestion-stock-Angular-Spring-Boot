import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenteService, StockService, EmployeService } from '../../../services';
import { Vente, Stock, Employe } from '../../../models';
import { VenteFormComponent } from '../vente-form/vente-form.component';


@Component({
  selector: 'app-vente-list',
  standalone: true,
  imports: [CommonModule, VenteFormComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestion des Ventes</h1>
        <button class="btn-primary" (click)="openCreateForm()">
          Nouvelle Vente
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Unitaire</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let vente of ventes">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatDate(vente.dateVente) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ vente.stock.nomProduit }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ vente.employe.employeNom }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ vente.quantite }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(vente.prixUnitaire) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(vente.montantTotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-vente-form
      *ngIf="showForm"
      [stocks]="stocks"
      [employes]="employes"
      (save)="onSaveVente($event)"
      (cancel)="closeForm()"
    ></app-vente-form>
  `
})
export class VenteListComponent implements OnInit {
  ventes: Vente[] = [];
  stocks: Stock[] = [];
  employes: Employe[] = [];
  showForm = false;

  constructor(
    private venteService: VenteService,
    private stockService: StockService,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {
    this.loadVentes();
    this.loadStocks();
    this.loadEmployes();
  }

  formatDate(date: Date | string): Date {
    return new Date(date);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'FCFA' }).format(amount);
  }

  loadVentes(): void {
    this.venteService.getAllVentes().subscribe({
      next: (data) => {
        this.ventes = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ventes:', error);
      }
    });
  }

  loadStocks(): void {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stocks:', error);
      }
    });
  }

  loadEmployes(): void {
    this.employeService.getAllEmployes().subscribe({
      next: (data) => {
        this.employes = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    });
  }

  openCreateForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  onSaveVente(vente: Vente): void {
    this.venteService.createVente(vente).subscribe({
      next: () => {
        this.loadVentes();
        this.closeForm();
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement:', error);
      }
    });
  }
}

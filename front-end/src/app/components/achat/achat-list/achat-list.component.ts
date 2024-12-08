import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchatService, StockService, EmployeService } from '../../../services';
import { Achat, Stock, Employe } from '../../../models';
import { AchatFormComponent } from '../achat-form/achat-form.component';

@Component({
  selector: 'app-achat-list',
  standalone: true,
  imports: [CommonModule, AchatFormComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestion des Achats</h1>
        <button class="btn-primary" (click)="openCreateForm()">
          Nouvel Achat
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Produit
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employé
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantité
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prix Unitaire
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Montant Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let achat of achats">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatDate(achat.dateAchat) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ achat.stock.nomProduit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ achat.employe.employeNom }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ achat.quantite }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatCurrency(achat.prixUnitaire) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatCurrency(achat.montantTotal) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-achat-form
      *ngIf="showForm"
      [stocks]="stocks"
      [employes]="employes"
      (save)="onSaveAchat($event)"
      (cancel)="closeForm()"
    ></app-achat-form>
  `,
})
export class AchatListComponent implements OnInit {
  achats: Achat[] = [];
  stocks: Stock[] = [];
  employes: Employe[] = [];
  showForm = false;

  constructor(
    private achatService: AchatService,
    private stockService: StockService,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {
    this.loadAchats();
    this.loadStocks();
    this.loadEmployes();
  }

  formatDate(date: Date | string): Date {
    return new Date(date);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'FCFA',
    }).format(amount);
  }

  loadAchats(): void {
    this.achatService.getAllAchats().subscribe({
      next: (data) => {
        this.achats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des achats:', error);
      },
    });
  }

  loadStocks(): void {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stocks:', error);
      },
    });
  }

  loadEmployes(): void {
    this.employeService.getAllEmployes().subscribe({
      next: (data) => {
        this.employes = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      },
    });
  }

  openCreateForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  onSaveAchat(achat: Achat): void {
    this.achatService.createAchat(achat).subscribe({
      next: () => {
        this.loadAchats();
        this.closeForm();
      },
      error: (error) => {
        console.error("Erreur lors de l'enregistrement:", error);
      },
    });
  }
}

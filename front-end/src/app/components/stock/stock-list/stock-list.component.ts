import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../services';
import { Stock } from '../../../models';
import { StockFormComponent } from '../stock-form/stock-form.component';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, StockFormComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestion des Stocks</h1>
        <button class="btn-primary" (click)="openCreateForm()">
          Nouveau Produit
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let stock of stocks">
                <td class="px-6 py-4 whitespace-nowrap">{{ stock.nomProduit }}</td>
                <td class="px-6 py-4">{{ stock.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getQuantityClass(stock.quantite)">
                    {{ stock.quantite }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ stock.prix | number:'1.2-2' }} FCFA</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button class="text-primary-600 hover:text-primary-800 mr-2" (click)="editStock(stock)">
                    Modifier
                  </button>
                  <button class="text-red-600 hover:text-red-800" (click)="deleteStock(stock.id)">
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-stock-form
      *ngIf="showForm"
      [stock]="selectedStock"
      (save)="onSaveStock($event)"
      (cancel)="closeForm()"
    ></app-stock-form>
  `
})
export class StockListComponent implements OnInit {
  stocks: Stock[] = [];
  showForm = false;
  selectedStock: Stock | null = null;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadStocks();
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

  getQuantityClass(quantity: number): string {
    if (quantity <= 10) {
      return 'text-red-600 font-semibold';
    } else if (quantity <= 20) {
      return 'text-yellow-600 font-semibold';
    }
    return 'text-green-600';
  }

  openCreateForm(): void {
    this.selectedStock = null;
    this.showForm = true;
  }

  editStock(stock: Stock): void {
    this.selectedStock = stock;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedStock = null;
  }

  onSaveStock(stock: Stock): void {
    const operation = stock.id
      ? this.stockService.updateStock(stock.id, stock)
      : this.stockService.createStock(stock);

    operation.subscribe({
      next: () => {
        this.loadStocks();
        this.closeForm();
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement:', error);
      }
    });
  }

  deleteStock(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.stockService.deleteStock(id).subscribe({
        next: () => {
          this.loadStocks();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
}

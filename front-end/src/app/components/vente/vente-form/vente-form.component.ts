import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Vente, Stock, Employe } from '../../../models';

@Component({
  selector: 'app-vente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Nouvelle Vente</h2>
          <button
            class="text-gray-400 hover:text-gray-500"
            (click)="onCancel()"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form [formGroup]="venteForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="stock" class="block text-sm font-medium text-gray-700">
              Produit
            </label>
            <select
              id="stock"
              formControlName="stockId"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('stockId')"
              (change)="onStockChange($event)"
            >
              <option value="">Sélectionnez un produit</option>
              <option *ngFor="let stock of stocks" [value]="stock.id">
                {{ stock.nomProduit }} - Stock: {{ stock.quantite }} - Prix:
                {{ stock.prix }}
              </option>
            </select>
            <p
              *ngIf="isFieldInvalid('stockId')"
              class="mt-1 text-sm text-red-600"
            >
              Veuillez sélectionner un produit
            </p>
          </div>

          <div>
            <label
              for="employe"
              class="block text-sm font-medium text-gray-700"
            >
              Employé
            </label>
            <select
              id="employe"
              formControlName="employeId"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('employeId')"
            >
              <option value="">Sélectionnez un employé</option>
              <option *ngFor="let employe of employes" [value]="employe.id">
                {{ employe.employeNom }} {{ employe.employePrenom }}
              </option>
            </select>
            <p
              *ngIf="isFieldInvalid('employeId')"
              class="mt-1 text-sm text-red-600"
            >
              Veuillez sélectionner un employé
            </p>
          </div>

          <div>
            <label
              for="quantite"
              class="block text-sm font-medium text-gray-700"
            >
              Quantité
            </label>
            <input
              type="number"
              id="quantite"
              formControlName="quantite"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('quantite')"
              min="1"
              (input)="calculateTotal()"
            />
            <p
              *ngIf="isFieldInvalid('quantite')"
              class="mt-1 text-sm text-red-600"
            >
              La quantité doit être supérieure à 0
            </p>
            <p *ngIf="stockInsuffisant" class="mt-1 text-sm text-red-600">
              Stock insuffisant
            </p>
          </div>

          <div>
            <label
              for="prixUnitaire"
              class="block text-sm font-medium text-gray-700"
            >
              Prix unitaire
            </label>
            <input
              type="number"
              id="prixUnitaire"
              formControlName="prixUnitaire"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('prixUnitaire')"
              min="0"
              step="0.01"
              (input)="calculateTotal()"
            />
            <p
              *ngIf="isFieldInvalid('prixUnitaire')"
              class="mt-1 text-sm text-red-600"
            >
              Le prix unitaire doit être supérieur à 0
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Montant total
            </label>
            <p class="text-lg font-semibold text-gray-900">
              {{ montantTotal }}
            </p>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" class="btn-secondary" (click)="onCancel()">
              Annuler
            </button>
            <button
              type="submit"
              class="btn-primary"
              [disabled]="venteForm.invalid || isSubmitting || stockInsuffisant"
            >
              {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class VenteFormComponent implements OnInit {
  @Input() stocks: Stock[] = [];
  @Input() employes: Employe[] = [];
  @Output() save = new EventEmitter<Vente>();
  @Output() cancel = new EventEmitter<void>();

  venteForm: FormGroup;
  isSubmitting = false;
  montantTotal = 0;
  stockInsuffisant = false;
  selectedStock: Stock | null = null;

  constructor(private fb: FormBuilder) {
    this.venteForm = this.fb.group({
      stockId: ['', [Validators.required]],
      employeId: ['', [Validators.required]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prixUnitaire: [0, [Validators.required, Validators.min(0)]],
      dateVente: [new Date(), [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.calculateTotal();
    this.venteForm.get('quantite')?.valueChanges.subscribe(() => {
      this.verifierStock();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.venteForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onStockChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const stockId = Number(select.value);
    this.selectedStock = this.stocks.find((s) => s.id === stockId) || null;

    if (this.selectedStock) {
      this.venteForm.patchValue({
        prixUnitaire: this.selectedStock.prix,
      });
      this.verifierStock();
      this.calculateTotal();
    }
  }

  verifierStock(): void {
    if (this.selectedStock) {
      const quantiteDemandee = this.venteForm.get('quantite')?.value || 0;
      this.stockInsuffisant = quantiteDemandee > this.selectedStock.quantite;
    }
  }

  calculateTotal(): void {
    const quantite = this.venteForm.get('quantite')?.value || 0;
    const prixUnitaire = this.venteForm.get('prixUnitaire')?.value || 0;
    this.montantTotal = quantite * prixUnitaire;
  }

  onSubmit(): void {
    if (this.venteForm.valid && !this.stockInsuffisant) {
      this.isSubmitting = true;
      const formValue = this.venteForm.value;

      const vente: Vente = {
        id: 0,
        stock: this.stocks.find((s) => s.id === Number(formValue.stockId))!,
        employe: this.employes.find(
          (e) => e.id === Number(formValue.employeId)
        )!,
        dateVente: formValue.dateVente,
        quantite: formValue.quantite,
        prixUnitaire: formValue.prixUnitaire,
        montantTotal: this.montantTotal,
      };

      this.save.emit(vente);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

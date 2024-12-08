import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Achat, Stock, Employe } from '../../../models';

@Component({
  selector: 'app-achat-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Nouvel Achat</h2>
          <button
            class="text-gray-400 hover:text-gray-500"
            (click)="onCancel()">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form [formGroup]="achatForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="stock" class="block text-sm font-medium text-gray-700">
              Produit
            </label>
            <select
              id="stock"
              formControlName="stockId"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('stockId')"
              (change)="onStockChange($event)">
              <option value="">Sélectionnez un produit</option>
              <option *ngFor="let stock of stocks" [value]="stock.id">
                {{ stock.nomProduit }} - Prix: {{ formatCurrency(stock.prix) }}
              </option>
            </select>
            <p *ngIf="isFieldInvalid('stockId')" class="mt-1 text-sm text-red-600">
              Veuillez sélectionner un produit
            </p>
          </div>

          <div>
            <label for="employe" class="block text-sm font-medium text-gray-700">
              Employé
            </label>
            <select
              id="employe"
              formControlName="employeId"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('employeId')">
              <option value="">Sélectionnez un employé</option>
              <option *ngFor="let employe of employes" [value]="employe.id">
                {{ employe.employeNom }} {{ employe.employePrenom }}
              </option>
            </select>
            <p *ngIf="isFieldInvalid('employeId')" class="mt-1 text-sm text-red-600">
              Veuillez sélectionner un employé
            </p>
          </div>

          <div>
            <label for="quantite" class="block text-sm font-medium text-gray-700">
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
            <p *ngIf="isFieldInvalid('quantite')" class="mt-1 text-sm text-red-600">
              La quantité doit être supérieure à 0
            </p>
          </div>

          <div>
            <label for="prixUnitaire" class="block text-sm font-medium text-gray-700">
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
            <p *ngIf="isFieldInvalid('prixUnitaire')" class="mt-1 text-sm text-red-600">
              Le prix unitaire doit être supérieur à 0
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Montant total
            </label>
            <p class="text-lg font-semibold text-gray-900">
              {{ formatCurrency(montantTotal) }}
            </p>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              class="btn-secondary"
              (click)="onCancel()">
              Annuler
            </button>
            <button
              type="submit"
              class="btn-primary"
              [disabled]="achatForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AchatFormComponent implements OnInit {
  @Input() stocks: Stock[] = [];
  @Input() employes: Employe[] = [];
  @Output() save = new EventEmitter<Achat>();
  @Output() cancel = new EventEmitter<void>();

  achatForm: FormGroup;
  isSubmitting = false;
  montantTotal = 0;

  constructor(private fb: FormBuilder) {
    this.achatForm = this.fb.group({
      stockId: ['', [Validators.required]],
      employeId: ['', [Validators.required]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prixUnitaire: [0, [Validators.required, Validators.min(0)]],
      dateAchat: [new Date(), [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.calculateTotal();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'FCFA' }).format(amount);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.achatForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onStockChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const stockId = Number(select.value);
    const stock = this.stocks.find(s => s.id === stockId);
    if (stock) {
      this.achatForm.patchValue({
        prixUnitaire: stock.prix
      });
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    const quantite = this.achatForm.get('quantite')?.value || 0;
    const prixUnitaire = this.achatForm.get('prixUnitaire')?.value || 0;
    this.montantTotal = quantite * prixUnitaire;
  }

  onSubmit(): void {
    if (this.achatForm.valid) {
      this.isSubmitting = true;
      const formValue = this.achatForm.value;

      const achat: Achat = {
        id: 0,
        stock: this.stocks.find(s => s.id === Number(formValue.stockId))!,
        employe: this.employes.find(e => e.id === Number(formValue.employeId))!,
        dateAchat: formValue.dateAchat,
        quantite: formValue.quantite,
        prixUnitaire: formValue.prixUnitaire,
        montantTotal: this.montantTotal
      };

      this.save.emit(achat);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

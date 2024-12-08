import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Stock } from '../../../models';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">
            {{ stock ? 'Modifier' : 'Ajouter' }} un produit
          </h2>
          <button 
            class="text-gray-400 hover:text-gray-500"
            (click)="onCancel()">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form [formGroup]="stockForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="nomProduit" class="block text-sm font-medium text-gray-700">
              Nom du produit
            </label>
            <input
              type="text"
              id="nomProduit"
              formControlName="nomProduit"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('nomProduit')"
            />
            <p *ngIf="isFieldInvalid('nomProduit')" class="mt-1 text-sm text-red-600">
              Le nom du produit est requis
            </p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              formControlName="description"
              rows="3"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('description')"
            ></textarea>
            <p *ngIf="isFieldInvalid('description')" class="mt-1 text-sm text-red-600">
              La description est requise
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
              min="0"
            />
            <p *ngIf="isFieldInvalid('quantite')" class="mt-1 text-sm text-red-600">
              La quantité doit être un nombre positif
            </p>
          </div>

          <div>
            <label for="prix" class="block text-sm font-medium text-gray-700">
              Prix unitaire
            </label>
            <input
              type="number"
              id="prix"
              formControlName="prix"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('prix')"
              min="0"
              step="0.01"
            />
            <p *ngIf="isFieldInvalid('prix')" class="mt-1 text-sm text-red-600">
              Le prix doit être un nombre positif
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
              [disabled]="stockForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Enregistrement...' : (stock ? 'Modifier' : 'Ajouter') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class StockFormComponent implements OnInit {
  @Input() stock: Stock | null = null;
  @Output() save = new EventEmitter<Stock>();
  @Output() cancel = new EventEmitter<void>();

  stockForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.stockForm = this.fb.group({
      nomProduit: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      prix: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.stock) {
      this.stockForm.patchValue(this.stock);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.stockForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.stockForm.valid) {
      this.isSubmitting = true;
      const stockData = this.stockForm.value;
      if (this.stock) {
        stockData.id = this.stock.id;
      }
      this.save.emit(stockData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
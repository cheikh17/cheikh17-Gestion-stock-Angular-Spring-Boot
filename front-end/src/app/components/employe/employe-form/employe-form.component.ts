import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employe } from '../../../models';

@Component({
  selector: 'app-employe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">
            {{ employe ? 'Modifier' : 'Ajouter' }} un employé
          </h2>
          <button 
            class="text-gray-400 hover:text-gray-500"
            (click)="onCancel()">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form [formGroup]="employeForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="nom" class="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              id="nom"
              formControlName="nom"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('nom')"
            />
            <p *ngIf="isFieldInvalid('nom')" class="mt-1 text-sm text-red-600">
              Le nom est requis
            </p>
          </div>

          <div>
            <label for="prenom" class="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              id="prenom"
              formControlName="prenom"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('prenom')"
            />
            <p *ngIf="isFieldInvalid('prenom')" class="mt-1 text-sm text-red-600">
              Le prénom est requis
            </p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('email')"
            />
            <p *ngIf="isFieldInvalid('email')" class="mt-1 text-sm text-red-600">
              Un email valide est requis
            </p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              formControlName="phone"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('phone')"
            />
            <p *ngIf="isFieldInvalid('phone')" class="mt-1 text-sm text-red-600">
              Un numéro de téléphone valide est requis
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
              [disabled]="employeForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Enregistrement...' : (employe ? 'Modifier' : 'Ajouter') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EmployeFormComponent implements OnInit {
  @Input() employe: Employe | null = null;
  @Output() save = new EventEmitter<Employe>();
  @Output() cancel = new EventEmitter<void>();

  employeForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.employeForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)]],
    });
  }

  ngOnInit(): void {
    if (this.employe) {
      this.employeForm.patchValue(this.employe);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.employeForm.valid) {
      this.isSubmitting = true;
      const employeData = this.employeForm.value;
      if (this.employe) {
        employeData.id = this.employe.id;
      }
      this.save.emit(employeData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeService } from '../../../services';
import { Employe } from '../../../models';
import { EmployeFormComponent } from '../employe-form/employe-form.component';

@Component({
  selector: 'app-employe-list',
  standalone: true,
  imports: [CommonModule, EmployeFormComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestion des Employés</h1>
        <button class="btn-primary" (click)="openCreateForm()">
          Nouvel Employé
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let employe of employes">
                <td class="px-6 py-4 whitespace-nowrap">{{ employe.employeNom }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ employe.employePrenom }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ employe.employeEmail }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ employe.employePhone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    class="text-primary-600 hover:text-primary-900 mr-3"
                    (click)="editEmploye(employe)">
                    Modifier
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900"
                    (click)="deleteEmploye(employe.id)">
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-employe-form
      *ngIf="showForm"
      [employe]="selectedEmploye"
      (save)="onSaveEmploye($event)"
      (cancel)="closeForm()"
    ></app-employe-form>
  `
})
export class EmployeListComponent implements OnInit {
  employes: Employe[] = [];
  showForm = false;
  selectedEmploye: Employe | null = null;

  constructor(private employeService: EmployeService) {}

  ngOnInit(): void {
    this.loadEmployes();
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
    this.selectedEmploye = null;
    this.showForm = true;
  }

  editEmploye(employe: Employe): void {
    this.selectedEmploye = employe;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedEmploye = null;
  }

  onSaveEmploye(employe: Employe): void {
    const operation = employe.id
      ? this.employeService.updateEmploye(employe.id, employe)
      : this.employeService.createEmploye(employe);

    operation.subscribe({
      next: () => {
        this.loadEmployes();
        this.closeForm();
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement:', error);
      }
    });
  }

  deleteEmploye(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeService.deleteEmploye(id).subscribe({
        next: () => {
          this.loadEmployes();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
}

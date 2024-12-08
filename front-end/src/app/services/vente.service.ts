import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vente } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenteService {
  private apiUrl = `${environment.apiUrl}/ventes`;

  constructor(private http: HttpClient) { }

  getAllVentes(): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}/all`);
  }

  getVenteById(id: number): Observable<Vente> {
    return this.http.get<Vente>(`${this.apiUrl}/${id}`);
  }

  createVente(vente: Vente): Observable<Vente> {
    return this.http.post<Vente>(`${this.apiUrl}/create`, vente);
  }

  getVentesByPeriode(debut: Date, fin: Date): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}/periode`, {
      params: {
        debut: debut.toISOString(),
        fin: fin.toISOString()
      }
    });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achat } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AchatService {
  private apiUrl = `${environment.apiUrl}/achats`;

  constructor(private http: HttpClient) { }

  getAllAchats(): Observable<Achat[]> {
    return this.http.get<Achat[]>(`${this.apiUrl}/all`);
  }

  getAchatById(id: number): Observable<Achat> {
    return this.http.get<Achat>(`${this.apiUrl}/${id}`);
  }

  createAchat(achat: Achat): Observable<Achat> {
    return this.http.post<Achat>(`${this.apiUrl}/create`, achat);
  }

  getAchatsByPeriode(debut: Date, fin: Date): Observable<Achat[]> {
    return this.http.get<Achat[]>(`${this.apiUrl}/periode`, {
      params: {
        debut: debut.toISOString(),
        fin: fin.toISOString()
      }
    });
  }
}
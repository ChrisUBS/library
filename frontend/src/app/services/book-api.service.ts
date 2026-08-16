import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book, BookInput } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/books`;

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }

  create(payload: BookInput): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, payload);
  }

  update(id: number, payload: BookInput): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

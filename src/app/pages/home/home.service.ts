import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../types/types';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly route = inject(Router);

  private readonly itemsSubject = new BehaviorSubject<User[]>([]);
  items$ = this.itemsSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getUsers() {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<User[]>(`${environment.API_URL}/api/users`)
      .pipe(
        tap((items) => this.itemsSubject.next(items)),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  getOneUser(id: string) {
    return this.httpClient.get<User>(`${environment.API_URL}/api/users/${id}`);
  }

  createUser(data: FormData, closeModal: () => void) {
    this.loadingSubject.next(true);
    return this.httpClient
      .post(`${environment.API_URL}/api/users/`, data)
      .pipe(
        tap((newItem: any) => {
          const currentItems = this.itemsSubject.value;
          this.itemsSubject.next([...currentItems, newItem]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((data) => {
        if (data) {
          closeModal();
        }
      });
  }

  updateUser(id: string, data: FormData) {
    this.loadingSubject.next(true);
    return this.httpClient
      .put(`${environment.API_URL}/api/users/${id}`, data)
      .pipe(
        tap((updatedItem: any) => {
          const currentItems = this.itemsSubject.value.map((i) =>
            i.id === updatedItem?.id ? updatedItem : i
          );
          this.itemsSubject.next(currentItems);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((data) => {
        if (data) this.route.navigate(['/']);
      });
  }

  deleteUser(id: string) {
    return this.httpClient
      .delete<{ success: boolean }>(`${environment.API_URL}/api/users/${id}`)
      .subscribe((data) => {
        if (data.success) this.route.navigate(['/']);
      });
  }
}

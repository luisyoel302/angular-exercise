import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination, User } from '../../../types/types';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastrService);

  // Get All Users
  getUsers(pageParam: string) {
    const { url } = this.getUrlQuerys();
    if (pageParam !== '') {
      url.searchParams.append('page', pageParam);
    }
    return lastValueFrom(this._http.get<Pagination>(url.toString()));
  }

  // Get One User
  getOneUser(id: string, args?: { enabled?: boolean }) {
    return injectQuery(() => ({
      queryKey: ['user', id],
      queryFn: () =>
        lastValueFrom(
          this._http.get<User>(`${environment.API_URL}/users/${id}`)
        ),
      ...args,
    }));
  }

  // Create One User
  createUser(closeModal: () => void) {
    return injectMutation((client) => ({
      mutationFn: (data: any) =>
        lastValueFrom(
          this._http.post<User>(`${environment.API_URL}/users`, data)
        ),
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['users'] });
        closeModal();
        this._toast.success('User created successfully', 'Create');
      },
    }));
  }

  // Update One User
  updateUser(closeModal: () => void) {
    return injectMutation((client) => ({
      mutationFn: (data: any) =>
        lastValueFrom(
          this._http.put<User>(`${environment.API_URL}/users/${data.id}`, data)
        ),
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['user'] });
        client.refetchQueries({ queryKey: ['users'] });
        closeModal();
        this._toast.success('User updated successfully', 'Update');
      },
    }));
  }

  // Delete One User
  deleteUser() {
    return injectMutation((client) => ({
      mutationFn: ({ id }: { id: string }) =>
        lastValueFrom(
          this._http.delete<User>(`${environment.API_URL}/users/${id}`)
        ),
      onSuccess: () => {
        client.refetchQueries({ queryKey: ['users'] });
        this._router.navigate(['']);
        this._toast.success('User deleted successfully', 'Delete');
      },
    }));
  }

  // get query URL with name
  getUrlQuerys() {
    let url = new URL(`${environment.API_URL}/users`);
    let params: any = {};
    this._activatedRoute.queryParamMap.subscribe(
      (p: any) => (params = p['params'])
    );

    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });
    return {
      url,
      params,
    };
  }
}

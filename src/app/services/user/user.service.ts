import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Character } from '../../../types/types';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly _activatedRoute = inject(ActivatedRoute);

  getUsers() {
    const { url } = this.getUrlQuerys();
    return lastValueFrom(
      this._http.get<{
        results: Character[];
        info: any;
      }>(url.toString())
    );
  }

  getOneUser(id: string) {
    return lastValueFrom(
      this._http.get<Character>(`${environment.API_URL}/api/character/${id}`)
    );
  }

  getUrlQuerys() {
    let url = new URL(`${environment.API_URL}/api/character/`);
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

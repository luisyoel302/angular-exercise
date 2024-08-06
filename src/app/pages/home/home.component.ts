import { Component, inject, signal } from '@angular/core';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormComponent } from '../../components/form/form.component';
import { UserService } from '../../services/user/user.service';
import {
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardItemComponent, ModalComponent, FormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly route = inject(Router);
  private readonly _userSvc = inject(UserService);
  queryClient = injectQueryClient();

  showModal = false;
  search = signal<string>(
    this._userSvc.getUrlQuerys().url.searchParams.get('name') ?? ''
  );
  debouncedValue = signal<string>('');
  private inputSubject = new Subject<string>();

  page = signal(this._userSvc.getUrlQuerys().url.searchParams.get('page') ?? 1);

  constructor() {
    this.inputSubject
      .pipe(debounceTime(500))
      .subscribe((value) => this.debouncedValue.set(value));

    console.log(
      Number(this._userSvc.getUrlQuerys().url.searchParams.get('page'))
    );
  }

  userQuery = injectQuery(() => ({
    queryKey: ['users', this.debouncedValue(), this.page()],
    queryFn: () => this._userSvc.getUsers(),
  }));

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  applyFilter(event: Event) {
    const search = (event.target as HTMLInputElement).value;
    const { params } = this._userSvc.getUrlQuerys();
    if (search !== '') {
      this.route.navigate([''], { queryParams: { ...params, name: search } });
    } else {
      console.log(params);
      this.route.navigate([''], { queryParams: { ...params } });
    }
    this.search.update(() => search);
    this.inputSubject.next(search);
  }

  loadMore({ isNextPage }: { isNextPage: boolean }) {
    const { params } = this._userSvc.getUrlQuerys();
    if (isNextPage && this.userQuery.data()?.info.next) {
      this.route.navigate([''], {
        queryParams: { ...params, page: +this.page() + 1 },
      });
      this.page.update((v) => +v + 1);
    } else if (!isNextPage && this.userQuery.data()?.info.prev) {
      this.route.navigate([''], {
        queryParams: { ...params, page: +this.page() - 1 },
      });
      this.page.update((v) => +v - 1);
    }
  }
}

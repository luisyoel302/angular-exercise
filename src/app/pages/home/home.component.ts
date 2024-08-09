import { Component, inject, signal } from '@angular/core';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormComponent } from '../../components/form/form.component';
import { UserService } from '../../services/user/user.service';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
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
  private inputSubject = new Subject<string>();

  showModal = false;
  search = signal<string>(
    this._userSvc.getUrlQuerys().url.searchParams.get('name') ?? ''
  );
  debouncedValue = signal<string>('');

  constructor() {
    this.inputSubject
      .pipe(debounceTime(500))
      .subscribe((value) => this.debouncedValue.set(value));
  }

  userQuery = injectInfiniteQuery(() => ({
    queryKey: ['users', this.debouncedValue()],
    initialPageParam: '',
    queryFn: ({ pageParam }) => {
      return this._userSvc.getUsers(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.lastEvaluatedKey) {
        return null;
      }
      return lastPage?.lastEvaluatedKey?.id;
    },
    select: (data) => {
      const newData = data.pages.flat();
      return newData.flatMap((item) => item.data);
    },
  }));

  ngOnInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.userQuery.isFetching()) {
        this.userQuery.fetchNextPage();
      }
    });
    observer.observe(document.querySelector('#loader') as Element);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  applyFilter(event: Event) {
    const search = (event.target as HTMLInputElement).value;
    if (search !== '') {
      this.route.navigate([''], { queryParams: { name: search } });
    } else {
      this.route.navigate(['']);
    }
    this.search.update(() => search);
    this.inputSubject.next(search);
  }
}

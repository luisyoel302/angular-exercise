import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormComponent } from '../../components/form/form.component';
import { NgOptimizedImage } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import {
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterModule, ModalComponent, FormComponent, NgOptimizedImage],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  private readonly _userSvc = inject(UserService);

  queryClient = injectQueryClient();
  showModal = false;

  //get from url params
  id = input<string>('');

  userQuery = injectQuery(() => ({
    queryKey: ['user', this.id()],
    queryFn: () => this._userSvc.getOneUser(this.id()),
    enabled: !!this.id,
  }));

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteUser(id: any) {
    //this.userSvc.deleteUser(id);
  }
}

import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  imports: [RouterModule, ModalComponent, FormComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  private readonly _userSvc = inject(UserService);
  private readonly router = inject(ActivatedRoute);

  showModal = false;
  id = this.router.snapshot.params['id'];

  userQuery = this._userSvc.getOneUser(this.id ?? '', { enabled: !!this.id });
  deleteUserMutation = this._userSvc.deleteUser();

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteUser(id: any) {
    this.deleteUserMutation.mutate({ id });
  }
}

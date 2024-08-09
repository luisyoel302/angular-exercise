import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../../types/types';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.css',
})
export class CardItemComponent {
  user = input.required<User>();
}

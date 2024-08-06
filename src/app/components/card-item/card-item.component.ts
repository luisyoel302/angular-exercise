import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Character, User } from '../../../types/types';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.css',
})
export class CardItemComponent {
  user = input.required<Character>();
}

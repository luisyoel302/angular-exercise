import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  titleModal = input.required<string>();

  closeModal() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

  ngOnInit() {
    if (!this.close.observed) {
      throw new Error(
        'El evento close es obligatorio y debe tener un manejador.'
      );
    }
  }
}

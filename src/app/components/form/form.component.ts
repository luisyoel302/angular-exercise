import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../types/types';
import { UsersService } from '../../pages/home/home.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  private readonly userSvc = inject(UsersService);
  @Output() close = new EventEmitter<void>();
  items = input<User>();
  loading = false;
  file = '';
  form = signal<FormGroup>(
    new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
      id: new FormControl(''),
      image: new FormControl<File | null>(null),
      imageSource: new FormControl<File | null>(null),
    })
  );

  ngOnInit() {
    if (this.items()) {
      this.form().patchValue({
        name: this.items()?.name,
        description: this.items()?.description,
        text: this.items()?.text,
        id: this.items()?.id,
        phoneNumber: this.items()?.phoneNumber,
        image: '',
        imageSource: '',
      });
    }
    this.userSvc.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  closeModal = () => {
    this.close.emit();
  };

  submit() {
    if (this.form().valid) {
      const formData = new FormData();

      Object.entries(this.form().value).forEach((item) => {
        formData.append(item[0], item[1] as any);
      });

      if (this.items()) {
        this.userSvc.updateUser(
          this.form().get('id')?.value,
          this.form().value
        );
      } else {
        this.userSvc.createUser(this.form().value, () => this.closeModal());
      }
    } else {
      this.form().markAllAsTouched();
    }
  }

  getValidInput(key: string) {
    const input = this.form().get(key);
    return input?.errors && (input.dirty || input.touched);
  }

  onImagePicker(evt: any) {
    if (evt.target?.files) {
      const file = evt.target?.files[0];
      this.form().patchValue({ imageSource: file });

      const url = URL.createObjectURL(evt.target.files[0]);
      this.file = url;
    }
  }
}

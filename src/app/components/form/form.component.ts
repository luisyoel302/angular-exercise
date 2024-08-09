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
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  private readonly userSvc = inject(UserService);
  @Output() close = new EventEmitter<void>();
  items = input<User>();

  file = '';
  form = signal<FormGroup>(
    new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
      id: new FormControl(''),
      //image: new FormControl<File | null>(null),
      //imageSource: new FormControl<File | null>(null),
    })
  );

  ngOnInit() {
    if (this.items()) {
      this.form().patchValue({
        name: this.items()?.name,
        description: this.items()?.description,
        text: this.items()?.text,
        id: this.items()?.id,
        phone: this.items()?.phone,
        // image: '',
        // imageSource: '',
      });
    }
  }

  closeModal = () => {
    this.close.emit();
  };

  createUser = this.userSvc.createUser(() => this.closeModal());
  updateUser = this.userSvc.updateUser(() => this.closeModal());

  submit() {
    if (this.form().valid) {
      const formData = new FormData();

      Object.entries(this.form().value).forEach((item) => {
        formData.append(item[0], item[1] as any);
      });

      if (this.items()) {
        this.updateUser.mutate(this.form().value);
      } else {
        this.createUser.mutate(this.form().value);
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

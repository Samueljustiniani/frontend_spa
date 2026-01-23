import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  userId?: number;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.userId = +id;
      this.loadUser();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      lastname: [''],
      phone: [''],
      role: ['USER'],
      status: ['A']
    });
  }

  loadUser(): void {
    this.loading = true;
    this.userService.getById(this.userId!).subscribe({
      next: (user) => {
        this.form.patchValue(user);
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/customers']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const data = this.form.value;
    
    // Si es edición y no hay password, no enviarlo
    if (this.isEdit && !data.password) {
      delete data.password;
    }

    const request$ = this.isEdit
      ? this.userService.update(this.userId!, data)
      : this.userService.create(data);

    request$.subscribe({
      next: () => this.router.navigate(['/customers']),
      error: (err) => {
        console.error('Error saving user:', err);
        this.submitting = false;
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';

const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const pw = group.get('password')?.value;
  const cpw = group.get('confirm_password')?.value;
  return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputFieldComponent],
  templateUrl: `./register.component.html`,
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  serverError = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  currentStep = signal(0);

  readonly steps = [
    { title: 'Personal info', desc: 'Name and username' },
    { title: 'Contact details', desc: 'Your email address' },
    { title: 'Secure password', desc: 'Keep your account safe' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        full_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );

    // Advance the step tracker as the user fills out fields
    this.registerForm.valueChanges.subscribe((v) => {
      if (v.password?.length >= 8) this.currentStep.set(3);
      else if (v.email) this.currentStep.set(2);
      else if (v.full_name || v.username) this.currentStep.set(1);
      else this.currentStep.set(0);
    });
  }

  public get form(): { [key: string]: FormControl } { return this.registerForm.controls as { [key: string]: FormControl }; }

  get confirmPasswordControl() {
    const ctrl = this.form['confirm_password'];
    if (this.registerForm.errors?.['passwordMismatch'] && ctrl.touched) {
      ctrl.setErrors({ passwordMismatch: true });
    }
    return ctrl as any;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.serverError.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage.set('Account created! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.serverError.set(err.error?.detail ?? 'Registration failed. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}

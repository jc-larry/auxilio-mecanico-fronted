import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
  templateUrl: './input-field.component.html',
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() icon = '';
  @Input() control: FormControl | null = null;

  value = '';
  isDisabled = false;
  showPassword = false;

  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };

  get inputType(): string {
    if (this.type === 'password') return this.showPassword ? 'text' : 'password';
    return this.type;
  }

  get errorMessage(): string | null {
    if (!this.control?.errors || !this.control.touched) return null;
    const errors = this.control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Enter a valid email address';
    if (errors['minlength']) return 'Minimum ' + errors['minlength'].requiredLength + ' characters';
    if (errors['pattern']) return 'Only letters, numbers and underscores allowed';
    if (errors['passwordMismatch']) return 'Passwords do not match';
    return Object.values(errors)[0]?.message ?? 'Invalid value';
  }

  get inputClasses(): string {
    const hasError = this.control?.invalid && this.control?.touched;
    const pl = this.icon ? 'pl-10' : 'pl-4';
    const pr = this.type === 'password' ? 'pr-10' : 'pr-4';
    const base = 'w-full ' + pl + ' ' + pr + ' py-3 rounded-lg font-body text-sm text-on-surface bg-surface-container-low placeholder:text-outline transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-surface-container-lowest disabled:opacity-50';
    return hasError ? base + ' ring-1 ring-error focus:ring-error' : base + ' ring-0 focus:ring-primary/30';
  }

  toggleVisibility(): void { this.showPassword = !this.showPassword; }

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  writeValue(value: string): void { this.value = value ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled = isDisabled; }
}

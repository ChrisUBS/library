import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookFormState } from '../../models/book-form.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css',
})
export class BookFormComponent {
  @Input({ required: true }) form!: BookFormState;
  @Input() isEditing = false;
  @Input() saving = false;

  @Output() readonly submitForm = new EventEmitter<void>();
  @Output() readonly cancelEdit = new EventEmitter<void>();
  @Output() readonly refreshBooks = new EventEmitter<void>();

  submit(): void {
    this.submitForm.emit();
  }

  cancel(): void {
    this.cancelEdit.emit();
  }
}

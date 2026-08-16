import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css',
})
export class BooksListComponent {
  @Input() books: Book[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() readonly editBook = new EventEmitter<Book>();
  @Output() readonly deleteBook = new EventEmitter<Book>();

  trackById(_: number, book: Book): number {
    return book.id;
  }
}

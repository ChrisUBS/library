import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { BookFormComponent } from '../../components/book-form/book-form.component';
import { BooksListComponent } from '../../components/books-list/books-list.component';
import { BookFormState } from '../../models/book-form.model';
import { Book, BookInput } from '../../models/book.model';
import { BookApiService } from '../../services/book-api.service';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, BookFormComponent, BooksListComponent],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.css',
})
export class BooksPageComponent implements OnInit {
  readonly books = signal<Book[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<number | null>(null);

  form: BookFormState = this.emptyForm();

  constructor(private readonly bookApi: BookApiService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  get isEditing(): boolean {
    return this.editingId() !== null;
  }

  get totalBooks(): number {
    return this.books().length;
  }

  loadBooks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.bookApi.getAll().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.resolveError(err, 'No se pudieron cargar los libros.'));
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    const payload = this.toPayload();
    this.saving.set(true);
    this.error.set(null);

    const request$ = this.isEditing
      ? this.bookApi.update(this.editingId() as number, payload)
      : this.bookApi.create(payload);

    request$.subscribe({
      next: (savedBook) => {
        this.upsertBook(savedBook);
        this.resetForm();
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set(this.resolveError(err, 'No se pudo guardar el libro.'));
        this.saving.set(false);
      },
    });
  }

  edit(book: Book): void {
    this.editingId.set(book.id);
    this.form = this.formFromBook(book);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  remove(book: Book): void {
    if (!window.confirm(`Eliminar "${book.title}"`)) {
      return;
    }

    this.error.set(null);
    this.bookApi.delete(book.id).subscribe({
      next: () => {
        this.books.set(this.books().filter((item) => item.id !== book.id));
        if (this.editingId() === book.id) {
          this.resetForm();
        }
      },
      error: (err) => {
        this.error.set(this.resolveError(err, 'No se pudo eliminar el libro.'));
      },
    });
  }

  private upsertBook(book: Book): void {
    const books = this.books();
    const index = books.findIndex((item) => item.id === book.id);

    if (index === -1) {
      this.books.set([book, ...books]);
      return;
    }

    const nextBooks = [...books];
    nextBooks[index] = book;
    this.books.set(nextBooks);
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
  }

  private emptyForm(): BookFormState {
    return {
      title: '',
      author: '',
      isbn: '',
      publishedYear: '',
      description: '',
    };
  }

  private formFromBook(book: Book): BookFormState {
    return {
      title: book.title,
      author: book.author,
      isbn: book.isbn ?? '',
      publishedYear: book.publishedYear?.toString() ?? '',
      description: book.description ?? '',
    };
  }

  private toPayload(): BookInput {
    return {
      title: this.form.title.trim(),
      author: this.form.author.trim(),
      isbn: this.normalizeOptionalText(this.form.isbn),
      publishedYear: this.normalizeOptionalNumber(this.form.publishedYear),
      description: this.normalizeOptionalText(this.form.description),
    };
  }

  private normalizeOptionalText(value: string | null | undefined): string | null {
    const trimmed = (value ?? '').trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private normalizeOptionalNumber(value: string | number | null | undefined): number | null {
    const trimmed = String(value ?? '').trim();
    if (trimmed.length === 0) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private resolveError(error: unknown, fallbackMessage: string): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = this.extractApiMessage(error.error);
      return apiMessage ?? error.message ?? fallbackMessage;
    }

    return fallbackMessage;
  }

  private extractApiMessage(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const message = (payload as { message?: string }).message;
    const details = (payload as { details?: string[] }).details;

    if (message && details?.length) {
      return `${message}: ${details.join(', ')}`;
    }

    return message ?? null;
  }
}

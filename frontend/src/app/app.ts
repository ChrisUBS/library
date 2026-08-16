import { Component } from '@angular/core';
import { BooksPageComponent } from './pages/books-page/books-page.component';

@Component({
  selector: 'app-root',
  imports: [BooksPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

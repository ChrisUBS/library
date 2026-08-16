export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  publishedYear: number | null;
  description: string | null;
}

export interface BookInput {
  title: string;
  author: string;
  isbn: string | null;
  publishedYear: number | null;
  description: string | null;
}

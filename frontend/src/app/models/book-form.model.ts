export interface BookFormState {
  title: string;
  author: string;
  isbn: string | null | undefined;
  publishedYear: string | number | null | undefined;
  description: string | null | undefined;
}

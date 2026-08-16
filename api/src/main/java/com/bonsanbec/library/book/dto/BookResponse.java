package com.bonsanbec.library.book.dto;

public record BookResponse(
    Long id,
    String title,
    String author,
    String isbn,
    Integer publishedYear,
    String description
) {
}

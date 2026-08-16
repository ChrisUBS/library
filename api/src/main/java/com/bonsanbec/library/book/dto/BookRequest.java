package com.bonsanbec.library.book.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookRequest(
    @NotBlank
    @Size(max = 200)
    String title,

    @NotBlank
    @Size(max = 200)
    String author,

    @Size(max = 32)
    String isbn,

    Integer publishedYear,

    @Size(max = 4000)
    String description
) {
}

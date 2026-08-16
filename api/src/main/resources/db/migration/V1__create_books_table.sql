CREATE TABLE books (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(200) NOT NULL,
    isbn VARCHAR(32) NULL,
    published_year INT NULL,
    description TEXT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_books_isbn (isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

package com.maesejoe.booktracker.book.dto;

import com.maesejoe.booktracker.book.Book;
import com.maesejoe.booktracker.book.ReadingStatus;

import java.time.LocalDate;
import java.time.Year;

public record BookResponse(
        Long id,
        String title,
        String author,
        Year publishedYear,
        String isbn,
        String coverUrl,
        ReadingStatus status,
        Integer rating,
        String review,
        LocalDate startedAt,
        LocalDate finishedAt
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublishedYear(),
                book.getIsbn(),
                book.getCoverUrl(),
                book.getStatus(),
                book.getRating(),
                book.getReview(),
                book.getStartedAt(),
                book.getFinishedAt()
        );
    }
}

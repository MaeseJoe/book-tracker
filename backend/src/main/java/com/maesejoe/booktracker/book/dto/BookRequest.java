package com.maesejoe.booktracker.book.dto;

import com.maesejoe.booktracker.book.ReadingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Year;

public record BookRequest(
        @NotBlank String title,
        @NotBlank String author,
        Year publishedYear,
        String isbn,
        String coverUrl,
        @NotNull ReadingStatus status
) {}

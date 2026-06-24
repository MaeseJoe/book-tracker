package com.maesejoe.booktracker.book;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Year;

@Entity
@Table(name = "books")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String author;

    private Year publishedYear;

    private String isbn;

    private String coverUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReadingStatus status;

    @Min(1)
    @Max(5)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String review;

    private LocalDate startedAt;

    private LocalDate finishedAt;
}

package com.maesejoe.booktracker.book;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.maesejoe.booktracker.auth.config.SecurityConfig;
import com.maesejoe.booktracker.auth.filter.JwtAuthenticationFilter;
import com.maesejoe.booktracker.book.dto.BookRequest;
import com.maesejoe.booktracker.book.dto.BookResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = BookController.class,
        excludeFilters = {
                @ComponentScan.Filter(
                        type = FilterType.ASSIGNABLE_TYPE,
                        classes = SecurityConfig.class
                ),
                @ComponentScan.Filter(
                        type = FilterType.ASSIGNABLE_TYPE,
                        classes = JwtAuthenticationFilter.class
                )
        }
)
public class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @MockitoBean
    private BookService bookService;

    @Test
    void shouldReturnAllBooks() throws Exception {
        BookResponse book = new BookResponse(1L, "Clean Code", "Robert C. Martin", null,
                null, null, ReadingStatus.FINISHED, null, null, null, null);

        when(bookService.findAll()).thenReturn(List.of(book));

        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Clean Code"))
                .andExpect(jsonPath("$[0].status").value("FINISHED"));
    }

    @Test
    void shouldReturn404WhenBookNotFound() throws Exception{
        when(bookService.findById(99L)).thenThrow(new BookNotFoundException(99L));

        mockMvc.perform(get("/api/books/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateBook() throws Exception {
        BookRequest request = new BookRequest("Clean Code", "Robert C. Martin",
                null, null, null, ReadingStatus.WANT_TO_READ,
                null, null, null, null);
        BookResponse response = new BookResponse(1L, "Clean Code", "Robert C. Martin",
                null, null, null, ReadingStatus.WANT_TO_READ,
                null, null, null, null);

        when(bookService.create(any())).thenReturn(response);

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void shouldCreateBookWithRatingAndReview() throws Exception {
        BookRequest request = new BookRequest("Clean Code", "Robert C. Martin",
                null, null, null, ReadingStatus.FINISHED,
                5, "A must-read for every developer.",
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 2, 1));
        BookResponse response = new BookResponse(1L, "Clean Code", "Robert C. Martin",
                null, null, null, ReadingStatus.FINISHED,
                5, "A must-read for every developer.",
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 2, 1));

        when(bookService.create(any())).thenReturn(response);

        mockMvc.perform(post("/api/books")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.review").value("A must-read for every developer."))
                .andExpect(jsonPath("$.startedAt").value("2024-01-01"))
                .andExpect(jsonPath("$.finishedAt").value("2024-02-01"));
    }

    @Test
    void shouldUpdateBookRating() throws Exception {
        BookRequest request = new BookRequest("Clean Code", "Robert C. Martin",
                null, null, null, ReadingStatus.FINISHED,
                4, "Great book.", null, null);
        BookResponse response = new BookResponse(1L, "Clean Code", "Robert C. Martin",
                null, null, null, ReadingStatus.FINISHED,
                4, "Great book.", null, null);

        when(bookService.update(eq(1L), any())).thenReturn(response);

        mockMvc.perform(put("/api/books/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rating").value(4))
                .andExpect(jsonPath("$.review").value("Great book."));
    }

    @Test
    void shouldReturn404WhenRequestInvalid() throws Exception {
        String invalidRequest = """
                {"title": "", "author": "", "status": "FINISHED"}
                """;

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldDeleteBook() throws Exception {
        mockMvc.perform(delete("/api/books/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn404WhenDeletingNonExistentBook() throws Exception {
        doThrow(new BookNotFoundException(99L)).when(bookService).delete(99L);

        mockMvc.perform(delete("/api/books/99"))
                .andExpect(status().isNotFound());
    }
}

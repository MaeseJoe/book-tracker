package com.maesejoe.booktracker.book;


import com.maesejoe.booktracker.book.dto.BookRequest;
import com.maesejoe.booktracker.book.dto.BookResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public List<BookResponse> findAll() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::from)
                .toList();
    }

    public List<BookResponse> findByStatus(ReadingStatus status) {
        return bookRepository.findByStatus(status)
                .stream()
                .map(BookResponse::from)
                .toList();
    }

    public BookResponse findById(Long id) {
        return bookRepository.findById(id)
                .map(BookResponse::from)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    @Transactional
    public BookResponse create(BookRequest request) {
        Book book = Book.builder()
                .title(request.title())
                .author(request.author())
                .publishedYear(request.publishedYear())
                .isbn(request.isbn())
                .coverUrl(request.coverUrl())
                .status(request.status())
                .build();

        return BookResponse.from(bookRepository.save(book));
    }

    @Transactional
    public BookResponse update(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));

        book.setTitle(request.title());
        book.setAuthor(request.author());
        book.setPublishedYear(request.publishedYear());
        book.setIsbn(request.isbn());
        book.setCoverUrl(request.coverUrl());
        book.setStatus(request.status());

        return BookResponse.from(bookRepository.save(book));
    }

    public void delete(Long id) {
        if(!bookRepository.existsById(id)) {
            throw new BookNotFoundException(id);
        }

        bookRepository.deleteById(id);
    }
}

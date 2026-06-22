package com.maesejoe.booktracker.book;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;
import com.maesejoe.booktracker.TestcontainersConfiguration;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Transactional
public class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Test
    void shouldSaveAndFindBook() {
        Book book = Book.builder()
                .title("Clean Code")
                .author("Robert C. Martin")
                .status(ReadingStatus.FINISHED)
                .build();

        Book saved = bookRepository.save(book);

        assertThat(saved.getId()).isNotNull();
        assertThat(bookRepository.findById(saved.getId())).isPresent();
    }

    @Test
    void shouldFindByStatus() {
        bookRepository.save(Book.builder().title("Book A").author("Author A")
                .status(ReadingStatus.READING).build());
        bookRepository.save(Book.builder().title("Book B").author("Author B")
                .status(ReadingStatus.WANT_TO_READ).build());
        bookRepository.save(Book.builder().title("Book C").author("Author C")
                .status(ReadingStatus.READING).build());

        List<Book> reading = bookRepository.findByStatus(ReadingStatus.READING);

        assertThat(reading).hasSize(2);
        assertThat(reading).allMatch(b -> b.getStatus() == ReadingStatus.READING);
    }

    @Test
    void shouldReturnTrueWhenIsbnExists() {
        bookRepository.save(Book.builder().title("Book A").author("Author A")
                .isbn("978-3-16-148410-0").status(ReadingStatus.READING).build());

        assertThat(bookRepository.existsByIsbn("978-3-16-148410-0")).isTrue();
        assertThat(bookRepository.existsByIsbn("000-0-00-000000-0")).isFalse();
    }
}

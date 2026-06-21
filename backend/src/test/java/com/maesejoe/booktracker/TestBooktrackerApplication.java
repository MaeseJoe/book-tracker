package com.maesejoe.booktracker;

import org.springframework.boot.SpringApplication;

public class TestBooktrackerApplication {

	public static void main(String[] args) {
		SpringApplication.from(BooktrackerApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}

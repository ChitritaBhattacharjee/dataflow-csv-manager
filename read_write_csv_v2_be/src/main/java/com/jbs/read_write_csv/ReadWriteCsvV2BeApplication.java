package com.jbs.read_write_csv;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReadWriteCsvV2BeApplication {
	
	private static final Logger logger = LoggerFactory.getLogger(ReadWriteCsvV2BeApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(ReadWriteCsvV2BeApplication.class, args);
		logger.info("Springboot CSV read-write app. Vr.2 with Advanced Features started...");
	}

}

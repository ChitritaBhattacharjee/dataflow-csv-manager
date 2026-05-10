package com.jbs.read_write_csv.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jbs.read_write_csv.entity.Std;
import com.jbs.read_write_csv.service.impl.StdServiceImpl;
import com.opencsv.CSVWriter;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/students")
public class AppController {

	@Autowired
	private StdServiceImpl stdServiceImpl;

	@PostMapping(value = "/upload", consumes = { "multipart/form-data" })
	public ResponseEntity<Integer> uploadStudents(@RequestPart("file") MultipartFile file) throws IOException {
		return ResponseEntity.ok(stdServiceImpl.uploadStudents(file));
	}

	@GetMapping("/export")
	public void exportCSV(HttpServletResponse response) throws Exception {
		// set file name and content type
		String filename = "Std-List.csv";

		response.setContentType("text/csv");
		response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");

		// create a csv writer
		StatefulBeanToCsv<Std> writer = new StatefulBeanToCsvBuilder<Std>(response.getWriter())
				.withQuotechar(CSVWriter.NO_QUOTE_CHARACTER).withSeparator(CSVWriter.DEFAULT_SEPARATOR)
				.withOrderedResults(false).build();

		// write all employees to csv file
		writer.write(stdServiceImpl.fetchAll());
	}
	
	@GetMapping("/get_all_students")
	public ResponseEntity<List<Std>> getAllStudents() {
		return ResponseEntity.ok(stdServiceImpl.fetchAll());
	}
	
	@GetMapping("/get_student_by_id/{id}")
	public ResponseEntity<Std> getStudentById(@PathVariable("id") Integer id) {
		return ResponseEntity.ok(stdServiceImpl.getStudentById(id));
	}
	
	@PostMapping("/save_student")
	public ResponseEntity<Std> saveStudent(@RequestBody Std std) {
		return ResponseEntity.ok(stdServiceImpl.saveStudent(std));
	}
	
	@DeleteMapping("/delete_student_by_id/{id}")
	public ResponseEntity<String> deleteStudentById(@PathVariable("id") Integer id) {
		return ResponseEntity.ok(stdServiceImpl.deleteStudentById(id));
	}
}

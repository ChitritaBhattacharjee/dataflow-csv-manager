package com.jbs.read_write_csv.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jbs.read_write_csv.entity.Std;

public interface StdService {
	Integer uploadStudents(MultipartFile file) throws IOException;
	List<Std> fetchAll();
	Std getStudentById(Integer id);
	Std saveStudent(Std std);
	String deleteStudentById(Integer id);
}

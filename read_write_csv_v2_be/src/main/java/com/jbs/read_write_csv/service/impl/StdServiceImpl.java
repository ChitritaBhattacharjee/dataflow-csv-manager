package com.jbs.read_write_csv.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jbs.read_write_csv.entity.Std;
import com.jbs.read_write_csv.entity.StdCsvRepresentation;
import com.jbs.read_write_csv.repository.StdRepository;
import com.jbs.read_write_csv.service.StdService;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;

@Service
public class StdServiceImpl implements StdService {

	@Autowired
	private StdRepository stdRepository;

	@Override
	public Integer uploadStudents(MultipartFile file) throws IOException {
		Set<Std> stds = parseCsv(file);
		stdRepository.saveAll(stds);
		return stds.size();
	}

	private Set<Std> parseCsv(MultipartFile file) throws IOException {
		try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
			HeaderColumnNameMappingStrategy<StdCsvRepresentation> strategy = new HeaderColumnNameMappingStrategy<>();
			strategy.setType(StdCsvRepresentation.class);
			CsvToBean<StdCsvRepresentation> csvToBean = new CsvToBeanBuilder<StdCsvRepresentation>(reader)
					.withMappingStrategy(strategy).withIgnoreEmptyLine(true).withIgnoreLeadingWhiteSpace(true).build();
			return csvToBean.parse().stream().map(csvLine -> Std.builder().firstName(csvLine.getFname())
					.lastName(csvLine.getLname()).age(csvLine.getAge()).build()).collect(Collectors.toSet());
		}
	}

	@Override
	public List<Std> fetchAll() {
		return (List<Std>) stdRepository.findAll();
	}
	
	@Override
	public Std getStudentById(Integer id) {
		Optional<Std> optionalStd = stdRepository.findById(id);
		return (Std)optionalStd.orElse(new Std());
	}
	
	@Override
	public Std saveStudent(Std std) {
		return stdRepository.save(std);
	}

	@Override
	public String deleteStudentById(Integer id) {
		stdRepository.deleteById(id);
		return "Student record deleted successfully!";
	}

}

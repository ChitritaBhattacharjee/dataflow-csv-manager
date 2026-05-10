package com.jbs.read_write_csv.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jbs.read_write_csv.entity.Std;

@Repository
public interface StdRepository extends JpaRepository<Std, Integer>{

}

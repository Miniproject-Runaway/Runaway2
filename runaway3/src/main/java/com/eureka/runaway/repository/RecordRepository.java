package com.eureka.runaway.repository;

import com.eureka.runaway.entity.Record;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {

    // 특정 사용자 ID로 기록 조회
    List<Record> findByUserId(Long userId);
}
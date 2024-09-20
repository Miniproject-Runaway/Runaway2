package com.eureka.runaway.service;

import com.eureka.runaway.entity.Record;
import com.eureka.runaway.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecordService {

    @Autowired
    private RecordRepository recordRepository;

    public List<Record> findByUserId(Long userId) {
        return recordRepository.findByUserId(userId);
    }

    public Optional<Record> findRecordById(Long id) {
        return recordRepository.findById(id);
    }

    public Record saveRecord(Record record) {
        return recordRepository.save(record);
    }

    public void deleteRecord(Long id) {
        recordRepository.deleteById(id);
    }
}
package com.eureka.runaway.controller;

import com.eureka.runaway.entity.Record;
import com.eureka.runaway.entity.User;
import com.eureka.runaway.service.RecordService;
import com.eureka.runaway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/records")
public class RecordController {

    @Autowired
    private RecordService recordService;

    @Autowired
    private UserService userService;

    // 특정 사용자의 기록만 가져오기 (googleId로 필터링)
    @GetMapping
    public ResponseEntity<List<Record>> getRecordsByUser(@RequestParam("googleId") String googleId) {
        // googleId로 사용자를 찾음
        User user = userService.findByGoogleId(googleId);
        if (user == null) {
            return ResponseEntity.notFound().build();  // 사용자가 없으면 404 반환
        }
        // 해당 사용자의 기록을 가져옴
        List<Record> records = recordService.findByUserId(user.getId());
        if (records.isEmpty()) {
            return ResponseEntity.noContent().build();  // 기록이 없으면 204 반환
        }
        return ResponseEntity.ok(records);  // 기록 반환
    }

    // 특정 ID로 기록 가져오기
    @GetMapping("/{id}")
    public ResponseEntity<Record> getRecordById(@PathVariable("id") Long id) {
        Optional<Record> record = recordService.findRecordById(id);
        return record.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // 새 기록 생성
    @PostMapping
    public ResponseEntity<Record> createRecord(@RequestBody Record record) {
        // 사용자 정보가 없거나 Google ID가 없을 경우 예외 처리
        if (record.getUser() == null || record.getUser().getGoogleId() == null) {
            return ResponseEntity.badRequest().body(null);  // 사용자 정보가 없으면 400 Bad Request 반환
        }

        // Google 사용자 정보에서 email과 name도 함께 설정
        User googleUser = record.getUser();
        if (googleUser.getEmail() == null || googleUser.getName() == null) {
            return ResponseEntity.badRequest().body(null);  // 필수 정보가 없으면 400 Bad Request 반환
        }

        // Google ID로 사용자 조회 또는 생성
        User user = userService.findOrCreateUser(googleUser);

        // Record와 User 연결
        record.setUser(user);

        try {
            // 기록 저장
            Record savedRecord = recordService.saveRecord(record);
            return ResponseEntity.ok(savedRecord);  // 성공 시 저장된 기록 반환
        } catch (Exception e) {
            // 서버 내부 오류 처리
            e.printStackTrace();  // 서버 로그에 오류 출력
            return ResponseEntity.status(500).body(null);  // 500 Internal Server Error 반환
        }
    }

    // 기록 업데이트
    @PutMapping("/{id}")
    public ResponseEntity<Record> updateRecord(@PathVariable("id") Long id, @RequestBody Record updatedRecord) {
        return recordService.findRecordById(id)
                .map(record -> {
                    record.setRunningDate(updatedRecord.getRunningDate());
                    record.setSpot(updatedRecord.getSpot());
                    record.setContent(updatedRecord.getContent());

                    // user 정보가 없으면 기존 user 정보 유지
                    if (updatedRecord.getUser() != null && updatedRecord.getUser().getGoogleId() != null) {
                        User user = userService.findOrCreateUser(updatedRecord.getUser());
                        record.setUser(user);
                    }

                    return ResponseEntity.ok(recordService.saveRecord(record));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 기록 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable("id") Long id) {
        if (recordService.findRecordById(id).isPresent()) {
            recordService.deleteRecord(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
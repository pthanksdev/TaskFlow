package com.taskflow.backend.repository;

import com.taskflow.backend.model.Task;
import com.taskflow.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(Task.Status status);
    List<Task> findByCategory(String category);
    List<Task> findByUser(User user);
}

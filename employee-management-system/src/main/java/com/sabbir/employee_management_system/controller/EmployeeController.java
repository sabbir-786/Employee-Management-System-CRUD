package com.sabbir.employee_management_system.controller;

import com.sabbir.employee_management_system.entity.Employee;
import com.sabbir.employee_management_system.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees") // Base URL for all methods in this class
public class EmployeeController {

    private final EmployeeService service;

    // Constructor Injection
    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // ==========================================
    // 1. Create/Register Employee (POST)
    // ==========================================
    // URL: http://localhost:8080/api/employees/register
    // @Valid: Triggers the checks we added in Entity (e.g., @Email, @Size)
    // @RequestBody: Converts the JSON sent by Postman into a Java Object
    @PostMapping("/register")
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) {
        Employee savedEmployee = service.saveEmployee(employee);

        // Return 201 CREATED status code (Standard for creating resources)
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    // ==========================================
    // 2. Get All Employees (GET)
    // ==========================================
    // URL: http://localhost:8080/api/employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = service.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    // ==========================================
    // 3. Get Single Employee by ID (GET)
    // ==========================================
    // URL: http://localhost:8080/api/employees/1
    // @PathVariable: Extracts the "1" from the URL and puts it into the 'id' variable
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = service.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    // ==========================================
    // 4. Update Employee (PUT) - NEW
    // ==========================================
    // URL: http://localhost:8080/api/employees/1
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employee) {
        Employee updated = service.updateEmployee(id, employee);
        return ResponseEntity.ok(updated);
    }

    // ==========================================
    // 5. Delete Employee (DELETE) - NEW
    // ==========================================
    // URL: http://localhost:8080/api/employees/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        service.deleteEmployee(id);
        // Return 204 No Content (Standard for successful deletion)
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // 6. Batch Delete (Switched to POST for Reliability)
    // ==========================================
    // URL: http://localhost:8080/api/employees/batch/delete
    @PostMapping("/batch/delete") // <--- Changed from @DeleteMapping to @PostMapping
    public ResponseEntity<Void> deleteMultipleEmployees(@RequestBody List<Long> ids) {
        service.deleteMultipleEmployees(ids);
        return ResponseEntity.noContent().build();
    }


}
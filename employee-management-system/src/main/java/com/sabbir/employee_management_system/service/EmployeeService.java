package com.sabbir.employee_management_system.service;

import com.sabbir.employee_management_system.entity.Employee;
import com.sabbir.employee_management_system.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder;

    // Constructor Injection
    public EmployeeService(EmployeeRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // 1. Create / Register (Save)
    // ==========================================
    public Employee saveEmployee(Employee employee) {
        // Hash the password before saving
        String plainPassword = employee.getPassword();
        String hashedPassword = passwordEncoder.encode(plainPassword);
        employee.setPassword(hashedPassword);

        return repository.save(employee);
    }

    // ==========================================
    // 2. Get All Employees
    // ==========================================
    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    // ==========================================
    // 3. Get Single Employee by ID
    // ==========================================
    public Employee getEmployeeById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    // ==========================================
    // 4. Update Employee
    // ==========================================
    public Employee updateEmployee(Long id, Employee updatedDetails) {
        // Step 1: Find the existing employee
        Employee existingEmployee = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Step 2: Update fields
        existingEmployee.setFirstName(updatedDetails.getFirstName());
        existingEmployee.setLastName(updatedDetails.getLastName());
        existingEmployee.setEmail(updatedDetails.getEmail());
        existingEmployee.setRole(updatedDetails.getRole());

        // Note: We skip password here. Password updates should usually be a separate feature
        // to prevent accidental overwrites during profile edits.

        // Step 3: Save the updated entity
        return repository.save(existingEmployee);
    }

    // ==========================================
    // 5. Delete Single Employee
    // ==========================================
    public void deleteEmployee(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        repository.deleteById(id);
    }

    // ==========================================
    // 6. Delete Multiple Employees (Batch)
    // ==========================================
    public void deleteMultipleEmployees(List<Long> ids) {
        // Deletes all employees with the IDs provided in the list
        // This is efficient and transactional
        repository.deleteAllById(ids);
    }
}
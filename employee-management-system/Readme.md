# **Employee Management System**.

---

### **1. Architecture Overview**

Before coding, visualize the flow. This structure ensures "Separation of Concerns."

* **Client (Postman/Browser):** Sends HTTP Requests.
* **Controller Layer:** Validates input and handles the HTTP request.
* **Service Layer:** Contains business logic (e.g., hashing passwords).
* **Repository Layer:** Talks to the MySQL database.
* **Database:** Stores the data.

---


###  **2. Project Directory Tree**

```text
employee-management-system
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── ems  <-- Base Package
│   │   │               ├── EmployeeManagementSystemApplication.java  (Main Class)
│   │   │               ├── config
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller
│   │   │               │   └── EmployeeController.java
│   │   │               ├── entity
│   │   │               │   └── Employee.java
│   │   │               ├── exception
│   │   │               │   └── GlobalExceptionHandler.java
│   │   │               ├── repository
│   │   │               │   └── EmployeeRepository.java
│   │   │               └── service
│   │   │                   └── EmployeeService.java
│   │   ├── resources
│   │   │   ├── application.properties  (Database & Config)
│   │   │   ├── static                  (Empty for now - for JS/CSS)
│   │   │   └── templates               (Empty for now - for HTML)
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── ems
│                       └── EmployeeManagementSystemApplicationTests.java
├── pom.xml      (Maven Dependencies)
└── mvnw         (Maven Wrapper)

```

---

### **Package Breakdown**

1. **`com.example.ems`**: This is your **Root Package**. The main application class (`EmployeeManagementSystemApplication.java`) must stay here so it can automatically scan all sub-packages (components, configs, etc.).
2. **`.config`**: Holds configuration classes like Security or Swagger/OpenAPI setups.
3. **`.controller`**: The entry point for HTTP requests. It talks to the Service layer.
4. **`.entity`**: The data model (POJOs) that maps directly to Database tables.
5. **`.exception`**: Centralized error handling logic.
6. **`.repository`**: Interfaces that extend `JpaRepository` for direct database access.
7. **`.service`**: The business logic layer (validation, calculations, password hashing) that sits between the Controller and Repository.


---

### **Phase 1: Project Initialization (The Foundation)**

We will use **Spring Initializr** to generate the project skeleton. This is what professionals use to start new projects.

1. Go to **[start.spring.io](https://start.spring.io/)**
2. **Project:** Select **Maven**.
3. **Language:** Select **Java**.
4. **Spring Boot:** Select the latest stable version (e.g., **3.4.x**).
5. **Project Metadata:**
* **Group:** `com.sabbir` (or `com.sabbir`)
* **Artifact:** `employee-management-system`
* **Name:** `EmployeeManagementSystem`
* **Package name:** `com.sabbir.employee-management-system`
* **Packaging:** Jar
* **Java:** **17**


6. **Dependencies (Add these 6):**
* **Spring Web** (For REST APIs)
* **Spring Data JPA** (For Database interaction)
* **MySQL Driver** (To connect to MySQL)
* **Spring Security** (For password hashing & login)
* **Validation** (For checking inputs like `@Email`)
* **Spring Boot DevTools** (For auto-restart when you change code)
* *(Optional but recommended)* **Lombok** (To avoid writing Getters/Setters manually)


7. Click **GENERATE**. It will download a `.zip` file.
8. **Unzip** the file.

---

### **Phase 2: Import into IDE**

1. Open your IDE (IntelliJ IDEA or Eclipse/STS).
2. Select **Open** or **Import Project**.
3. Navigate to the unzipped folder and select the `pom.xml` file.
4. Select **Open as Project**.
5. **Wait** for Maven to download all the libraries (internet required).

---

### **Phase 3: Database Setup**

Before the code can run, it needs a database to talk to.

1. Open your MySQL Workbench (or Command Line).
2. Run this SQL command:
```sql
CREATE DATABASE employee_db;

```


3. That's it. Spring Boot will create the tables for you automatically later.

---

### **Phase 4: Configuration**

Tell Spring Boot how to find your database.

1. Open `src/main/resources/application.properties`.
2. Paste this configuration (Update the password to your real MySQL password):

```properties
spring.application.name=EmployeeManagementSystem

# Database Connection
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

```

---

### **Phase 5: The Coding (Layer by Layer)**

We build from the "bottom up" (Database -> API).

#### **Step 5.1: Create the Packages**

Right-click on `com.sabbir.employee_management_system` and create these 5 sub-packages:

* `entity`
* `repository`
* `service`
* `controller`
* `config`
* `exception`

#### **Step 5.2: Create the Entity (The Data)**

* **File:** `entity/Employee.java`
* **Action:** Copy the `Employee` class code I gave you earlier.
* **Why:** This maps your Java object to the MySQL table.


### File: `src/main/java/com/example/ems/entity/Employee.java`

```java
package com.sabbir.employee_management_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String role; // e.g., "USER", "ADMIN"

    // ==========================================
    // 1. Constructors
    // ==========================================

    // No-Args Constructor (Required by JPA/Hibernate)
    public Employee() {
    }

    // All-Args Constructor (Useful for creating objects manually)
    public Employee(Long id, String firstName, String lastName, String email, String password, String role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // ==========================================
    // 2. Getters and Setters
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // ==========================================
    // 3. toString() Method
    // ==========================================

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
        // Note: We intentionally exclude 'password' here for security reasons.
    }
}

```


#### **Step 5.3: Create the Repository (The SQL Interface)**

* **File:** `repository/EmployeeRepository.java`
* **Action:** Copy the `EmployeeRepository` interface code.
* **Why:** This gives you `save()`, `delete()`, and `find()` methods without writing SQL.

### File: `src/main/java/com/sabbir/employee_management_system/repository/EmployeeRepository.java`

```java
package com.sabbir.employee_management_system.repository;

import com.sabbir.employee_management_system.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Spring Data JPA automatically generates the SQL for this method
    // based on the method name "findByEmail".
    // We return Optional<Employee> to avoid NullPointerExceptions if the user isn't found.
    Optional<Employee> findByEmail(String email);

}

```

### **Why is this file so short?**

You might wonder why there is no code implementing this interface.

* **`extends JpaRepository`:** By extending this, Spring automatically gives you methods like `save()`, `findAll()`, `findById()`, and `deleteById()`.
* **`findByEmail`:** Spring looks at the name of this method, sees `findBy` and `Email` (which matches a field in your `Employee` class), and automatically writes the SQL query: `SELECT * FROM employees WHERE email = ?`.


#### **Step 5.4: Create the Security Config (The Guard)**

* **File:** `config/SecurityConfig.java`
* **Action:** Copy the `SecurityConfig` class code.
* **Why:** We need to define the `PasswordEncoder` bean *before* we write the Service layer, or the Service won't be able to hash passwords.

### File: `src/main/java/com/sabbir/employee_management_system/config/SecurityConfig.java`

```java
package com.sabbir.employee_management_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    // 1. Password Encoder Bean
    // This allows us to inject 'PasswordEncoder' in our Service layer
    // to turn "password123" into "$2a$10$..." (a secure hash).
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Security Filter Chain
    // This defines which URLs are public and which need login.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF because we are building a stateless REST API, not a browser-based MVC app
                .csrf(csrf -> csrf.disable())

                // Define URL permissions
                .authorizeHttpRequests(auth -> auth
                        // Allow anyone to register without logging in
                        .requestMatchers("/api/employees/register").permitAll()
                        // Allow GET requests (Viewing employees)
                        .requestMatchers("/api/employees/**").permitAll()
                        // All other requests require authentication (username/password)
                        .anyRequest().authenticated()
                )

                // Enable basic HTTP authentication (good for testing in Postman)
                .httpBasic(withDefaults());

        return http.build();
    }
}

```


#### **Step 5.5: Create the Service (The Logic)**

* **File:** `service/EmployeeService.java`
* **Action:** Copy the `EmployeeService` class code.
* **Why:** This is where we call the repository and hash the password.

Here is the **Service Layer**.

This is the "brain" of your application. It sits between the Controller (which receives the request) and the Repository (which talks to the database).

Its most important job here is to **hash the password** using the `passwordEncoder` we defined in the previous step before saving the user to the database.

### **File: `src/main/java/com/sabbir/employee_management_system/service/EmployeeService.java**`

**Action:** Create a new folder named `service` inside your base package, then create this file.

```java
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
```


#### **Step 5.6: Create the Controller (The API)**

* **File:** `controller/EmployeeController.java`
* **Action:** Copy the `EmployeeController` class code.
* **Why:** This opens the doors for Postman/Browsers to talk to your app.


```java

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
}
```
#### **Step 5.7: Create Exception Handler (The Safety Net)**

* **File:** `exception/GlobalExceptionHandler.java`
* **Action:** Copy the `GlobalExceptionHandler` code.
* **Why:** To ensure errors look clean.


```java

package com.sabbir.employee_management_system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==========================================
    // 1. Handle Validation Errors (e.g., Bad Email, Short Password)
    // ==========================================
    // Triggers when @Valid fails
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // ==========================================
    // 2. Handle Malformed JSON (NEW)
    // ==========================================
    // Triggers if you send { } instead of [ ] for Batch Delete
    // or if the JSON syntax is broken.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleJsonErrors(HttpMessageNotReadableException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Invalid JSON format. Please check your request body.");
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // ==========================================
    // 3. Handle "Employee Not Found" (Logic Errors)
    // ==========================================
    // Triggers when Service throws RuntimeException
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // ==========================================
    // 4. Handle Unexpected Errors (Catch-All)
    // ==========================================
    // Triggers for bugs we didn't plan for (e.g., NullPointerException)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "An unexpected error occurred: " + ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```
---

### **Phase 6: Run and Test**

1. Go to the main class: `EmployeeManagementSystemApplication.java`.
2. Right-click -> **Run**.
3. Look at the console log. If you see `Started EmployeeManagementSystemApplication in ... seconds`, it works!

**How to Test (Using Postman):**

Based on the `SecurityConfig.java` file you provided, here is the analysis:

### **Analysis of Your Config**

You have this line:
`.requestMatchers("/api/employees/**").permitAll()`

**What this means:**
The double asterisk (`/**`) is a wildcard that matches **everything** after `/api/employees/`.

* **Result:** **ALL** your endpoints (Create, Get, Update, Delete, Batch Delete) are now **PUBLIC**.
* **Impact on Testing:** You do **NOT** need to set up "Basic Auth" or login for *any* of these tests.
* You can just hit the buttons in Postman.

### **Postman Test Collection (Public Mode)**

Here are the API requests updated for your specific configuration (No Auth required).

#### **1. Register Employee (Create)**

* **Method:** `POST`
* **URL:** `http://localhost:8080/api/employees/register`
* **Auth:** None
* **Body (`raw` -> `JSON`):**
```json
{
    "firstName": "Sabbir",
    "lastName": "Ansari",
    "email": "sabbir@example.com",
    "password": "securePassword123",
    "role": "JAVA_DEV"
}

```


* **Status:** `201 Created`

#### **2. Get All Employees**

* **Method:** `GET`
* **URL:** `http://localhost:8080/api/employees`
* **Auth:** None (Because of your `/**` rule)
* **Body:** None
* **Status:** `200 OK`

#### **3. Get One Employee**

* **Method:** `GET`
* **URL:** `http://localhost:8080/api/employees/1`
* **Auth:** None
* **Body:** None
* **Status:** `200 OK`

#### **4. Update Employee**

* **Method:** `PUT`
* **URL:** `http://localhost:8080/api/employees/1`
* **Auth:** None
* **Body (`raw` -> `JSON`):**
```json
{
    "firstName": "Sabbir",
    "lastName": "Ansari",
    "email": "new.email@example.com",
    "password": "securePassword123",
    "role": "Lead_Dev"
}

```


* **Status:** `200 OK`

#### **5. Delete Single Employee**

* **Method:** `DELETE`
* **URL:** `http://localhost:8080/api/employees/1`
* **Auth:** None
* **Body:** None
* **Status:** `204 No Content`

#### **6. Batch Delete (Multiple)**

* **Method:** `DELETE`
* **URL:** `http://localhost:8080/api/employees/batch`
* **Auth:** None
* **Body (`raw` -> `JSON`):**
```json
[
    2,
    3,
    5
]

```


3. **Check Database:**
* Go to MySQL Workbench.
* Run `SELECT * FROM employees;`
* You will see your user, and the password will be a long messy string (Hashed), not "securePassword123".


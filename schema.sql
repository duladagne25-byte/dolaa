-- Create the database
CREATE DATABASE IF NOT EXISTS EthioEdu;
USE EthioEdu;

-- 1. users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. courses table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. enrollments table
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
) ENGINE=InnoDB;

-- ==========================================
-- Sample Data Insertion
-- ==========================================

INSERT INTO users (full_name, email, password, role) VALUES
('System Admin', 'admin@ethioedu.com', '$2y$10$dummyhashedpassword123', 'admin'),
('Abebe Bikila', 'abebe@example.com', '$2y$10$dummyhashedpassword456', 'student'),
('Tirunesh Dibaba', 'tirunesh@example.com', '$2y$10$dummyhashedpassword789', 'student');

INSERT INTO students (user_id, first_name, last_name, gender, date_of_birth, phone_number, address) VALUES
(2, 'Abebe', 'Bikila', 'Male', '2000-05-14', '+251911234567', 'Addis Ababa, Ethiopia'),
(3, 'Tirunesh', 'Dibaba', 'Female', '2001-08-22', '+251922345678', 'Addis Ababa, Ethiopia');

INSERT INTO courses (course_name, description) VALUES
('Introduction to Computer Science', 'Learn the basics of programming and computer science principles.'),
('Advanced Mathematics', 'Calculus, linear algebra, and discrete mathematics.'),
('Ethiopian History', 'A comprehensive overview of the history of Ethiopia.');

INSERT INTO enrollments (student_id, course_id, enrollment_date) VALUES
(1, 1, '2026-04-25'),
(1, 2, '2026-04-25'),
(2, 1, '2026-04-25'),
(2, 3, '2026-04-25');

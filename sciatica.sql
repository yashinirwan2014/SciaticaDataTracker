CREATE DATABASE IF NOT EXISTS sciatica_tracker;
USE sciatica_tracker;
CREATE TABLE IF NOT EXISTS daily_records (
 record_date DATE PRIMARY KEY,
 pain_level INT NOT NULL,
 study_hours DECIMAL(5,2) NOT NULL,
 walking_breaks INT NOT NULL,
 walking_minutes INT NOT NULL,
 notes VARCHAR(255)
);

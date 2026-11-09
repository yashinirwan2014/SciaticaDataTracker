# SciaticaDataTracker

A menu-driven personal tracking project built with **CBSE Class 12 Informatics Practices concepts**. It stores daily pain ratings, study hours and walking-break information in MySQL and displays simple summaries.

> **Educational use only:** This is a personal record-keeping tool, not a medical device. It does not diagnose sciatica, recommend treatment or establish the cause of pain.

## Features
- Add a daily entry: date, pain rating (0–10), study hours, number of walking breaks, total walking minutes and optional notes.
- View records, update a record by date, or delete a record.
- View average pain rating, average study hours and totals for walking breaks and minutes.

## CBSE Class 12 IP concepts
- Python variables, data types, input/output, conditionals, loops and functions.
- Python modules and exception handling.
- MySQL database/table creation and SQL commands: CREATE, INSERT, SELECT, UPDATE, DELETE, WHERE, ORDER BY and aggregate functions (AVG, SUM, COUNT).
- Python–MySQL connectivity with mysql.connector.

## Requirements
- Python 3.9+
- MySQL Server

## Setup
1. Start MySQL Server.
2. Run `sciatica.sql` in MySQL Workbench or a MySQL client. It creates the `sciatica_tracker` database and `daily_records` table.
3. Install the connector: `python -m pip install -r requirements.txt`
4. Edit `db_config.py` and enter your local MySQL username and password.
5. Run: `python main.py`

## Files
- `main.py` — menu and input validation
- `database.py` — SQL operations
- `analysis.py` — descriptive summaries
- `db_config.py` — local MySQL settings
- `sciatica.sql` — database schema
- `requirements.txt` — Python dependency

## Data privacy and limitations
Keep real personal health records and database credentials off GitHub. The summaries describe only the entries provided; they cannot show that study time or walking breaks cause changes in pain. Missing entries can affect averages.

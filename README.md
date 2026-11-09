# SciaticaDataTracker

A small, menu-driven daily log built with **Python, MySQL and CBSE Class 12 Informatics Practices concepts**. It brings pain ratings, study hours and walking-break details together in one structured record, with simple summaries that make it easier to review the information over time.

**Project website:** Enable GitHub Pages for this repository to publish the site in `index.html`.

> **Educational use only:** This is a personal record-keeping tool, not a medical device. It does not diagnose sciatica, recommend treatment or establish the cause of pain.

## What it records
- Date and a pain rating from 0–10.
- Study hours.
- Number of walking breaks and total walking minutes.
- Optional notes for each day.

## What you can do
- Add a daily entry.
- View saved records.
- Update or delete a record by date.
- View basic summaries: number of recorded days, average pain rating, average study hours, and total walking breaks/minutes.

## Built with CBSE Class 12 IP concepts
- Python variables, data types, input/output, conditionals, loops and functions.
- Python modules and exception handling.
- MySQL table creation and SQL commands: CREATE, INSERT, SELECT, UPDATE, DELETE, WHERE, ORDER BY and aggregate functions (AVG, SUM, COUNT).
- Python–MySQL connectivity with `mysql.connector`.

## Requirements
- Python 3.9+
- MySQL Server

## Setup
1. Start MySQL Server.
2. Run `sciatica.sql` in MySQL Workbench or a MySQL client. It creates the `sciatica_tracker` database and `daily_records` table.
3. Install the connector: `python -m pip install -r requirements.txt`
4. Edit `db_config.py` and enter your local MySQL username and password. You can also set the `SCIATEK_DB_PASSWORD` environment variable.
5. Run `python main.py`.

## Project files
- `main.py` — menu and input validation
- `database.py` — SQL operations
- `analysis.py` — descriptive summaries
- `db_config.py` — local MySQL settings
- `sciatica.sql` — database schema
- `tests/` — unit and MySQL integration tests
- `index.html` — project website

## Data privacy and limitations
Keep real personal health records and database credentials off GitHub. The summaries describe only the entries provided; they cannot show that study time or walking breaks cause changes in pain. Missing entries can affect averages.

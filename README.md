# Sciatica Data Tracker

A small Python and MySQL application for recording a few details each day: pain rating, study time and walking breaks. It is an application of CBSE Class 12 Informatics Practices concepts, using a simple Python text menu and SQL statements rather than a web framework.

The repository also includes a browser-based version for people who want to use the tracker without installing Python or MySQL. The browser version stores its entries locally on the device.

## What it does

- Saves one entry per date.
- Records a pain rating from 0 to 10, study hours, walking-break count and total walking minutes.
- Allows entries to be viewed, updated or deleted.
- Shows totals and averages based on the saved entries.
- The website includes a recent-entry view, monthly reports, date filters, sorting, printable summaries, search, CSV export and CSV import.
- The website also includes educational sciatica information, original simplified illustrations, a non-diagnostic symptom-observation checklist and urgent warning signs that explain when to seek medical help.

## Two ways to use the tracker

### 1. Browser version

Open the [Sciatica Data Tracker website](https://yashinirwan2014.github.io/SciaticaDataTracker/). You can add, edit, delete and search daily entries, view summaries, and export or import a CSV backup.

**Privacy and storage:** the website saves data in the browser's local storage on the current device. It does not send entries to a server and does not require an account. Data is not automatically shared or synchronised between devices. Clearing browser data can remove saved entries, so export a CSV backup regularly. CSV backups are not encrypted; keep them somewhere private.

### 2. Python and MySQL version

The Python program starts with a numbered menu:

```text
=== SCIATICA DATA TRACKER ===
1. Add daily record
2. View records
3. Update record
4. Delete record
5. View summary
0. Exit
```

Each date can have one record because `record_date` is the table's primary key. This version stores records in a MySQL database and is separate from the browser version; the two versions do not automatically exchange data.

## Technologies and syllabus concepts

**Python**
- Variables and data types
- Input and output
- `if` statements and loops
- Functions and modules
- Basic exception handling

**MySQL**
- Creating a database and table
- `INSERT`, `SELECT`, `UPDATE` and `DELETE`
- `WHERE` and `ORDER BY`
- `COUNT()`, `AVG()` and `SUM()`

**Connectivity:** `mysql.connector` connects the Python program to MySQL.

The website uses basic HTML, CSS and JavaScript for its browser interface, local storage, filters, reports and printable view. The health information is general education with links to NHS and Mayo Clinic sources; it is not personal medical advice. These are web technologies used for the interface; the Python–MySQL program remains the part demonstrating Python–MySQL connectivity.

## Run the Python version locally

You need Python 3.9 or later and a running MySQL Server.

1. Clone or download this repository.
2. Open the application folder in a terminal.
3. Run `sciatica.sql` in MySQL Workbench or another MySQL client.
4. Install the required package:

   ```bash
   python -m pip install -r requirements.txt
   ```

5. Set your MySQL details in `db_config.py`. The password can instead be supplied through the `SCIATEK_DB_PASSWORD` environment variable.
6. Start the program:

   ```bash
   python main.py
   ```

## Run the tests

The unit tests use mocked database connections, so they do not need a local MySQL server:

```bash
python -m unittest discover -s tests -v
```

The MySQL integration test runs when a test database is configured. GitHub Actions starts a temporary MySQL service for that test when changes are pushed or a pull request is opened.

## Application files

| File | Purpose |
| --- | --- |
| `main.py` | Menu, input checks and record display |
| `database.py` | MySQL connection and SQL operations |
| `analysis.py` | Prints the summary returned by MySQL |
| `db_config.py` | Local database settings |
| `sciatica.sql` | Creates the database and table |
| `tests/` | Unit and MySQL integration tests |
| `index.html` | Browser-based tracker and website |

## Things to keep in mind

- This is a learning application and a personal record-keeping tool, not a medical device. Its symptom checklist is educational only: it cannot diagnose or rule out sciatica. The website advises prompt medical assessment for new or worsening symptoms and emergency care for warning signs.
- The averages and totals only describe the records entered. They do not prove that study time or walking breaks cause changes in pain.
- One entry per date is supported. Multiple sessions on the same date are not modelled.
- The Python version expects MySQL to be installed and running locally.
- Do not commit real personal health entries, passwords or other private information to this public repository.
- The browser version keeps data on the current device only. Export a CSV backup before clearing browser data or changing devices.

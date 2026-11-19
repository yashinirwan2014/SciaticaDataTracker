# Sciatica Data Tracker

Sciatica Data Tracker is a small record keeping project made with Python and MySQL. It lets a user save daily notes about pain ratings, study time and walking activity.

The repository also has a browser version. It can be opened without installing Python or MySQL, and it saves entries in the browser on the current device.

This is a learning project based on Python and SQL concepts from CBSE Class 12 Informatics Practices. It is not a medical device and it does not diagnose or treat any condition.

## Features

* Save one daily entry for each date.
* Record a pain rating from 0 to 10, study hours, walking breaks and walking minutes.
* View, update and delete saved entries.
* Check totals and averages from the available records.
* Search, sort and filter entries in the browser version.
* View monthly reports and printable summaries.
* Import and export CSV backups.
* In the student view, plan subject and topic study sessions.
* Record multiple exercises in a day when they have been advised by a healthcare professional.
* Read general educational information about sciatica and warning signs that may need medical attention.

The tracker does not prescribe exercises. Exercise details are entered by the user based on advice they have received from a qualified healthcare professional.

## Student and adult views

The browser version has two views.

The student view includes study planning along with daily activity records. The adult view focuses on daily wellbeing, symptoms and activity. Study related sections are hidden in the adult view.

Changing the selected view does not create another account or delete saved entries. Both views use the same browser data.

The project does not provide medication schedules, dose reminders or medication advice. Questions about medicines and side effects should be discussed with a doctor or pharmacist.

## Use the browser version

Open the [Sciatica Data Tracker website](https://yashinirwan2014.github.io/SciaticaDataTracker/).

Entries are saved in local storage in the current browser. They are not sent to a server and are not automatically shared between devices. Clearing browser data can remove saved entries, so export a CSV backup regularly.

CSV backups are not encrypted. Keep them somewhere private and do not include personal health information in public copies of this repository.

## Run the Python and MySQL version

You need Python 3.9 or newer and a running MySQL Server.

1. Download or clone this repository.
2. Open the project folder in a terminal.
3. Run `sciatica.sql` using MySQL Workbench or another MySQL client.
4. Install the required package:

```bash
python -m pip install -r requirements.txt
```

5. Set the database details in `db_config.py`. You can provide the MySQL password through the `SCIATEK_DB_PASSWORD` environment variable.
6. Start the program:

```bash
python main.py
```

The Python program opens a numbered menu:

```text
=== SCIATICA DATA TRACKER ===
1. Add daily record
2. View records
3. Update record
4. Delete record
5. View summary
0. Exit
```

The date is the primary key in the MySQL table, so this version stores one record per date. The browser version and Python version keep their data separately and do not automatically exchange records.

## Run the tests

The unit tests use mocked database connections, so they do not need a local MySQL server.

```bash
python -m unittest discover -s tests -v
```

The MySQL integration test runs when a test database is configured. GitHub Actions starts a temporary MySQL service for that test when changes are pushed or a pull request is opened.

## Technologies and Class 12 IP concepts

**Python**

* Variables and data types
* Input and output
* Conditional statements and loops
* Functions and modules
* Exception handling

**MySQL**

* Creating databases and tables
* Adding, viewing, updating and deleting records
* Filtering and sorting records
* Aggregate functions such as `COUNT()`, `AVG()` and `SUM()`

The Python program uses `mysql.connector` to connect to MySQL.

The browser version uses HTML, CSS and JavaScript for its interface, local storage, filters, reports and CSV tools. These web files are separate from the Python and MySQL program.

## Main project files

| File | Purpose |
| --- | --- |
| `main.py` | Menu, input checks and record display |
| `database.py` | MySQL connection and SQL operations |
| `analysis.py` | Displays the summary returned by MySQL |
| `db_config.py` | Database settings |
| `sciatica.sql` | Creates the database and table |
| `tests/` | Unit tests and MySQL integration tests |
| `index.html` | Browser version of the tracker |
| `style.css` | Website appearance |
| `script.js` | Browser features and record handling |

## Important information

* This is a learning project and a personal record keeping tool. It cannot diagnose or rule out sciatica.
* The educational information on the website is not personal medical advice. Seek advice from a qualified healthcare professional about symptoms or treatment.
* The totals and averages describe only the entries that have been saved. They do not show that study time or walking activity causes a change in pain.
* The Python and MySQL version stores one record per date. The browser version can also store multiple study sessions and exercise records within a daily entry.
* The Python version needs MySQL to be installed and running.
* Do not commit real health entries, passwords or other private information to this public repository.
* Export a CSV backup before clearing browser data or moving to another device.

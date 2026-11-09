# Edit these settings for your local MySQL installation.
import os

DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = os.environ.get("SCIATEK_DB_PASSWORD", "YOUR_MYSQL_PASSWORD")
DB_NAME = "sciatica_tracker"

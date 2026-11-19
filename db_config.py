import os

# Set SCIATEK_DB_PASSWORD in the environment if your MySQL user has a password.
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = os.environ.get("SCIATEK_DB_PASSWORD", "")
DB_NAME = "sciatica_tracker"

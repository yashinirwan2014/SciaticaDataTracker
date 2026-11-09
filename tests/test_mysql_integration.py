import unittest
from datetime import date
from database import (add_record, get_records, update_record,
                      delete_record, get_summary)


class MySQLIntegrationTests(unittest.TestCase):
    """Exercise real SQL against the MySQL service configured in CI."""

    @classmethod
    def setUpClass(cls):
        # The GitHub Actions workflow sets this variable and starts MySQL.
        import os
        if not os.environ.get("SCIATEK_DB_PASSWORD"):
            raise unittest.SkipTest("No MySQL integration database configured.")

    def test_full_record_lifecycle(self):
        record_date = date(2099, 12, 30)
        delete_record(record_date)
        add_record((record_date, 4, 5.5, 2, 20, "integration test"))

        rows = get_records()
        matching = [row for row in rows if row[0] == record_date]
        self.assertEqual(len(matching), 1)
        self.assertEqual(matching[0][1], 4)

        changed = update_record((6, 4.0, 3, 25, "updated", record_date))
        self.assertEqual(changed, 1)

        updated_rows = [row for row in get_records() if row[0] == record_date]
        self.assertEqual(updated_rows[0][1], 6)
        self.assertEqual(float(updated_rows[0][2]), 4.0)

        summary = get_summary()
        self.assertGreaterEqual(summary[0], 1)

        self.assertEqual(delete_record(record_date), 1)
        remaining = [row for row in get_records() if row[0] == record_date]
        self.assertEqual(remaining, [])


if __name__ == "__main__":
    unittest.main()

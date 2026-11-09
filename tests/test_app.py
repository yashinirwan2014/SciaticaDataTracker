import contextlib
import io
import unittest
from datetime import date
from unittest.mock import patch

import analysis
import database
import main


class FakeCursor:
    def __init__(self, rows=None, one=None, rowcount=1):
        self.rows = rows or []
        self.one = one
        self.rowcount = rowcount
        self.query = None
        self.params = None
        self.closed = False

    def execute(self, query, params=None):
        self.query = query
        self.params = params

    def fetchall(self):
        return self.rows

    def fetchone(self):
        return self.one

    def close(self):
        self.closed = True


class FakeConnection:
    def __init__(self, cursor):
        self.fake_cursor = cursor
        self.committed = False
        self.closed = False

    def cursor(self):
        return self.fake_cursor

    def commit(self):
        self.committed = True

    def close(self):
        self.closed = True


class InputValidationTests(unittest.TestCase):
    def test_read_date_retries_invalid_value(self):
        with patch("builtins.input", side_effect=["10/11/2026", "2026-11-10"]):
            self.assertEqual(main.read_date(), date(2026, 11, 10))

    def test_read_int_retries_out_of_range_and_text(self):
        with patch("builtins.input", side_effect=["abc", "-1", "8"]):
            self.assertEqual(main.read_int("Pain: ", 0, 10), 8)

    def test_read_hours_accepts_decimal(self):
        with patch("builtins.input", side_effect=["25", "3.5"]):
            self.assertEqual(main.read_hours(), 3.5)

    def test_collect_values_returns_expected_fields(self):
        answers = ["6", "4.5", "3", "25", "Study break log"]
        with patch("builtins.input", side_effect=answers):
            self.assertEqual(main.collect_values(), (6, 4.5, 3, 25, "Study break log"))


class DatabaseTests(unittest.TestCase):
    def run_database_method(self, method, cursor, *args, expect_commit=True):
        connection = FakeConnection(cursor)
        with patch.object(database, "connect_database", return_value=connection):
            result = method(*args)
        self.assertEqual(connection.committed, expect_commit)
        self.assertTrue(connection.closed)
        self.assertTrue(cursor.closed)
        return result, cursor

    def test_add_record_uses_parameterized_insert(self):
        cursor = FakeCursor()
        values = (date(2026, 11, 10), 4, 5.5, 2, 20, "note")
        _, used = self.run_database_method(database.add_record, cursor, values)
        self.assertIn("INSERT INTO daily_records", used.query)
        self.assertEqual(used.params, values)

    def test_get_records_returns_rows(self):
        rows = [(date(2026, 11, 10), 3, 4.0, 2, 15, "")]
        cursor = FakeCursor(rows=rows)
        result, used = self.run_database_method(database.get_records, cursor, expect_commit=False)
        self.assertEqual(result, rows)
        self.assertIn("ORDER BY record_date DESC", used.query)

    def test_update_record_returns_affected_count(self):
        cursor = FakeCursor(rowcount=1)
        values = (5, 4.0, 2, 15, "updated", date(2026, 11, 10))
        result, used = self.run_database_method(database.update_record, cursor, values)
        self.assertEqual(result, 1)
        self.assertEqual(used.params, values)

    def test_delete_record_returns_affected_count(self):
        cursor = FakeCursor(rowcount=1)
        result, used = self.run_database_method(
            database.delete_record, cursor, date(2026, 11, 10))
        self.assertEqual(result, 1)
        self.assertEqual(used.params, (date(2026, 11, 10),))

    def test_summary_returns_aggregate_values(self):
        summary = (2, 3.5, 4.25, 6, 50)
        cursor = FakeCursor(one=summary)
        result, used = self.run_database_method(database.get_summary, cursor, expect_commit=False)
        self.assertEqual(result, summary)
        self.assertIn("AVG(pain_level)", used.query)


class DisplayTests(unittest.TestCase):
    def test_empty_summary_is_handled(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            analysis.show_summary((0, None, None, None, None))
        self.assertIn("No records available yet.", output.getvalue())

    def test_nonempty_summary_displays_averages(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            analysis.show_summary((2, 3.5, 4.25, 6, 50))
        self.assertIn("3.50/10", output.getvalue())
        self.assertIn("4.25", output.getvalue())

    def test_display_records_handles_rows(self):
        output = io.StringIO()
        rows = [(date(2026, 11, 10), 3, 4.0, 2, 15, "okay")]
        with contextlib.redirect_stdout(output):
            main.display_records(rows)
        self.assertIn("okay", output.getvalue())


if __name__ == "__main__":
    unittest.main()

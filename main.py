from datetime import datetime
from mysql.connector import Error
from database import (add_record, get_records, update_record,
                      delete_record, get_summary)
from analysis import show_summary


def read_date(prompt="Date (YYYY-MM-DD): "):
    while True:
        try:
            return datetime.strptime(input(prompt).strip(), "%Y-%m-%d").date()
        except ValueError:
            print("Use the format YYYY-MM-DD.")


def read_int(prompt, minimum=0, maximum=None):
    while True:
        try:
            value = int(input(prompt))
            if value < minimum or (maximum is not None and value > maximum):
                print("Enter a valid value.")
            else:
                return value
        except ValueError:
            print("Enter a whole number.")


def read_hours():
    while True:
        try:
            value = float(input("Study hours (0-24): "))
            if 0 <= value <= 24:
                return value
            print("Enter a value from 0 to 24.")
        except ValueError:
            print("Enter a number, such as 3.5.")


def collect_values():
    pain = read_int("Pain rating (0-10): ", 0, 10)
    hours = read_hours()
    breaks = read_int("Number of walking breaks: ")
    minutes = read_int("Total walking minutes: ")
    notes = input("Optional notes: ").strip()
    return pain, hours, breaks, minutes, notes


def display_records(rows):
    if not rows:
        print("No records found.")
        return
    print("\nDATE         PAIN  STUDY HRS  BREAKS  WALK MINS  NOTES")
    for row in rows:
        print("{!s:12} {:<5} {:<10} {:<7} {:<10} {}".format(
            row[0], row[1], row[2], row[3], row[4], row[5] or ""))


def main():
    while True:
        print("\n=== SCIATICA DATA TRACKER ===")
        print("1. Add daily record")
        print("2. View records")
        print("3. Update record")
        print("4. Delete record")
        print("5. View summary")
        print("0. Exit")
        choice = input("Choose: ").strip()
        try:
            if choice == "1":
                day = read_date()
                add_record((day,) + collect_values())
                print("Record saved.")
            elif choice == "2":
                display_records(get_records())
            elif choice == "3":
                day = read_date("Date of record to update (YYYY-MM-DD): ")
                values = collect_values()
                if update_record(values + (day,)):
                    print("Record updated.")
                else:
                    print("No record found for that date.")
            elif choice == "4":
                day = read_date()
                if input("Delete this record? (y/n): ").lower() == "y":
                    print("Record deleted." if delete_record(day)
                          else "No record found.")
            elif choice == "5":
                show_summary(get_summary())
            elif choice == "0":
                print("Goodbye.")
                break
            else:
                print("Choose one of the listed options.")
        except Error as error:
            print("MySQL error:", error)
            print("Check MySQL is running and db_config.py is correct.")
        except Exception as error:
            print("Something went wrong:", error)


if __name__ == "__main__":
    main()

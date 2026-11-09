import mysql.connector
from db_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME


def connect_database():
    return mysql.connector.connect(
        host=DB_HOST, user=DB_USER,
        password=DB_PASSWORD, database=DB_NAME
    )


def add_record(data):
    connection = connect_database()
    cursor = connection.cursor()
    query = """INSERT INTO daily_records
    (record_date, pain_level, study_hours, walking_breaks, walking_minutes, notes)
    VALUES (%s, %s, %s, %s, %s, %s)"""
    cursor.execute(query, data)
    connection.commit()
    cursor.close()
    connection.close()


def get_records():
    connection = connect_database()
    cursor = connection.cursor()
    cursor.execute("""SELECT record_date, pain_level, study_hours,
    walking_breaks, walking_minutes, notes
    FROM daily_records ORDER BY record_date DESC""")
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return rows


def update_record(data):
    connection = connect_database()
    cursor = connection.cursor()
    cursor.execute("""UPDATE daily_records SET pain_level=%s, study_hours=%s,
    walking_breaks=%s, walking_minutes=%s, notes=%s
    WHERE record_date=%s""", data)
    connection.commit()
    count = cursor.rowcount
    cursor.close()
    connection.close()
    return count


def delete_record(record_date):
    connection = connect_database()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM daily_records WHERE record_date=%s",
                   (record_date,))
    connection.commit()
    count = cursor.rowcount
    cursor.close()
    connection.close()
    return count


def get_summary():
    connection = connect_database()
    cursor = connection.cursor()
    cursor.execute("""SELECT COUNT(*), AVG(pain_level), AVG(study_hours),
    SUM(walking_breaks), SUM(walking_minutes) FROM daily_records""")
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result

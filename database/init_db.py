import mysql.connector
import os
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
)


def create_db():
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            port=int(os.getenv("MYSQL_PORT", 10487)),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE"),
        )
        cursor = conn.cursor()

        # 1. Create table if not exists (without AUTO_INCREMENT)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS locations (
            id INT NOT NULL PRIMARY KEY,
            ip_address VARCHAR(100),
            city VARCHAR(100),
            country VARCHAR(100),
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()

        # 2. Remove AUTO_INCREMENT from existing table while keeping Primary Key
        cursor.execute("ALTER TABLE locations MODIFY id INT NOT NULL")
        conn.commit()

        # 3. Re-arrange existing IDs sequentially starting from 1
        cursor.execute("SELECT COUNT(*), COALESCE(MAX(id), 0) FROM locations")
        total_rows, max_id = cursor.fetchone()

        if total_rows > 0:
            # Offset IDs first to avoid Primary Key collision during re-numbering
            cursor.execute("SET @temp_id = %s", (max_id,))
            cursor.execute("""
                UPDATE locations 
                SET id = (@temp_id := @temp_id + 1) 
                ORDER BY timestamp ASC, id ASC
            """)

            # Assign sequential IDs starting from 1
            cursor.execute("SET @new_id = 0")
            cursor.execute("""
                UPDATE locations 
                SET id = (@new_id := @new_id + 1) 
                ORDER BY id ASC
            """)
            conn.commit()
            print(
                f"Aiven MySQL Database ready. Re-arranged {total_rows} record(s) starting from ID 1."
            )
        else:
            print("Aiven MySQL Database table ready (currently 0 records).")

    except Exception as e:
        print("Database init error:", e)
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


if __name__ == "__main__":
    create_db()

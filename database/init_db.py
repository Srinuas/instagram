import mysql.connector
import os
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

def create_and_fix_db():
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            port=int(os.getenv('MYSQL_PORT', 10487)),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE')
        )
        cursor = conn.cursor()

        # 1. Create table if it doesn't exist yet (without AUTO_INCREMENT)
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS locations (
            id INT NOT NULL PRIMARY KEY,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        conn.commit()

        # 2. Remove AUTO_INCREMENT from existing table (keeps PRIMARY KEY intact for Aiven)
        cursor.execute('ALTER TABLE locations MODIFY id INT NOT NULL')
        conn.commit()
        print("Removed AUTO_INCREMENT from 'id' column.")

        # 3. Re-number existing rows starting from 1 (in chronological order)
        cursor.execute('SELECT COUNT(*), COALESCE(MAX(id), 0) FROM locations')
        total_rows, max_id = cursor.fetchone()

        if total_rows > 0:
            # First shift IDs above current max_id to avoid Primary Key collisions during update
            cursor.execute('SET @temp_id = %s', (max_id,))
            cursor.execute('''
                UPDATE locations 
                SET id = (@temp_id := @temp_id + 1) 
                ORDER BY timestamp ASC, id ASC
            ''')

            # Now assign clean 1, 2, 3... IDs
            cursor.execute('SET @new_id = 0')
            cursor.execute('''
                UPDATE locations 
                SET id = (@new_id := @new_id + 1) 
                ORDER BY id ASC
            ''')
            conn.commit()
            print(f"Successfully re-numbered {total_rows} existing record(s) from 1 to {total_rows}.")
        else:
            print("Table is currently empty. Ready for new records starting at ID 1.")

        print("Aiven MySQL Database setup complete.")

    except Exception as e:
        print("Database error:", e)
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

if __name__ == '__main__':
    create_and_fix_db()

from flask import Flask, request, jsonify, send_from_directory, session, redirect
from dotenv import load_dotenv
import mysql.connector
import urllib.request
import urllib.parse
import json
import os
import hmac

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

app = Flask(__name__, static_folder=None)
app.secret_key = os.getenv('SECRET_KEY', 'default_secret')
ADMIN_PIN = str(os.getenv('ADMIN_PIN', '6369')).strip()

def get_db():
    return mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        port=int(os.getenv('MYSQL_PORT', 10487)),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE')
    )

def resequence_ids(conn, cursor):
    """Ensures IDs are always numbered 1, 2, 3... with no gaps after manual deletions."""
    cursor.execute("SELECT COUNT(*) AS cnt, COALESCE(MAX(id), 0) AS max_id FROM locations")
    row = cursor.fetchone()
    total_rows = row['cnt'] if isinstance(row, dict) else row[0]
    max_id = row['max_id'] if isinstance(row, dict) else row[1]

    if total_rows > 0 and total_rows != max_id:
        cursor.execute("SET @temp_id = %s", (max_id,))
        cursor.execute('''
            UPDATE locations 
            SET id = (@temp_id := @temp_id + 1) 
            ORDER BY timestamp ASC, id ASC
        ''')
        cursor.execute("SET @new_id = 0")
        cursor.execute('''
            UPDATE locations 
            SET id = (@new_id := @new_id + 1) 
            ORDER BY id ASC
        ''')
        conn.commit()

def init_table():
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS locations (
                id INT NOT NULL PRIMARY KEY,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()

        # Ensure AUTO_INCREMENT is removed and IDs start from 1
        cursor.execute('ALTER TABLE locations MODIFY id INT NOT NULL')
        conn.commit()
        resequence_ids(conn, cursor)
    except Exception as e:
        print("Database init error:", e)
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

def insert_or_update_location(lat, lng):
    """Avoids duplicate rows and inserts new locations with sequential IDs starting from 1."""
    lat_val = round(float(lat), 4)
    lng_val = round(float(lng), 4)

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Heal any ID gaps before inserting/updating
        resequence_ids(conn, cursor)

        # Check if this coordinate already exists (within 4 decimal places)
        cursor.execute('''
            SELECT id FROM locations 
            WHERE ROUND(latitude, 4) = %s AND ROUND(longitude, 4) = %s
            LIMIT 1
        ''', (lat_val, lng_val))
        existing = cursor.fetchone()

        if existing:
            cursor.execute('''
                UPDATE locations SET timestamp = CURRENT_TIMESTAMP WHERE id = %s
            ''', (existing['id'],))
        else:
            cursor.execute('SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM locations')
            next_id = cursor.fetchone()['next_id']

            cursor.execute('''
                INSERT INTO locations (id, latitude, longitude) VALUES (%s, %s, %s)
            ''', (next_id, lat_val, lng_val))

        conn.commit()
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/admin')
def admin():
    if not session.get('is_admin'):
        return redirect('/')
    return send_from_directory(FRONTEND_DIR, 'admin.html')

@app.route('/api/location', methods=['POST'])
def save_location():
    data = request.get_json(silent=True) or {}
    lat, lng = data.get('lat'), data.get('lng')
    if lat is not None and lng is not None:
        try:
            insert_or_update_location(lat, lng)
            return jsonify({"status": "success"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Missing data"}), 400

@app.route('/api/ip_location', methods=['POST'])
def save_ip_location():
    try:
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        if client_ip and ',' in client_ip:
            client_ip = client_ip.split(',')[0].strip()

        safe_ip = urllib.parse.quote(client_ip or '')
        url = f"http://ip-api.com/json/{safe_ip}"
        req = urllib.request.urlopen(url, timeout=3)
        geo = json.loads(req.read().decode('utf-8'))

        lat, lng = geo.get('lat'), geo.get('lon')
        if lat is not None and lng is not None:
            insert_or_update_location(lat, lng)
            return jsonify({"status": "success", "source": "ip"}), 200
        return jsonify({"error": "Could not resolve IP location"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    submitted_pin = str(data.get('pin', '')).strip()
    if hmac.compare_digest(submitted_pin, ADMIN_PIN):
        session['is_admin'] = True
        return jsonify({"success": True}), 200
    return jsonify({"success": False}), 401

@app.route('/api/get_locations')
def get_locations():
    if not session.get('is_admin'):
        return jsonify({"error": "Unauthorized"}), 401
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Automatically re-arrange IDs from 1 if rows were deleted manually in DB
        resequence_ids(conn, cursor)

        cursor.execute('''
            SELECT 
                MAX(id) AS id,
                ROUND(latitude, 4) AS latitude,
                ROUND(longitude, 4) AS longitude,
                MAX(timestamp) AS timestamp
            FROM locations
            GROUP BY ROUND(latitude, 4), ROUND(longitude, 4)
            ORDER BY timestamp DESC
        ''')
        locations = cursor.fetchall()
        return jsonify(locations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.route('/<path:filename>')
def serve_static(filename):
    if filename == 'admin.html' and not session.get('is_admin'):
        return redirect('/')
    return send_from_directory(FRONTEND_DIR, filename)

init_table()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

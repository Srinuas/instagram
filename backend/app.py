from flask import Flask, request, jsonify, send_from_directory, session, redirect
from dotenv import load_dotenv
import mysql.connector
import urllib.request
import urllib.parse
import json
import os
import hmac

from math import radians, sin, cos, sqrt, atan2
from datetime import datetime, timedelta

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

app = Flask(__name__, static_folder=None)
app.secret_key = os.getenv('SECRET_KEY', 'default_secret')
ADMIN_PIN = str(os.getenv('ADMIN_PIN', '6369')).strip()
ONLINE_USERS = {}

def get_db():
    return mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        port=int(os.getenv('MYSQL_PORT', 10487)),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE')
    )

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371000

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c

def init_table():
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS locations (
    id INT NOT NULL PRIMARY KEY,
    ip_address VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
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

def insert_or_update_location(lat, lng, ip_address, city="", country=""):

    lat_val = float(lat)
    lng_val = float(lng)

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    try:

        ONLINE_USERS[ip_address] = datetime.utcnow()

        cursor.execute("""
            SELECT latitude, longitude
            FROM locations
            WHERE ip_address=%s
            ORDER BY timestamp DESC
            LIMIT 1
        """, (ip_address,))

        last = cursor.fetchone()

        if last:

            distance = calculate_distance(
                lat_val,
                lng_val,
                last["latitude"],
                last["longitude"]
            )

            if distance < 10:
                return

        cursor.execute(
            "SELECT COALESCE(MAX(id),0)+1 AS next_id FROM locations"
        )

        next_id = cursor.fetchone()["next_id"]

        cursor.execute("""
            INSERT INTO locations
            (
                id,
                ip_address,
                city,
                country,
                latitude,
                longitude
            )
            VALUES
            (
                %s,%s,%s,%s,%s,%s
            )
        """,
        (
            next_id,
            ip_address,
            city,
            country,
            lat_val,
            lng_val
        ))

        conn.commit()

    finally:
        cursor.close()
        conn.close()

def resequence_ids(conn, cursor):
    """Always keeps database IDs numbered 1, 2, 3... in chronological order."""
    cursor.execute("SELECT COUNT(*) AS cnt, COALESCE(MAX(id), 0) AS max_id FROM locations")
    row = cursor.fetchone()
    total_rows = row['cnt'] if isinstance(row, dict) else row[0]
    max_id = row['max_id'] if isinstance(row, dict) else row[1]

    if total_rows > 0:
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
        lat = geo.get('lat')
lng = geo.get('lon')

city = geo.get('city', '')
country = geo.get('country', '')

if lat is not None and lng is not None:

    insert_or_update_location(
        lat,
        lng,
        client_ip,
        city,
        country
    )

    return jsonify({
        "status":"success",
        "source":"ip"
    }), 200

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

        cursor.execute("""
    SELECT
        id,
        ip_address,
        city,
        country,
        latitude,
        longitude,
        timestamp
    FROM locations
    ORDER BY timestamp DESC
""")

        locations = cursor.fetchall()
        return jsonify(locations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.route('/api/live_users')
def live_users():

    if not session.get('is_admin'):
        return jsonify({"error":"Unauthorized"}),401

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM locations
        ORDER BY timestamp DESC
    """)

    data = cursor.fetchall()

    result = []

    for row in data:

        last_seen = ONLINE_USERS.get(
            row["ip_address"]
        )

        is_live = False

        if last_seen:
            is_live = (
                datetime.utcnow() - last_seen
            ) < timedelta(seconds=15)

        row["status"] = "LIVE" if is_live else "OFFLINE"

        result.append(row)

    cursor.close()
    conn.close()

    return jsonify(result)

@app.route('/api/delete_location/<int:id>', methods=['DELETE'])
def delete_location(id):

    if not session.get('is_admin'):
        return jsonify({"error":"Unauthorized"}),401

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM locations WHERE id=%s",
        (id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"success":True})

@app.route('/<path:filename>')
def serve_static(filename):
    if filename == 'admin.html' and not session.get('is_admin'):
        return redirect('/')
    return send_from_directory(FRONTEND_DIR, filename)

init_table()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

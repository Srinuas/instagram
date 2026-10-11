from flask import Flask, request, jsonify, send_from_directory, session, redirect
from dotenv import load_dotenv
import mysql.connector
import urllib.request
import json
import os

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, template_folder=FRONTEND_DIR)
app.secret_key = os.getenv('SECRET_KEY', 'default_secret')
ADMIN_PIN = os.getenv('ADMIN_PIN', '6369')

def get_db():
    return mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        port=int(os.getenv('MYSQL_PORT', 10487)),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE')
    )

def init_table():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS locations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print("Database init error:", e)

def insert_or_update_location(lat, lng):
    """Avoids duplicate rows by checking if rounded coordinates already exist."""
    lat_val = round(float(lat), 4)
    lng_val = round(float(lng), 4)

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Check if this coordinate already exists (within 4 decimal places)
    cursor.execute('''
        SELECT id FROM locations 
        WHERE ROUND(latitude, 4) = %s AND ROUND(longitude, 4) = %s
        LIMIT 1
    ''', (lat_val, lng_val))
    existing = cursor.fetchone()

    if existing:
        # Update timestamp of existing record instead of creating a duplicate
        cursor.execute('''
            UPDATE locations SET timestamp = CURRENT_TIMESTAMP WHERE id = %s
        ''', (existing['id'],))
    else:
        cursor.execute('''
            INSERT INTO locations (latitude, longitude) VALUES (%s, %s)
        ''', (lat_val, lng_val))

    conn.commit()
    cursor.close()
    conn.close()

@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)

@app.route('/api/location', methods=['POST'])
def save_location():
    data = request.json or {}
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
        # 1. Extract the real user IP from cloud proxy headers (Render / Cloudflare / Nginx)
        client_ip = (
            request.headers.get('CF-Connecting-IP') or
            request.headers.get('True-Client-IP') or
            request.headers.get('X-Forwarded-For', request.remote_addr)
        )
        
        # X-Forwarded-For can contain multiple IPs: "client_ip, proxy1, proxy2"
        # The first IP in the list is always the real user's public internet IP
        if client_ip and ',' in client_ip:
            client_ip = client_ip.split(',')[0].strip()

        # 2. Query IP Geolocation API (using ipwho.is over HTTPS)
        url = f"https://ipwho.is/{client_ip}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as response:
            geo = json.loads(response.read().decode('utf-8'))

        if geo.get('success'):
            lat = geo.get('latitude')
            lng = geo.get('longitude')
            if lat is not None and lng is not None:
                insert_or_update_location(lat, lng)
                return jsonify({
                    "status": "success",
                    "ip": client_ip,
                    "city": geo.get('city'),
                    "region": geo.get('region')
                }), 200

        return jsonify({"error": "Could not resolve IP location"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    if str(data.get('pin')).strip() == str(ADMIN_PIN).strip():
        session['is_admin'] = True
        return jsonify({"success": True}), 200
    return jsonify({"success": False}), 401

@app.route('/admin')
def admin():
    if not session.get('is_admin'):
        return redirect('/')
    return send_from_directory(FRONTEND_DIR, 'admin.html')

@app.route('/api/get_locations')
def get_locations():
    if not session.get('is_admin'):
        return jsonify({"error": "Unauthorized"}), 401
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        # Groups any old duplicate rows so only unique locations are returned
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
        cursor.close()
        conn.close()
        return jsonify(locations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    init_table()
    app.run(host='0.0.0.0', port=5000)
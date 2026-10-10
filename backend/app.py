from flask import Flask, request, jsonify, send_from_directory, session, redirect
from dotenv import load_dotenv
import mysql.connector
import os

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, template_folder=FRONTEND_DIR)
app.secret_key = os.getenv('SECRET_KEY', 'default_secret')
ADMIN_PIN = os.getenv('ADMIN_PIN', '6369')

def get_db():
    # Aiven requires SSL, which is enabled by default in this connector
    return mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        port=os.getenv('MYSQL_PORT'),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE')
    )

@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)

@app.route('/api/location', methods=['POST'])
def save_location():
    data = request.json
    lat, lng = data.get('lat'), data.get('lng')
    
    if lat and lng:
        conn = get_db()
        cursor = conn.cursor()
        # MySQL uses %s for parameterized queries
        cursor.execute('INSERT INTO locations (latitude, longitude) VALUES (%s, %s)', (lat, lng))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success"}), 200
    return jsonify({"error": "Missing data"}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if data.get('pin') == ADMIN_PIN:
        session['is_admin'] = True
        return jsonify({"success": True})
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
        
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, latitude, longitude, timestamp FROM locations ORDER BY timestamp DESC')
    locations = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return jsonify(locations)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
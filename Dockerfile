FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY . /app
# Initialize the database during build
RUN python database/init_db.py
EXPOSE 5000
CMD ["python", "backend/app.py"]
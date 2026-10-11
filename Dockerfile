FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY . /app

# The RUN python database/init_db.py line has been removed.

EXPOSE 5000
CMD ["python", "backend/app.py"]

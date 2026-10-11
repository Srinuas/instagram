FROM python:3.11-slim

# Prevent .pyc files, buffer stdout, and silence pip notices
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Create a non-root user and group
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin appuser

# Install dependencies as root (system-wide)
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy application files and set ownership to appuser
COPY --chown=appuser:appgroup . /app

# Switch to non-root user
USER appuser

EXPOSE 5000
CMD ["python", "backend/app.py"]

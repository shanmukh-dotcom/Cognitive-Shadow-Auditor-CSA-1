# -----------------------------------
# Stage 1: Build the React Frontend
# -----------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend configuration and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy the rest of the frontend code and build it
COPY frontend/ ./
RUN npm run build

# -----------------------------------
# Stage 2: Build the Python Backend
# -----------------------------------
FROM python:3.11-slim
WORKDIR /app

# Prevent Python from buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

# Install system dependencies if required for some packages
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY main.py .
COPY db/ ./db/
COPY models/ ./models/
COPY routers/ ./routers/
COPY services/ ./services/

# Copy the compiled frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
# Expose the port (Render will dynamically set the PORT environment variable)
EXPOSE 8000

# Start the unified FastAPI server
# Render uses $PORT, if not provided it defaults to 8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

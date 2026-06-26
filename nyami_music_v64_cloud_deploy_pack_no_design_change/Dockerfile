FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV NYAMI_HOST=0.0.0.0
ENV NYAMI_NO_OPEN=1
ENV NYAMI_STORAGE_DIR=/app/storage

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/storage/data /app/storage/uploads/music /app/storage/uploads/covers

EXPOSE 5000

CMD ["python", "server.py"]

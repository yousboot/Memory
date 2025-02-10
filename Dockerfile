FROM python:3.10
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir flask flask-cors sqlite3
EXPOSE 5000
CMD ["python", "app.py"]

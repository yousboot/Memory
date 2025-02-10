from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    send_from_directory,
    jsonify,
)
import sqlite3
import os
from flask_cors import CORS

app = Flask(__name__)
DB_FILE = "notes.db"
NOTES_DIR = "notes"
UPLOAD_IMAGE_FOLDER = os.path.join(NOTES_DIR, "images")
UPLOAD_VIDEO_FOLDER = os.path.join(NOTES_DIR, "videos")

app.config["UPLOAD_IMAGE_FOLDER"] = UPLOAD_IMAGE_FOLDER
app.config["UPLOAD_VIDEO_FOLDER"] = UPLOAD_VIDEO_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB limit for videos

CORS(
    app,
    resources={r"/upload_image": {"origins": "*"}, r"/upload_video": {"origins": "*"}},
)

if not os.path.exists(UPLOAD_IMAGE_FOLDER):
    os.makedirs(UPLOAD_IMAGE_FOLDER)

if not os.path.exists(UPLOAD_VIDEO_FOLDER):
    os.makedirs(UPLOAD_VIDEO_FOLDER)


def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute(
            """
        CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
        )"""
        )
        c.execute(
            """
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT UNIQUE,
            filename TEXT,
            folder_id INTEGER,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
        )"""
        )

        c.execute("INSERT OR IGNORE INTO folders (name) VALUES ('Principal')")
        c.execute("INSERT OR IGNORE INTO folders (name) VALUES ('Templates')")
        conn.commit()


init_db()


@app.route("/")
def index():
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("SELECT id, name FROM folders")
        folders = c.fetchall()
        c.execute("SELECT id, title FROM notes")
        notes = c.fetchall()
    return render_template("index.html", notes=notes, folders=folders)


@app.route("/add_folder", methods=["POST"])
def add_folder():
    name = request.form["name"]
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("INSERT INTO folders (name) VALUES (?)", (name,))
        conn.commit()
    return redirect(url_for("index"))


@app.route("/edit_folder/<int:folder_id>", methods=["GET", "POST"])
def edit_folder(folder_id):
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        if request.method == "POST":
            new_name = request.form["name"]
            c.execute("UPDATE folders SET name = ? WHERE id = ?", (new_name, folder_id))
            conn.commit()
            return redirect(url_for("index"))
        else:
            c.execute("SELECT name FROM folders WHERE id = ?", (folder_id,))
            folder = c.fetchone()
    return render_template("edit_folder.html", folder=folder, folder_id=folder_id)


@app.route("/delete_folder/<int:folder_id>", methods=["POST"])
def delete_folder(folder_id):
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("DELETE FROM folders WHERE id = ?", (folder_id,))
        conn.commit()
    return redirect(url_for("index"))


@app.route("/add", methods=["POST"])
def add_note():
    if request.is_json:  # If JSON request
        data = request.get_json()
    else:  # If form submission
        data = request.form

    title = data.get("title")
    folder_id = data.get("folder_id")
    subtitle = data.get("subtitle", "")

    if not title or not folder_id:
        return jsonify({"success": False, "error": "Missing title or folder ID"}), 400

    filename = f"{title}.md"
    filepath = os.path.join(NOTES_DIR, filename)

    with open(filepath, "w") as f:
        f.write(f"")

    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute(
            "INSERT INTO notes (title, filename, folder_id, subtitle) VALUES (?, ?, ?, ?)",
            (title, filename, folder_id, subtitle),
        )
        conn.commit()

    return jsonify({"success": True})


@app.route("/edit/<int:note_id>", methods=["GET", "POST"])
def edit_note(note_id):
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT title, filename, subtitle FROM notes WHERE id = ?", (note_id,)
        )
        note = c.fetchone()
    if request.method == "POST":
        content = request.form["content"]
        with open(os.path.join(NOTES_DIR, note[1]), "w") as f:
            f.write(content)
        return redirect(url_for("index"))
    with open(os.path.join(NOTES_DIR, note[1]), "r") as f:
        content = f.read()
    return render_template(
        "edit.html", title=note[0], subtitle=note[2], content=content, note_id=note_id
    )


@app.route("/delete/<int:note_id>", methods=["POST"])
def delete_note(note_id):
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("SELECT filename FROM notes WHERE id=?", (note_id,))
        row = c.fetchone()
        if row:
            path = os.path.join(NOTES_DIR, row[0])
            if os.path.exists(path):
                os.remove(path)
            c.execute("DELETE FROM notes WHERE id=?", (note_id,))
            conn.commit()
    return redirect(url_for("index"))


@app.route("/upload_image", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(app.config["UPLOAD_IMAGE_FOLDER"], file.filename)
    file.save(filepath)
    return jsonify({"url": f"/notes/images/{file.filename}"})


@app.route("/upload_video", methods=["POST"])
def upload_video():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(app.config["UPLOAD_VIDEO_FOLDER"], file.filename)
    file.save(filepath)
    return jsonify({"url": f"/notes/videos/{file.filename}"})


@app.route("/notes/images/<filename>")
def get_uploaded_image(filename):
    return send_from_directory(app.config["UPLOAD_IMAGE_FOLDER"], filename)


@app.route("/notes/videos/<filename>")
def get_uploaded_video(filename):
    return send_from_directory(app.config["UPLOAD_VIDEO_FOLDER"], filename)


@app.route("/save/<int:note_id>", methods=["POST"])
def save_note(note_id):
    data = request.json
    new_content = data.get("content", "")

    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("SELECT filename FROM notes WHERE id = ?", (note_id,))
        note = c.fetchone()

        if note:
            filepath = os.path.join(NOTES_DIR, note[0])
            with open(filepath, "w") as f:
                f.write(new_content)
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": "Note not found"}), 404


@app.route("/note/<int:note_id>", methods=["GET"])
def view_note(note_id):
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT title, filename, subtitle FROM notes WHERE id = ?", (note_id,)
        )
        note = c.fetchone()

    if not note:
        return "Note not found", 404

    with open(os.path.join(NOTES_DIR, note[1]), "r") as f:
        content = f.read()

    return render_template(
        "note.html", title=note[0], subtitle=note[2], content=content, note_id=note_id
    )


@app.route("/get_notes", methods=["GET"])
def get_notes():
    folder_id = request.args.get("folder_id")

    if not folder_id:
        return jsonify({"error": "Missing folder_id parameter"}), 400

    try:
        folder_id = int(folder_id)
    except ValueError:
        return jsonify({"error": "Invalid folder_id parameter"}), 400

    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id, title, subtitle FROM notes WHERE folder_id = ?", (folder_id,)
        )
        notes = [
            {"id": row[0], "title": row[1], "subtitle": row[2]} for row in c.fetchall()
        ]
    return jsonify(notes)


if __name__ == "__main__":
    app.run(debug=True)

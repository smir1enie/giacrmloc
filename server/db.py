import csv
import json
import re
import sqlite3
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
DB_PATH = DATA / "crm.db"
UPLOADS = DATA / "uploads"
SAMPLES = DATA / "samples"
BACKUPS = DATA / "backups"

SCHOOL_CITY = "г. Ханты-Мансийск"

SCHOOL_SEED = [
    ("1", "МБОУ «СОШ №1 им. Созонова Ю. Г.»", "22101", "226/227"),
    ("2", "МБОУ СОШ №2", "22102", ""),
    ("3", "МБОУ СОШ №3", "22106", "228"),
    ("4", "МБОУ СОШ №4", "22108", "229"),
    ("5", "МБОУ СОШ №5", "22103", "222"),
    ("6", "МБОУ «СОШ №6 им. Сирина Н.И.»", "22104", "225"),
    ("7", "МБОУ «Центр образования №7 им. Дунина-Горкавича А.А.»", "22113", "221"),
    ("8", "МБОУ «СОШ №8»", "22105", ""),
    ("9", "МБОУ «СОШ №9»", "22114", ""),
    ("10", "МБОУ «Гимназия №1»", "22107", ""),
    ("11", "ЮКИОР", "40923", ""),
    ("12", "ЮФМЯ", "22109", ""),
    ("13", "ЦИОДС", "22110", ""),
]


def connect():
    DATA.mkdir(parents=True, exist_ok=True)
    UPLOADS.mkdir(parents=True, exist_ok=True)
    BACKUPS.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.create_function("py_lower", 1, lambda value: str(value or "").casefold())
    return conn


def _ensure_school_columns(conn):
    columns = {row["name"] for row in conn.execute("PRAGMA table_info(schools)")}
    if "ppe" not in columns:
        conn.execute("ALTER TABLE schools ADD COLUMN ppe TEXT")
    if "position" not in columns:
        conn.execute("ALTER TABLE schools ADD COLUMN position INTEGER NOT NULL DEFAULT 0")


def sync_schools(conn):
    _ensure_school_columns(conn)
    seed_ids = {row[0] for row in SCHOOL_SEED}
    for row in conn.execute("SELECT id FROM schools WHERE id NOT LIKE 'oo-%'"):
        if row["id"] not in seed_ids:
            conn.execute("DELETE FROM schools WHERE id = ?", (row["id"],))
    for school_id, *_rest in SCHOOL_SEED:
        conn.execute("UPDATE schools SET oo = 'tmp-' || id WHERE id = ?", (school_id,))
    for position, (school_id, name, oo, ppe) in enumerate(SCHOOL_SEED, start=1):
        conn.execute(
            """
            INSERT INTO schools (id, name, oo, msu, city, ppe, position, status)
            VALUES (?, ?, ?, '', ?, ?, ?, 'active')
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              oo = excluded.oo,
              city = excluded.city,
              ppe = excluded.ppe,
              position = excluded.position
            """,
            (school_id, name, oo, SCHOOL_CITY, ppe, position),
        )


def init_db():
    conn = connect()
    conn.executescript((ROOT / "schema.sql").read_text(encoding="utf-8"))
    conn.execute(
        "INSERT OR IGNORE INTO users (login, name, role) VALUES (?, ?, ?)",
        ("admin", "Администратор", "Администратор"),
    )
    sync_schools(conn)
    conn.commit()
    return conn


def _norm(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def _to_number(value):
    text = _norm(value).replace(",", ".")
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def detect_header_row(rows):
    for index, row in enumerate(rows):
        joined = " ".join(_norm(cell).lower() for cell in row)
        if "фамил" in joined and ("мсу" in joined or "код оо" in joined or "аудитор" in joined):
            return index
    return 0


SUBJECT_LINE = re.compile(r"\d+\s*-\s*(.+?)\s+(\d{4}[.-]\d{2}[.-]\d{2})\s*$")
FOOTER_LINE = re.compile(r"^(средние|минимальная граница|всего участников|дата создания)", re.I)


def is_header_row(row):
    joined = " ".join(_norm(cell).lower() for cell in row)
    return "фамил" in joined and ("мсу" in joined or "код оо" in joined or "аудитор" in joined)


def is_footer_row(row):
    first = next((_norm(cell) for cell in row if _norm(cell)), "")
    return bool(FOOTER_LINE.match(first))


def split_gia_tables(raw_rows):
    if not raw_rows:
        raise ValueError("Пустая таблица")
    title = ""
    year = None
    pending_subject = ""
    pending_date = ""
    blocks = []
    current = None

    def flush():
        nonlocal current
        if current and current["rows"]:
            current["rows"] = fill_down_rows(current["columns"], current["rows"])
            current.pop("keep", None)
            blocks.append(current)
        current = None

    for row in raw_rows:
        line = " ".join(_norm(cell) for cell in row if _norm(cell))
        if not line:
            continue
        if not title and "протокол" in line.lower():
            title = line
        year_match = re.search(r"\b(20\d{2})\b", line)
        if year_match:
            year = int(year_match.group(1))
        subject_match = SUBJECT_LINE.search(line)
        if subject_match:
            pending_subject = subject_match.group(1).strip()
            pending_date = subject_match.group(2).replace("-", ".")
            continue
        if is_header_row(row):
            flush()
            header = [_norm(cell) for cell in row]
            keep = [i for i, name in enumerate(header) if name]
            if not keep:
                continue
            current = {
                "columns": [header[i] for i in keep],
                "keep": keep,
                "rows": [],
                "title": title,
                "subject": pending_subject,
                "exam_date": pending_date,
                "year": year,
            }
            continue
        if current is None or is_footer_row(row):
            continue
        cells = [_norm(row[i] if i < len(row) else "") for i in current["keep"]]
        if not any(cells):
            continue
        lowered = [cell.lower() for cell in cells]
        if lowered[0] in {"№", "n", "id"} or "фамилия" in lowered:
            continue
        current["rows"].append(cells)
    flush()
    if not blocks:
        raise ValueError("В таблице нет строк с данными")
    return blocks


def fill_down_rows(columns, rows):
    fill_idx = [
        index
        for index, name in enumerate(columns)
        if re.search(r"код оо|^оо$|мсу|ппэ|класс", name.lower())
    ]
    if not fill_idx or not rows:
        return rows
    prev = [""] * len(columns)
    filled = []
    for cells in rows:
        row = list(cells) + [""] * max(0, len(columns) - len(cells))
        row = row[: len(columns)]
        for index in fill_idx:
            if row[index]:
                prev[index] = row[index]
            elif prev[index]:
                row[index] = prev[index]
        filled.append(row)
    return filled


def col_index(columns, *patterns):
    for index, name in enumerate(columns):
        lowered = name.lower()
        if any(re.search(pattern, lowered) for pattern in patterns):
            return index
    return -1


def map_student(columns, cells):
    def take(*patterns):
        index = col_index(columns, *patterns)
        return cells[index] if index >= 0 and index < len(cells) else ""

    primary = _to_number(take(r"первичн"))
    test = _to_number(take(r"тестов"))
    score = test if test is not None else primary
    return {
        "row_no": _to_number(take(r"^№$", r"^id$", r"^n$")),
        "last_name": take(r"фамил"),
        "first_name": take(r"^имя$"),
        "middle_name": take(r"отчеств"),
        "klass": take(r"класс"),
        "room": take(r"аудитор"),
        "msu": take(r"мсу"),
        "oo": take(r"код оо", r"^оо$"),
        "ppe": take(r"ппэ"),
        "series": take(r"серия"),
        "number": take(r"номер"),
        "short_answers": take(r"кратким"),
        "long_answers": take(r"развёрт", r"разверт"),
        "primary_score": primary,
        "test_score": test,
        "mark": take(r"оценк"),
        "score": score,
        "cells": cells,
    }


def school_by_oo(conn, oo, msu="220"):
    oo = _norm(oo)
    if not re.fullmatch(r"\d+", oo):
        return None
    row = conn.execute("SELECT * FROM schools WHERE oo = ?", (oo,)).fetchone()
    if row:
        return dict(row)
    school_id = f"oo-{oo}"
    conn.execute(
        """
        INSERT OR IGNORE INTO schools (id, name, oo, msu, city, ppe, position, status)
        VALUES (?, ?, ?, ?, ?, '', 999, 'active')
        """,
        (school_id, f"ОО {oo}", oo, msu or "", SCHOOL_CITY),
    )
    return dict(conn.execute("SELECT * FROM schools WHERE id = ?", (school_id,)).fetchone())


def unassigned_school(conn):
    row = conn.execute("SELECT * FROM schools WHERE id = 'oo-none'").fetchone()
    if row:
        return dict(row)
    conn.execute(
        """
        INSERT OR IGNORE INTO schools (id, name, oo, msu, city, ppe, position, status)
        VALUES ('oo-none', 'Без кода ОО', '', '', ?, '', 1000, 'active')
        """,
        (SCHOOL_CITY,),
    )
    return dict(conn.execute("SELECT * FROM schools WHERE id = 'oo-none'").fetchone())


def insert_students(conn, protocol_id, students):
    for student in students:
        conn.execute(
            """
            INSERT INTO protocol_students (
              protocol_id, row_no, last_name, first_name, middle_name, klass, room,
              msu, oo, ppe, series, number, short_answers, long_answers,
              primary_score, test_score, mark, cells_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                protocol_id,
                student.get("row_no"),
                student.get("last_name"),
                student.get("first_name"),
                student.get("middle_name"),
                student.get("klass"),
                student.get("room"),
                student.get("msu"),
                student.get("oo"),
                student.get("ppe"),
                student.get("series"),
                student.get("number"),
                student.get("short_answers"),
                student.get("long_answers"),
                student.get("primary_score"),
                student.get("test_score"),
                student.get("mark"),
                json.dumps(student.get("cells") or [], ensure_ascii=False),
            ),
        )


def replace_protocol_students(conn, protocol_id, columns, students):
    conn.execute("DELETE FROM protocol_columns WHERE protocol_id = ?", (protocol_id,))
    conn.execute("DELETE FROM protocol_students WHERE protocol_id = ?", (protocol_id,))
    for position, name in enumerate(columns):
        conn.execute(
            "INSERT INTO protocol_columns (protocol_id, position, name) VALUES (?, ?, ?)",
            (protocol_id, position, name),
        )
    insert_students(conn, protocol_id, students)


def upsert_protocol(conn, school_id, year, subject, title, exam_date, import_id, columns, students):
    existing = conn.execute(
        "SELECT id, import_id FROM protocols WHERE school_id = ? AND year = ? AND subject = ?",
        (school_id, year, subject),
    ).fetchone()
    if existing:
        protocol_id = existing["id"]
        conn.execute(
            """
            UPDATE protocols
            SET title = ?, exam_date = ?, status = 'imported', import_id = ?
            WHERE id = ?
            """,
            (title, exam_date, import_id, protocol_id),
        )
        if existing["import_id"] == import_id:
            insert_students(conn, protocol_id, students)
            return protocol_id
    else:
        cur = conn.execute(
            """
            INSERT INTO protocols (school_id, year, subject, title, exam_date, status, import_id)
            VALUES (?, ?, ?, ?, ?, 'imported', ?)
            """,
            (school_id, year, subject, title, exam_date, import_id),
        )
        protocol_id = cur.lastrowid
        conn.execute(
            """
            INSERT INTO documents (school_id, protocol_id, name, format)
            VALUES (?, ?, ?, 'EXCEL')
            """,
            (school_id, protocol_id, title),
        )
    replace_protocol_students(conn, protocol_id, columns, students)
    return protocol_id


def import_table(conn, payload, stored_path=None):
    if payload.get("rawRows"):
        blocks = split_gia_tables(payload["rawRows"])
    else:
        blocks = [
            {
                "columns": payload["columns"],
                "rows": payload["rows"],
                "year": payload.get("year"),
                "subject": payload.get("subject"),
                "title": payload.get("title"),
                "exam_date": payload.get("exam_date"),
            }
        ]
    split = bool(payload.get("splitBySchool", True))
    file_name = _norm(payload.get("fileName")) or "import.xlsx"
    fallback_year = int(payload.get("year") or blocks[0].get("year") or 2026)
    fallback_subject = _norm(payload.get("subject")) or _norm(blocks[0].get("subject")) or "Без предмета"

    cur = conn.execute(
        "INSERT INTO imports (original_name, stored_path, year, subject) VALUES (?, ?, ?, ?)",
        (file_name, stored_path, fallback_year, fallback_subject),
    )
    import_id = cur.lastrowid
    created = []

    for block in blocks:
        columns = block["columns"]
        year = int(block.get("year") or fallback_year)
        subject = _norm(block.get("subject")) or fallback_subject
        title = _norm(payload.get("title")) or _norm(block.get("title")) or f"Протокол “{subject}”"
        exam_date = _norm(block.get("exam_date") or payload.get("exam_date"))
        rows = fill_down_rows(columns, block["rows"])
        students = [map_student(columns, cells) for cells in rows]
        if split:
            groups = {}
            for student in students:
                key = student.get("oo") or payload.get("schoolId") or ""
                groups.setdefault(key, []).append(student)
            for oo, group in groups.items():
                school = school_by_oo(conn, oo, group[0].get("msu")) or unassigned_school(conn)
                protocol_id = upsert_protocol(
                    conn, school["id"], year, subject, title, exam_date, import_id, columns, group
                )
                created.append(
                    {
                        "protocolId": protocol_id,
                        "schoolId": school["id"],
                        "subject": subject,
                        "count": len(group),
                    }
                )
        else:
            school_id = payload.get("schoolId") or "1"
            protocol_id = upsert_protocol(
                conn, school_id, year, subject, title, exam_date, import_id, columns, students
            )
            created.append(
                {
                    "protocolId": protocol_id,
                    "schoolId": school_id,
                    "subject": subject,
                    "count": len(students),
                }
            )
    conn.commit()
    return {"importId": import_id, "protocols": created, "tables": len(blocks)}


def list_schools(conn):
    return [dict(row) for row in conn.execute("SELECT * FROM schools ORDER BY position, name")]


def list_students(conn, year=None, school_id=None, query=""):
    sql = """
      SELECT st.id, st.last_name, st.first_name, st.middle_name, st.klass,
             st.oo, st.primary_score, st.test_score, st.mark,
             p.id AS protocol_id, p.year, p.subject, p.school_id,
             s.name AS school_name
      FROM protocol_students st
      JOIN protocols p ON p.id = st.protocol_id
      JOIN schools s ON s.id = p.school_id
      WHERE 1 = 1
    """
    params = []
    if year and year != "all":
        sql += " AND p.year = ?"
        params.append(int(year))
    if school_id and school_id != "all":
        sql += " AND p.school_id = ?"
        params.append(school_id)
    if query:
        sql += """
          AND (
            py_lower(ifnull(st.last_name,'')) LIKE ?
            OR py_lower(ifnull(st.first_name,'')) LIKE ?
            OR py_lower(ifnull(st.middle_name,'')) LIKE ?
            OR py_lower(ifnull(st.last_name,'') || ' ' || ifnull(st.first_name,'')) LIKE ?
            OR py_lower(s.name) LIKE ?
            OR py_lower(p.subject) LIKE ?
            OR ifnull(st.oo,'') LIKE ?
          )
        """
        like = f"%{query.casefold()}%"
        params.extend([like, like, like, like, like, like, like])
    sql += " ORDER BY st.last_name, st.first_name, p.year DESC, p.subject"
    return [dict(row) for row in conn.execute(sql, params)]


def list_protocols(conn, year=None, school_id=None, query=""):
    sql = """
      SELECT p.id, p.school_id, s.name AS school_name, s.oo, p.year, p.subject,
             p.title, p.exam_date, p.status, COUNT(st.id) AS student_count
      FROM protocols p
      JOIN schools s ON s.id = p.school_id
      LEFT JOIN protocol_students st ON st.protocol_id = p.id
      WHERE 1 = 1
    """
    params = []
    if year and year != "all":
        sql += " AND p.year = ?"
        params.append(int(year))
    if school_id and school_id != "all":
        sql += " AND p.school_id = ?"
        params.append(school_id)
    if query:
        sql += """
          AND (
            py_lower(p.title) LIKE ? OR py_lower(p.subject) LIKE ? OR py_lower(s.name) LIKE ?
            OR EXISTS (
              SELECT 1 FROM protocol_students x
              WHERE x.protocol_id = p.id AND (
                py_lower(ifnull(x.last_name,'')) LIKE ?
                OR py_lower(ifnull(x.first_name,'')) LIKE ?
                OR py_lower(ifnull(x.middle_name,'')) LIKE ?
                OR py_lower(ifnull(x.last_name,'') || ' ' || ifnull(x.first_name,'')) LIKE ?
              )
            )
          )
        """
        like = f"%{query.lower()}%"
        params.extend([like, like, like, like, like, like, like])
    sql += " GROUP BY p.id ORDER BY s.name, p.year DESC, p.subject"
    return [dict(row) for row in conn.execute(sql, params)]


def get_protocol(conn, protocol_id):
    protocol = conn.execute(
        """
        SELECT p.*, s.name AS school_name, s.oo
        FROM protocols p
        JOIN schools s ON s.id = p.school_id
        WHERE p.id = ?
        """,
        (protocol_id,),
    ).fetchone()
    if not protocol:
        return None
    columns = [
        row["name"]
        for row in conn.execute(
            "SELECT name FROM protocol_columns WHERE protocol_id = ? ORDER BY position",
            (protocol_id,),
        )
    ]
    students = []
    for row in conn.execute(
        "SELECT * FROM protocol_students WHERE protocol_id = ? ORDER BY row_no, id",
        (protocol_id,),
    ):
        item = dict(row)
        item["cells"] = json.loads(item.pop("cells_json") or "[]")
        students.append(item)
    result = dict(protocol)
    result["columns"] = columns
    result["students"] = students
    return result


def delete_protocol(conn, protocol_id):
    conn.execute("DELETE FROM protocols WHERE id = ?", (protocol_id,))
    conn.commit()


def wipe_imported_data(conn):
    BACKUPS.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = BACKUPS / f"crm-{stamp}.db"
    backup_conn = sqlite3.connect(backup_path)
    try:
        conn.backup(backup_conn)
    finally:
        backup_conn.close()
    conn.execute("DELETE FROM documents")
    conn.execute("DELETE FROM protocol_students")
    conn.execute("DELETE FROM protocol_columns")
    conn.execute("DELETE FROM protocols")
    conn.execute("DELETE FROM imports")
    conn.execute("DELETE FROM schools WHERE id LIKE 'oo-%'")
    try:
        tables = (
            "documents",
            "protocol_students",
            "protocol_columns",
            "protocols",
            "imports",
        )
        conn.execute(
            f"DELETE FROM sqlite_sequence WHERE name IN ({','.join('?' * len(tables))})",
            tables,
        )
    except sqlite3.OperationalError:
        pass
    conn.commit()
    return {"ok": True, "backup": backup_path.name}


def prune_uploads():
    UPLOADS.mkdir(parents=True, exist_ok=True)
    files = [path for path in UPLOADS.iterdir() if path.is_file() and path.name != ".gitignore"]
    files.sort(key=lambda path: (path.stat().st_mtime, path.name))
    if not files:
        return {"ok": True, "kept": None, "deleted": 0}
    keep = files[-1]
    deleted = 0
    for path in files[:-1]:
        path.unlink()
        deleted += 1
    return {"ok": True, "kept": keep.name, "deleted": deleted}


def prune_backups(keep=2):
    BACKUPS.mkdir(parents=True, exist_ok=True)
    files = [path for path in BACKUPS.iterdir() if path.is_file() and path.suffix.lower() == ".db"]
    files.sort(key=lambda path: (path.stat().st_mtime, path.name))
    if not files:
        return {"ok": True, "kept": [], "deleted": 0}
    keep_count = max(0, int(keep))
    kept_files = files[-keep_count:] if keep_count else []
    deleted = 0
    for path in files[:-keep_count] if keep_count else files:
        path.unlink()
        deleted += 1
    return {"ok": True, "kept": [path.name for path in kept_files], "deleted": deleted}


def list_documents(conn, school_id=None):
    sql = "SELECT * FROM documents WHERE 1 = 1"
    params = []
    if school_id:
        sql += " AND school_id = ?"
        params.append(school_id)
    sql += " ORDER BY id DESC"
    return [dict(row) for row in conn.execute(sql, params)]


def add_document(conn, school_id, name, fmt, protocol_id=None):
    conn.execute(
        "INSERT INTO documents (school_id, protocol_id, name, format) VALUES (?, ?, ?, ?)",
        (school_id, protocol_id, name, fmt),
    )
    conn.commit()


def list_subjects(conn, year="all", school_id="all"):
    sql = "SELECT DISTINCT subject FROM protocols WHERE ifnull(subject,'') != ''"
    params = []
    if year and year != "all":
        sql += " AND year = ?"
        params.append(int(year))
    if school_id and school_id != "all":
        sql += " AND school_id = ?"
        params.append(school_id)
    rows = [row[0] for row in conn.execute(sql, params)]
    return sorted(rows, key=lambda value: str(value).casefold())


def stats(conn, year="all", school_id="all", subject="all", threshold=59):
    sql = """
      SELECT p.school_id, s.name AS school_name, p.subject, st.last_name, st.first_name,
             st.klass, st.test_score, st.primary_score, st.mark
      FROM protocol_students st
      JOIN protocols p ON p.id = st.protocol_id
      JOIN schools s ON s.id = p.school_id
      WHERE 1 = 1
    """
    params = []
    if year and year != "all":
        sql += " AND p.year = ?"
        params.append(int(year))
    if school_id and school_id != "all":
        sql += " AND p.school_id = ?"
        params.append(school_id)
    if subject and subject != "all":
        sql += " AND p.subject = ?"
        params.append(subject)
    rows = []
    for row in conn.execute(sql, params):
        score = row["test_score"] if row["test_score"] is not None else row["primary_score"]
        rows.append(
            {
                "schoolId": row["school_id"],
                "schoolName": row["school_name"],
                "subject": row["subject"] or "",
                "name": f"{row['last_name'] or ''} {row['first_name'] or ''}".strip() or "Без имени",
                "klass": row["klass"] or "",
                "score": float(score or 0),
                "mark": row["mark"] or "",
            }
        )
    protocol_sql = "SELECT COUNT(*) FROM protocols WHERE 1 = 1"
    protocol_params = []
    if year and year != "all":
        protocol_sql += " AND year = ?"
        protocol_params.append(int(year))
    if school_id and school_id != "all":
        protocol_sql += " AND school_id = ?"
        protocol_params.append(school_id)
    if subject and subject != "all":
        protocol_sql += " AND subject = ?"
        protocol_params.append(subject)
    protocol_count = conn.execute(protocol_sql, protocol_params).fetchone()[0]
    return {
        "rows": rows,
        "protocolCount": protocol_count,
        "threshold": threshold,
        "subjects": list_subjects(conn, year=year, school_id=school_id),
    }


def read_csv_rows(path):
    with Path(path).open(encoding="utf-8-sig", newline="") as handle:
        return [list(row) for row in csv.reader(handle, delimiter=";")]


def seed_sample_if_empty(conn):
    count = conn.execute("SELECT COUNT(*) FROM protocols").fetchone()[0]
    if count:
        return False
    sample = SAMPLES / "math_profile_2026.csv"
    if not sample.exists():
        return False
    import_table(
        conn,
        {
            "rawRows": read_csv_rows(sample),
            "fileName": "220_2026.06.08_2_22.xls",
            "splitBySchool": True,
        },
        stored_path=str(sample),
    )
    return True

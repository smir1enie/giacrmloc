import json
import os
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent
CRM_ROOT = ROOT.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import db


def json_bytes(data, status=200):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    return status, body, "application/json; charset=utf-8"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(CRM_ROOT), **kwargs)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _send(self, status, body, content_type):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(204, b"", "text/plain")

    def _read_json(self):
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8") or "{}")

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = {key: values[0] if values else "" for key, values in parse_qs(parsed.query).items()}
        conn = db.connect()
        try:
            if path == "/api/health":
                return self._send(*json_bytes({"ok": True}))
            if path == "/api/bootstrap":
                return self._send(
                    *json_bytes(
                        {
                            "schools": db.list_schools(conn),
                            "protocols": db.list_protocols(conn),
                        }
                    )
                )
            if path == "/api/schools":
                return self._send(*json_bytes(db.list_schools(conn)))
            if path == "/api/students":
                return self._send(
                    *json_bytes(
                        db.list_students(
                            conn,
                            year=query.get("year"),
                            school_id=query.get("school"),
                            query=query.get("q", ""),
                        )
                    )
                )
            if path == "/api/protocols":
                return self._send(
                    *json_bytes(
                        db.list_protocols(
                            conn,
                            year=query.get("year"),
                            school_id=query.get("school"),
                            query=query.get("q", ""),
                        )
                    )
                )
            if path.startswith("/api/protocols/") and path.count("/") == 3:
                protocol_id = int(path.rsplit("/", 1)[1])
                item = db.get_protocol(conn, protocol_id)
                if not item:
                    return self._send(*json_bytes({"error": "Протокол не найден"}, 404))
                return self._send(*json_bytes(item))
            if path == "/api/documents":
                return self._send(*json_bytes(db.list_documents(conn, query.get("school"))))
            if path == "/api/stats":
                return self._send(
                    *json_bytes(
                        db.stats(
                            conn,
                            year=query.get("year", "all"),
                            school_id=query.get("school", "all"),
                            threshold=float(query.get("threshold") or 59),
                        )
                    )
                )
        except Exception as error:
            return self._send(*json_bytes({"error": str(error)}, 400))
        finally:
            conn.close()
        if path.startswith("/api/"):
            return self._send(*json_bytes({"error": "Неизвестный маршрут"}, 404))
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        conn = db.connect()
        try:
            payload = self._read_json()
            if parsed.path == "/api/imports":
                file_b64 = payload.pop("fileBase64", None)
                stored = None
                if file_b64:
                    import base64
                    from datetime import datetime

                    raw = base64.b64decode(file_b64)
                    name = Path(payload.get("fileName") or "upload.bin").name
                    stored_path = db.UPLOADS / f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{name}"
                    stored_path.write_bytes(raw)
                    stored = str(stored_path)
                result = db.import_table(conn, payload, stored_path=stored)
                return self._send(*json_bytes(result, 201))
            if parsed.path == "/api/documents":
                db.add_document(
                    conn,
                    payload.get("schoolId"),
                    payload.get("name") or "Документ",
                    payload.get("format") or "WORD",
                    payload.get("protocolId"),
                )
                return self._send(*json_bytes({"ok": True}, 201))
            if parsed.path == "/api/reset":
                return self._send(*json_bytes(db.wipe_imported_data(conn)))
            if parsed.path == "/api/reset-uploads":
                return self._send(*json_bytes(db.prune_uploads()))
            if parsed.path == "/api/reset-backups":
                return self._send(*json_bytes(db.prune_backups(keep=2)))
            return self._send(*json_bytes({"error": "Неизвестный маршрут"}, 404))
        except Exception as error:
            return self._send(*json_bytes({"error": str(error)}, 400))
        finally:
            conn.close()

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/protocols/"):
            protocol_id = int(parsed.path.rsplit("/", 1)[1])
            conn = db.connect()
            try:
                db.delete_protocol(conn, protocol_id)
                return self._send(*json_bytes({"ok": True}))
            finally:
                conn.close()
        return self._send(*json_bytes({"error": "Неизвестный маршрут"}, 404))


class Server(ThreadingHTTPServer):
    # On Windows SO_REUSEADDR lets two processes bind the same port.
    allow_reuse_address = sys.platform != "win32"


def _health_url(port):
    return f"http://127.0.0.1:{port}/api/health"


def _already_serving(port):
    try:
        from urllib.request import urlopen

        with urlopen(_health_url(port), timeout=2) as resp:
            return resp.status == 200
    except Exception:
        return False


def _listening_pids(port):
    pids = set()
    try:
        out = subprocess.check_output(
            ["netstat", "-ano", "-p", "tcp"],
            text=True,
            encoding="oem",
            errors="replace",
        )
    except Exception:
        return pids
    for line in out.splitlines():
        parts = line.split()
        if len(parts) < 5 or parts[0].upper() != "TCP":
            continue
        local = parts[1]
        _, sep, local_port = local.rpartition(":")
        if not sep or local_port.strip("]") != str(port):
            continue
        state = parts[-2].upper()
        pid = parts[-1]
        if pid.isdigit() and ("LISTEN" in state or "ПРОСЛУШ" in parts[-2]):
            pids.add(int(pid))
    return pids


def _free_port(port):
    my_pid = os.getpid()
    for pid in _listening_pids(port):
        if pid in (0, 4, my_pid):
            continue
        subprocess.run(
            ["taskkill", "/PID", str(pid), "/F"],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    time.sleep(0.8)


def _open_browser(url):
    try:
        webbrowser.open(url)
    except Exception:
        pass


def _lan_urls(port):
    urls = []
    try:
        hostname = socket.gethostname()
        for info in socket.getaddrinfo(hostname, None, socket.AF_INET):
            ip = info[4][0]
            if ip and not ip.startswith("127."):
                urls.append(f"http://{ip}:{port}/")
    except Exception:
        pass
    return list(dict.fromkeys(urls))


def _write_start_log(lines):
    try:
        db.DATA.mkdir(parents=True, exist_ok=True)
        log_path = db.DATA / "crm-start.log"
        log_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    except Exception:
        pass


def _bind(host, port):
    return Server((host, port), Handler)


def main():
    conn = db.init_db()
    conn.close()
    host = (os.environ.get("CRM_HOST") or "127.0.0.1").strip() or "127.0.0.1"
    try:
        port = int(os.environ.get("CRM_PORT") or "8787")
    except ValueError:
        port = 8787
    local_url = f"http://127.0.0.1:{port}/"
    open_browser = os.environ.get("CRM_OPEN_BROWSER") == "1"
    log = [
        f"python={sys.executable}",
        f"version={sys.version.split()[0]}",
        f"root={CRM_ROOT}",
        f"host={host}",
        f"port={port}",
    ]

    if _already_serving(port):
        print(f"CRM уже запущен: {local_url}")
        print("Это окно можно закрыть. Работающее окно CRM не закрывайте.")
        if open_browser:
            _open_browser(local_url)
        log.append("status=already-running")
        _write_start_log(log)
        return

    try:
        httpd = _bind(host, port)
    except OSError:
        print(f"Порт {port} занят, перезапускаю...")
        _free_port(port)
        try:
            httpd = _bind(host, port)
        except OSError as error:
            print(f"Не удалось запустить CRM на {local_url}")
            print(error)
            log.append(f"status=bind-error {error}")
            _write_start_log(log)
            raise SystemExit(1)

    print(f"CRM: {local_url}")
    if host in ("0.0.0.0", "::"):
        for lan in _lan_urls(port):
            print(f"Сеть: {lan}")
    print("Не закрывайте это окно, пока работаете с CRM.")
    log.append("status=started")
    _write_start_log(log)
    if open_browser:
        threading.Timer(0.8, lambda: _open_browser(local_url)).start()
    httpd.serve_forever()


if __name__ == "__main__":
    main()

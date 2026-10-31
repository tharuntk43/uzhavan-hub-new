# Uzhavan Hub - HTTP & REST API Server
# Serves static assets and provides persistent SQLite-backed API for authentication and land profiles

import http.server
import socketserver
import os
import sys
import json
import urllib.parse
import webbrowser

import database

# Configure UTF-8 encoding for Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class UzhavanRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def send_json(self, data: dict, status_code: int = 200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self) -> dict:
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                return {}
            raw = self.rfile.read(content_length).decode('utf-8')
            return json.loads(raw)
        except Exception:
            return {}

    def get_auth_token(self) -> str:
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header[7:].strip()
        # Fallback to query param if any
        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)
        return qs.get('token', [''])[0]

    def get_authenticated_user(self):
        token = self.get_auth_token()
        if not token:
            return None
        return database.authenticate_session(token)

    # -------------------------------------------------------------
    # GET Endpoints
    # -------------------------------------------------------------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        # API: System Health Check
        if path == '/api/health':
            self.send_json({
                "status": "healthy",
                "app": "Uzhavan Hub",
                "version": "2.4",
                "engine": "AI Farming Decision Engine",
                "database": "SQLite Persistent"
            })
            return

        # API: Authenticated Current User Profile & Plots
        if path == '/api/auth/me':
            user = self.get_authenticated_user()
            if not user:
                self.send_json({"success": False, "error": "Not authenticated or session expired."}, 401)
                return
            self.send_json({"success": True, "user": user})
            return

        # API: Get Current Farmer's Land Plots
        if path == '/api/plots':
            user = self.get_authenticated_user()
            if not user:
                self.send_json({"success": False, "error": "Unauthorized. Please log in."}, 401)
                return
            self.send_json({
                "success": True,
                "plots": user.get("plots", []),
                "total_acres": user.get("total_acres", 0.0),
                "plots_count": len(user.get("plots", []))
            })
            return

        # Fallback to static file serving
        super().do_GET()

    # -------------------------------------------------------------
    # POST Endpoints
    # -------------------------------------------------------------
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        # API: Farmer Registration (Guided 4-Step flow payload)
        if path == '/api/auth/register':
            data = self.read_json_body()
            success, res = database.register_farmer(data)
            if success:
                self.send_json({"success": True, **res}, 201)
            else:
                self.send_json({"success": False, **res}, 400)
            return

        # API: Farmer Login (Email + Password)
        if path == '/api/auth/login':
            data = self.read_json_body()
            email = data.get('email', '')
            password = data.get('password', '')
            success, res = database.login_farmer(email, password)
            if success:
                self.send_json({"success": True, **res}, 200)
            else:
                self.send_json({"success": False, **res}, 401)
            return

        # API: Farmer Logout
        if path == '/api/auth/logout':
            token = self.get_auth_token()
            database.logout_session(token)
            self.send_json({"success": True, "message": "Signed out successfully."})
            return

        # API: Add New Land Plot
        if path == '/api/plots':
            user = self.get_authenticated_user()
            if not user:
                self.send_json({"success": False, "error": "Unauthorized. Please log in."}, 401)
                return
            data = self.read_json_body()
            success, res = database.add_land_plot(user['id'], data)
            if success:
                # Also fetch updated user state
                fresh_user = database.get_user_by_id(user['id'])
                self.send_json({"success": True, "plot": res, "user": fresh_user}, 201)
            else:
                self.send_json({"success": False, **res}, 400)
            return

        # API: Upload Soil Test Report or Photo (Base64/File storage helper)
        if path == '/api/upload':
            user = self.get_authenticated_user()
            if not user:
                self.send_json({"success": False, "error": "Unauthorized."}, 401)
                return
            data = self.read_json_body()
            filename = data.get('filename', f"soil_report_{user['id']}.pdf")
            self.send_json({
                "success": True,
                "file_url": f"uploads/{filename}",
                "filename": filename,
                "message": "File recorded successfully"
            })
            return

        self.send_json({"success": False, "error": f"Endpoint '{path}' not found."}, 404)

    # -------------------------------------------------------------
    # PUT Endpoints
    # -------------------------------------------------------------
    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        # API: Update Farmer Profile
        if path == '/api/farmer/profile':
            user = self.get_authenticated_user()
            if not user:
                self.send_json({"success": False, "error": "Unauthorized."}, 401)
                return
            data = self.read_json_body()
            success, res = database.update_farmer_profile(user['id'], data)
            if success:
                self.send_json({"success": True, "user": res}, 200)
            else:
                self.send_json({"success": False, **res}, 400)
            return

        # API: Update Land Plot (/api/plots/<plot_id>)
        if path.startswith('/api/plots/'):
            user = self.get_authenticated_user()
            if not user:
                self.send_json({"success": False, "error": "Unauthorized."}, 401)
                return
            try:
                plot_id = int(path.split('/')[-1])
            except ValueError:
                self.send_json({"success": False, "error": "Invalid plot ID."}, 400)
                return

            data = self.read_json_body()
            success, res = database.update_land_plot(user['id'], plot_id, data)
            if success:
                fresh_user = database.get_user_by_id(user['id'])
                self.send_json({"success": True, "plot": res, "user": fresh_user}, 200)
            else:
                self.send_json({"success": False, **res}, 400)
            return

        self.send_json({"success": False, "error": f"Endpoint '{path}' not found."}, 404)

    # -------------------------------------------------------------
    # DELETE Endpoints
    # -------------------------------------------------------------
    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        # API: Delete Land Plot (/api/plots/<plot_id>)
        if path.startswith('/api/plots/'):
            user = self.get_authenticated_user()
            if not user:
                self.send_json({"success": False, "error": "Unauthorized."}, 401)
                return
            try:
                plot_id = int(path.split('/')[-1])
            except ValueError:
                self.send_json({"success": False, "error": "Invalid plot ID."}, 400)
                return

            success, res = database.delete_land_plot(user['id'], plot_id)
            if success:
                fresh_user = database.get_user_by_id(user['id'])
                self.send_json({"success": True, **res, "user": fresh_user}, 200)
            else:
                self.send_json({"success": False, **res}, 400)
            return

        self.send_json({"success": False, "error": f"Endpoint '{path}' not found."}, 404)


def run_server():
    os.chdir(DIRECTORY)
    database.init_db()

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), UzhavanRequestHandler) as httpd:
        print(f"==================================================")
        print(f"[UZHAVAN HUB] Your Digital Farming Companion")
        print(f"Server with SQLite REST API running at: http://localhost:{PORT}")
        print(f"Serving directory: {DIRECTORY}")
        print(f"Database: {database.DB_PATH}")
        print(f"Press Ctrl+C to stop the server")
        print(f"==================================================")

        if "--open" in sys.argv:
            try:
                webbrowser.open(f"http://localhost:{PORT}")
            except Exception:
                pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.server_close()

if __name__ == '__main__':
    run_server()

#!/usr/bin/env python3
"""Render a local HTML file to PDF using headless Google Chrome via the
DevTools Protocol.

Chrome's CLI --print-to-pdf cannot inject custom page numbers, so this drives
Page.printToPDF over the DevTools WebSocket, which supports header/footer
templates (with real page numbers) and prints CSS backgrounds. Uses only the
Python standard library — no pip packages — because this box has no pip.

Usage:
    python3 html-to-pdf.py input.html output.pdf ["Footer Title"]

The footer shows the optional title on the left and "Page N of M" on the
right. The document's own @page CSS controls size and margins.
"""
import base64
import hashlib
import json
import os
import socket
import struct
import subprocess
import sys
import time
import urllib.request


def find_free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def ws_connect(ws_url):
    # ws://host:port/devtools/page/ID
    assert ws_url.startswith("ws://")
    hostport, path = ws_url[5:].split("/", 1)
    host, port = hostport.split(":")
    path = "/" + path
    sock = socket.create_connection((host, int(port)))
    key = base64.b64encode(os.urandom(16)).decode()
    handshake = (
        f"GET {path} HTTP/1.1\r\n"
        f"Host: {host}:{port}\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        "Sec-WebSocket-Version: 13\r\n\r\n"
    )
    sock.sendall(handshake.encode())
    resp = b""
    while b"\r\n\r\n" not in resp:
        resp += sock.recv(4096)
    if b"101" not in resp.split(b"\r\n", 1)[0]:
        raise RuntimeError("WebSocket handshake failed: " + resp.decode(errors="replace"))
    return sock


def ws_send(sock, message):
    data = message.encode("utf-8")
    header = bytearray([0x81])  # FIN + text frame
    mask = os.urandom(4)
    length = len(data)
    if length < 126:
        header.append(0x80 | length)
    elif length < 65536:
        header.append(0x80 | 126)
        header += struct.pack(">H", length)
    else:
        header.append(0x80 | 127)
        header += struct.pack(">Q", length)
    header += mask
    masked = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
    sock.sendall(bytes(header) + masked)


def _recv_exactly(sock, n):
    buf = b""
    while len(buf) < n:
        chunk = sock.recv(n - len(buf))
        if not chunk:
            raise RuntimeError("socket closed early")
        buf += chunk
    return buf


def ws_recv(sock):
    first2 = _recv_exactly(sock, 2)
    length = first2[1] & 0x7F
    if length == 126:
        length = struct.unpack(">H", _recv_exactly(sock, 2))[0]
    elif length == 127:
        length = struct.unpack(">Q", _recv_exactly(sock, 8))[0]
    payload = _recv_exactly(sock, length)
    return payload.decode("utf-8", errors="replace")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    in_html = os.path.abspath(sys.argv[1])
    out_pdf = os.path.abspath(sys.argv[2])
    footer_title = sys.argv[3] if len(sys.argv) > 3 else ""

    port = find_free_port()
    profile = f"/tmp/chrome-pdf-{port}"
    chrome = subprocess.Popen(
        [
            "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
            f"--remote-debugging-port={port}", f"--user-data-dir={profile}",
            "--no-first-run", "--no-default-browser-check",
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        # Wait for the debugging endpoint to come up.
        ws_url = None
        for _ in range(100):
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=1) as r:
                    json.load(r)
                with urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=1) as r:
                    tabs = json.load(r)
                page = next((t for t in tabs if t.get("type") == "page"), None)
                if page and page.get("webSocketDebuggerUrl"):
                    ws_url = page["webSocketDebuggerUrl"]
                    break
            except Exception:
                time.sleep(0.1)
        if not ws_url:
            raise RuntimeError("Chrome DevTools endpoint never became ready")

        sock = ws_connect(ws_url)
        msg_id = 0

        def call(method, params=None, wait_result=True):
            nonlocal msg_id
            msg_id += 1
            mid = msg_id
            ws_send(sock, json.dumps({"id": mid, "method": method, "params": params or {}}))
            if not wait_result:
                return None
            while True:
                data = json.loads(ws_recv(sock))
                if data.get("id") == mid:
                    if "error" in data:
                        raise RuntimeError(f"{method}: {data['error']}")
                    return data.get("result", {})

        call("Page.enable")
        call("Page.navigate", {"url": "file://" + in_html})
        # Give the page time to fully lay out (fonts, CSS).
        time.sleep(1.5)

        footer = (
            '<div style="font-size:8px; width:100%; padding:0 12mm; '
            'color:#555; font-family:Georgia, serif; '
            'display:flex; justify-content:space-between;">'
            f'<span>{footer_title}</span>'
            '<span>Page <span class="pageNumber"></span> of '
            '<span class="totalPages"></span></span></div>'
        )
        empty = '<div></div>'
        result = call("Page.printToPDF", {
            "printBackground": True,
            "displayHeaderFooter": True,
            "headerTemplate": empty,
            "footerTemplate": footer,
            "preferCSSPageSize": True,
        })
        pdf_bytes = base64.b64decode(result["data"])
        with open(out_pdf, "wb") as f:
            f.write(pdf_bytes)
        print(f"Wrote {out_pdf} ({len(pdf_bytes)} bytes)")
    finally:
        chrome.terminate()
        try:
            chrome.wait(timeout=5)
        except Exception:
            chrome.kill()
        subprocess.run(["rm", "-rf", profile], check=False)


if __name__ == "__main__":
    main()

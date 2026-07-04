"""Network scanner service"""
import socket
import subprocess
import re
from urllib.parse import urlparse
from typing import Dict, List, Any


class NetworkScanner:
    """Performs actual network scanning on target systems"""

    def scan(self, target: str) -> Dict[str, Any]:
        """
        Scan a target IP or domain for open ports, services, and OS detection.

        Returns:
            dict with keys: open_ports, services, os_info, raw_output
        """
        open_ports = []
        services = []
        os_info = "Unknown"
        raw_output = ""
        domain = ""

        # Resolve domain if target is a domain
        try:
            if re.match(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', target):
                domain = target
                target = socket.gethostbyname(target)
        except socket.gaierror:
            pass

        # If target is not a valid IP at this point, return empty result
        try:
            socket.inet_aton(target)
        except socket.error:
            return {
                "target": target,
                "open_ports": [],
                "services": [],
                "os": os_info,
                "error": "Invalid target"
            }

        # Try to detect OS using ping (TTL heuristics)
        try:
            ping_out = subprocess.run(
                ["ping", "-n", "1", target],
                capture_output=True,
                text=True,
                timeout=5
            ).stdout
            ttl_match = re.search(r'TTL=(\d+)', ping_out)
            if ttl_match:
                ttl = int(ttl_match.group(1))
                if ttl >= 128:
                    os_info = "Windows (TTL ~128)"
                elif ttl >= 64:
                    os_info = "Linux/Unix (TTL ~64)"
        except Exception:
            pass

        # Perform port scan on common ports
        common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 993, 995, 3306, 3389, 5432, 5900, 8080, 8443]
        for port in common_ports:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1.0)
                result = sock.connect_ex((target, port))
                if result == 0:
                    open_ports.append(port)
                    try:
                        service = socket.getservbyport(port, 'tcp')
                    except OSError:
                        service = "unknown"
                    services.append({"port": port, "service": service})
                sock.close()
            except Exception:
                pass

        return {
            "target": domain or target,
            "ip": target,
            "open_ports": open_ports,
            "services": services,
            "os": os_info,
            "status": "completed"
        }
"""Network scanner service - nmap-style scanning"""
import socket
import subprocess
import re
import sys
from typing import Dict, List, Any


class NetworkScanner:
    """Performs nmap-style network scanning on target systems"""

    def scan(self, target: str, scan_type: str = 'full') -> Dict[str, Any]:
        """
        Scan a target IP or domain for open ports, services, OS detection.
        
        Args:
            target: IP address or domain
            scan_type: 'full', 'quick', 'ports', 'service'
            
        Returns:
            dict with keys: open_ports, services, os_info, raw_output
        """
        open_ports = []
        services = []
        os_info = "Unknown"
        raw_output = ""
        domain = ""
        resolved_ip = target

        # Resolve domain if target is a domain
        try:
            if re.match(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', target):
                domain = target
                resolved_ip = socket.gethostbyname(target)
        except socket.gaierror:
            pass

        # Validate IP (allow any valid IP format)
        try:
            socket.inet_aton(resolved_ip)
        except socket.error:
            return {
                "target": target,
                "ip": resolved_ip,
                "open_ports": [],
                "services": [],
                "os": os_info,
                "error": "Invalid target"
            }

        # Define port sets based on scan_type
        if scan_type == 'all':
            ports = list(range(1, 65536))
        elif scan_type == 'quick':
            ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3389, 8080]
        elif scan_type == 'ports':
            ports = list(range(1, 1025))
        elif scan_type == 'service':
            ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 993, 995, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 27017]
        else:  # full
            # Scan top 1000 most common ports for full scan to ensure it completes reliably and fast
            ports = [
                20, 21, 22, 23, 25, 53, 67, 68, 69, 80, 110, 111, 119, 123, 135, 137, 138, 139, 143, 161, 162, 179, 389,
                443, 445, 465, 514, 515, 548, 554, 587, 631, 636, 873, 990, 993, 995, 1025, 1026, 1027, 1080, 1194, 1433,
                1434, 1521, 1723, 1812, 1813, 1900, 2000, 2049, 2082, 2083, 2086, 2087, 2095, 2096, 2100, 2222, 2375, 2376,
                3000, 3128, 3268, 3306, 3307, 3389, 3690, 4000, 4444, 4567, 4848, 5000, 5060, 5061, 5432, 5555, 5631, 5672,
                5900, 5901, 5984, 5985, 5986, 6000, 6379, 7000, 7001, 7077, 8000, 8008, 8080, 8081, 8088, 8443, 8888, 9000,
                9090, 9092, 9200, 9300, 9418, 9999, 11211, 27017, 27018, 27019, 50000, 50030, 50070
            ]

        # Try nmap if available (more powerful)
        try:
            results = self._scan_with_nmap(resolved_ip, scan_type)
            if results:
                return results
        except Exception:
            pass  # Fall back to Python scanner

        # Fallback: Python socket scanner
        open_ports, services = self._scan_ports_python(resolved_ip, ports, scan_type)
        
        # OS Detection via TTL and banner analysis
        os_info = self._detect_os(resolved_ip, open_ports, services, scan_type)

        return {
            "target": domain or target,
            "ip": resolved_ip,
            "open_ports": open_ports,
            "services": services,
            "os": os_info,
            "status": "completed"
        }

    def _scan_with_nmap(self, target: str, scan_type: str) -> Dict[str, Any]:
        """Use nmap if available for advanced scanning"""
        try:
            # Build nmap arguments based on scan_type
            if scan_type == 'quick':
                args = ['nmap', '-sT', '-T4', '--top-ports', '20', '-sV', '-O', target]
            elif scan_type == 'ports':
                args = ['nmap', '-sT', '-T4', '-p', '1-1024', '-sV', target]
            elif scan_type == 'service':
                args = ['nmap', '-sT', '-T4', '-p', '21,22,23,25,53,80,110,143,443,445,993,995,3306,3389,5432,5900,6379,8080,8443,27017', '-sV', '-O', target]
            else:  # full
                args = ['nmap', '-sT', '-T4', '-sV', '-O', '--version-intensity', '5', target]

            result = subprocess.run(args, capture_output=True, text=True, timeout=300)
            raw_output = result.stdout
            
            # Parse nmap output
            open_ports = []
            services = []
            os_info = "Unknown"
            
            # Extract ports and services
            port_pattern = re.compile(r'(\d+)/tcp\s+(\w+)\s+(\S+)')
            for match in port_pattern.finditer(result.stdout):
                port = int(match.group(1))
                state = match.group(2)
                service = match.group(3)
                if state == 'open':
                    open_ports.append(port)
                    services.append({"port": port, "service": service})
            
            # Extract OS detection
            os_pattern = re.compile(r'OS details: (.+)')
            os_match = os_pattern.search(result.stdout)
            if os_match:
                os_info = os_match.group(1).strip()
            else:
                ttl_pattern = re.compile(r'TTL=(\d+)')
                ttl_match = ttl_pattern.search(result.stdout)
                if ttl_match:
                    ttl = int(ttl_match.group(1))
                    if ttl >= 128:
                        os_info = "Windows (TTL ~128)"
                    elif ttl >= 64:
                        os_info = "Linux/Unix (TTL ~64)"
            
            return {
                "target": target,
                "ip": target,
                "open_ports": sorted(open_ports),
                "services": services,
                "os": os_info,
                "raw_output": raw_output,
                "status": "completed"
            }
        except FileNotFoundError:
            return {}  # nmap not installed
        except Exception:
            return {}  # nmap failed, fallback to Python

    def _scan_ports_python(self, target: str, ports: List[int], scan_type: str) -> tuple:
        """Fallback Python port scanner with banner grabbing"""
        open_ports = []
        services = []
        timeout = 1.0 if scan_type == 'quick' else 2.0

        for port in ports:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(timeout)
                result = sock.connect_ex((target, port))
                if result == 0:
                    open_ports.append(port)
                    service_name = "unknown"
                    banner = ""
                    
                    # Get service name
                    try:
                        service_name = socket.getservbyport(port, 'tcp')
                    except (OSError, socket.error):
                        pass
                    
                    # Try banner grabbing for service detection
                    try:
                        if port in [80, 443, 21, 22, 25, 110, 143, 993, 995, 3306, 5432, 6379, 27017]:
                            banner = self._grab_banner(target, port)
                            if banner:
                                service_name = self._parse_banner(banner, port)
                    except Exception:
                        pass
                    
                    services.append({
                        "port": port, 
                        "service": service_name,
                        "banner": banner[:200] if banner else ""
                    })
                sock.close()
            except Exception:
                pass

        return open_ports, services

    def _grab_banner(self, target: str, port: int) -> str:
        """Grab service banner for identification"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(3.0)
            sock.connect((target, port))
            
            # Send appropriate probe based on port
            if port == 80:
                sock.send(b"HEAD / HTTP/1.0\r\n\r\n")
            elif port == 21:
                pass  # FTP sends banner automatically
            elif port == 25:
                pass  # SMTP sends banner automatically
            elif port == 22:
                pass  # SSH sends banner automatically
            elif port == 110:
                pass  # POP3 sends banner automatically
            elif port == 143:
                pass  # IMAP sends banner automatically
            else:
                sock.send(b"\r\n")
            
            banner = sock.recv(1024).decode('utf-8', errors='ignore').strip()
            sock.close()
            return banner
        except Exception:
            return ""

    def _parse_banner(self, banner: str, port: int) -> str:
        """Parse banner to identify service"""
        banner_lower = banner.lower()
        
        if 'http' in banner_lower or 'server:' in banner_lower:
            if 'nginx' in banner_lower:
                return 'nginx'
            elif 'apache' in banner_lower:
                return 'apache'
            elif 'iis' in banner_lower:
                return 'iis'
            elif 'gunicorn' in banner_lower:
                return 'gunicorn'
            elif 'node.js' in banner_lower or 'express' in banner_lower:
                return 'nodejs'
            else:
                return 'http'
        
        if 'ssh' in banner_lower:
            if 'openssh' in banner_lower:
                version = re.search(r'openssh[_/](\d+\.\d+)', banner_lower)
                return f'ssh (OpenSSH {version.group(1) if version else ""})'.strip()
            return 'ssh'
        
        if 'ftp' in banner_lower:
            if 'vsftpd' in banner_lower:
                return 'vsftpd'
            elif 'proftpd' in banner_lower:
                return 'proftpd'
            return 'ftp'
        
        if 'smtp' in banner_lower:
            if 'postfix' in banner_lower:
                return 'postfix'
            elif 'exchange' in banner_lower:
                return 'exchange'
            return 'smtp'
        
        if 'mysql' in banner_lower:
            return 'mysql'
        
        if 'postgresql' in banner_lower:
            return 'postgresql'
        
        if 'redis' in banner_lower:
            return 'redis'
        
        if 'mongodb' in banner_lower:
            return 'mongodb'
        
        if port == 3306:
            return 'mysql'
        elif port == 5432:
            return 'postgresql'
        elif port == 6379:
            return 'redis'
        elif port == 27017:
            return 'mongodb'
        elif port == 3389:
            return 'rdp'
        elif port == 5900:
            return 'vnc'
        
        return "unknown"

    def _detect_os(self, target: str, open_ports: List[int], services: List[Dict], scan_type: str) -> str:
        """Detect OS using multiple techniques"""
        os_info = "Unknown"
        
        # Only do OS detection for full and quick scans
        if scan_type not in ['full', 'quick']:
            return os_info
        
        # Technique 1: TTL analysis via ping
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
                elif ttl >= 255:
                    os_info = "Cisco/Network Device (TTL ~255)"
                elif ttl >= 30:
                    os_info = "Unknown (TTL-based)"
        except Exception:
            pass
        
        # Technique 2: Banner-based OS detection
        for svc in services:
            banner = svc.get('banner', '').lower()
            if 'windows' in banner or 'microsoft' in banner:
                os_info = "Windows"
                break
            elif 'linux' in banner or 'ubuntu' in banner or 'debian' in banner or 'centos' in banner or 'rhel' in banner:
                os_info = "Linux"
                break
            elif 'unix' in banner:
                os_info = "Unix-like"
                break
        
        # Technique 3: Port-based heuristics
        if os_info == "Unknown":
            if 3389 in open_ports:
                os_info = "Windows (RDP open)"
            elif 5900 in open_ports and 22 not in open_ports:
                os_info = "Likely Windows (VNC without SSH)"
            elif 22 in open_ports and 3389 not in open_ports:
                os_info = "Linux/Unix (SSH open)"
            elif 5960 in [s['port'] for s in services]:
                os_info = "Likely Windows"
        
        return os_info
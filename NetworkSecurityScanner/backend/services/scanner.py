"""Network scanner service"""
import socket
import logging
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)

class NetworkScanner:
    """Performs network scanning on target IP addresses"""

    def __init__(self):
        self.open_ports = []
        self.services = []
        self.timeout = 2

    def scan(self, target_ip: str, port_range: Tuple[int, int] = (1, 1024)) -> Dict:
        """
        Scan a target IP for open ports and services
        
        Args:
            target_ip: Target IP address to scan
            port_range: Tuple of (start_port, end_port)
        
        Returns:
            Dictionary with scan results
        """
        logger.info(f"Starting scan on {target_ip}")
        
        if not self._validate_ip(target_ip):
            logger.warning(f"Invalid IP address: {target_ip}")
            return {
                'target_ip': target_ip,
                'open_ports': [],
                'services': [],
                'timestamp': None,
                'error': 'Invalid IP address',
            }

        results = {
            'target_ip': target_ip,
            'open_ports': [],
            'services': [],
            'timestamp': None,
        }

        start_port = max(1, port_range[0])
        end_port = min(65535, port_range[1])

        for port in range(start_port, end_port + 1):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(self.timeout)
                result = sock.connect_ex((target_ip, port))
                
                if result == 0:
                    try:
                        service = socket.getservbyport(port)
                    except (OSError, socket.error):
                        service = 'Unknown'
                    
                    results['open_ports'].append(port)
                    results['services'].append({'port': port, 'service': service})
                
                sock.close()
            except (socket.timeout, socket.gaierror, socket.herror, OSError) as e:
                logger.debug(f"Error scanning port {port}: {str(e)}")
                continue
            except Exception as e:
                logger.error(f"Unexpected error scanning port {port}: {str(e)}")
                continue

        logger.info(f"Scan completed for {target_ip}: {len(results['open_ports'])} ports open")
        return results

    def scan_services(self, target_ip: str, ports: List[int]) -> List[Dict]:
        """Scan specific ports for service identification"""
        services = []
        for port in ports:
            try:
                service = socket.getservbyport(port)
                services.append({'port': port, 'service': service})
            except (OSError, socket.error):
                services.append({'port': port, 'service': 'Unknown'})
        
        return services

    def _validate_ip(self, ip: str) -> bool:
        """Validate IP address format"""
        try:
            parts = ip.split('.')
            if len(parts) != 4:
                return False
            for part in parts:
                num = int(part)
                if num < 0 or num > 255:
                    return False
            return True
        except (ValueError, AttributeError):
            return False

"""Scans app Celery tasks"""
from celery import shared_task
from datetime import datetime
from .models import Scan, ScanResult
import logging
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def run_scan_task(self, scan_id):
    """
    Run a network scan asynchronously
    """
    try:
        scan = Scan.objects.get(id=scan_id)
        scan.status = 'in_progress'
        scan.started_at = datetime.now()
        scan.save()

        # Import services here to avoid circular imports
        from services.scanner import NetworkScanner
        from services.vulnerability_detector import VulnerabilityDetector

        scanner = NetworkScanner()
        results = scanner.scan(scan.target_ip)

        detector = VulnerabilityDetector()
        vulnerabilities = detector.detect(results)

        scan_result, created = ScanResult.objects.get_or_create(scan=scan)
        scan_result.open_ports = results.get('open_ports', [])
        scan_result.services = results.get('services', [])
        scan_result.vulnerabilities_found = len(vulnerabilities)
        scan_result.scan_data = results
        scan_result.save()

        scan.status = 'completed'
        scan.completed_at = datetime.now()
        scan.save()

        logger.info(f"Scan {scan_id} completed successfully")

    except Scan.DoesNotExist:
        logger.error(f"Scan with id {scan_id} not found")
    except Exception as e:
        logger.error(f"Scan task failed for scan {scan_id}: {str(e)}")
        try:
            scan = Scan.objects.get(id=scan_id)
            scan.status = 'failed'
            scan.completed_at = datetime.now()
            scan.save()
        except:
            pass
        # Retry the task
        raise self.retry(exc=e, countdown=60)

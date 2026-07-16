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
        results = scanner.scan(scan.target_ip, scan.scan_type)

        detector = VulnerabilityDetector()
        vulnerabilities = detector.detect(results)

        # Save vulnerabilities to the database
        from apps.vulnerabilities.models import Vulnerability
        # Clear any existing vulnerabilities for this scan to avoid duplicates
        Vulnerability.objects.filter(scan=scan).delete()
        for v in vulnerabilities:
            Vulnerability.objects.create(
                scan=scan,
                title=v.get('name', 'Vulnerability'),
                description=v.get('description', ''),
                severity=v.get('severity', 'info').lower(),
                port=v.get('port', 0),
                affected_service=results.get('services', [{}])[0].get('service', 'unknown') if results.get('services') else 'unknown',
                remediation=v.get('recommendation', '')
            )

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


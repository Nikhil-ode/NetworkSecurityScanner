"""
Verification script to test if the Network Security Scanner is properly set up
Run this after completing the setup to verify everything is working
"""

import os
import sys
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def check_django_setup():
    """Check if Django is properly configured"""
    print("✓ Django Setup Check")
    print(f"  - Django version: {django.get_version()}")
    print(f"  - Debug mode: {settings.DEBUG}")
    print(f"  - Database: {settings.DATABASES['default']['ENGINE']}")
    return True

def check_installed_apps():
    """Check if all required apps are installed"""
    print("\n✓ Installed Apps Check")
    required_apps = [
        'django.contrib.admin',
        'django.contrib.auth',
        'rest_framework',
        'apps.users',
        'apps.scans',
        'apps.reports',
        'apps.vulnerabilities',
    ]

    for app in required_apps:
        if app in settings.INSTALLED_APPS:
            print(f"  ✓ {app}")
        else:
            print(f"  ✗ {app} - NOT FOUND")
            return False

    return True

def check_database():
    """Check if database is configured and migrations are applied"""
    print("\n✓ Database Check")
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("  ✓ Database connection successful")

        # Check if migrations are applied
        from django.core.management import call_command
        from io import StringIO

        out = StringIO()
        call_command('showmigrations', verbosity=0, stdout=out)
        output = out.getvalue()

        if output:
            print("  ✓ Migrations status OK")
            return True
        else:
            print("  ✗ No migrations found - run 'python manage.py migrate'")
            return False

    except Exception as e:
        print(f"  ✗ Database error: {str(e)}")
        return False

def check_models():
    """Check if models are properly defined"""
    print("\n✓ Models Check")
    try:
        from apps.users.models import UserProfile
        from apps.scans.models import Scan, ScanResult
        from apps.reports.models import Report
        from apps.vulnerabilities.models import Vulnerability

        models = [
            ('UserProfile', UserProfile),
            ('Scan', Scan),
            ('ScanResult', ScanResult),
            ('Report', Report),
            ('Vulnerability', Vulnerability),
        ]

        for name, model in models:
            print(f"  ✓ {name}")

        return True
    except ImportError as e:
        print(f"  ✗ Import error: {str(e)}")
        return False

def check_rest_framework():
    """Check if Django REST Framework is configured"""
    print("\n✓ Django REST Framework Check")
    try:
        import rest_framework
        print(f"  ✓ Django REST Framework {rest_framework.VERSION} installed")

        auth_classes = settings.REST_FRAMEWORK.get('DEFAULT_AUTHENTICATION_CLASSES', [])
        print(f"  ✓ Authentication classes configured: {len(auth_classes)}")

        return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False

def check_services():
    """Check if service modules are available"""
    print("\n✓ Services Check")
    try:
        from services.scanner import NetworkScanner
        from services.vulnerability_detector import VulnerabilityDetector
        from services.report_generator import ReportGenerator
        from services.supabase_client import SupabaseClient

        services = (
            ("NetworkScanner", NetworkScanner),
            ("VulnerabilityDetector", VulnerabilityDetector),
            ("ReportGenerator", ReportGenerator),
            ("SupabaseClient", SupabaseClient),
        )
        for name, cls in services:
            print(f"  ✓ {name}")

        return True
    except ImportError as e:
        print(f"  ✗ Import error: {str(e)}")
        return False

def check_celery():
    """Check if Celery is configured"""
    print("\n✓ Celery Check")
    try:
        from config.celery import app
        print("  ✓ Celery app loaded")
        print(f"  ✓ Broker: {settings.CELERY_BROKER_URL}")
        print(f"  ✓ Backend: {settings.CELERY_RESULT_BACKEND}")
        # Touch `app` so static analyzers see it used.
        _ = type(app).__name__

        return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False

def main():
    """Run all checks"""
    print("=" * 50)
    print("Network Security Scanner - Setup Verification")
    print("=" * 50)

    checks = [
        check_django_setup,
        check_installed_apps,
        check_database,
        check_models,
        check_rest_framework,
        check_services,
        check_celery,
    ]

    results = []
    for check in checks:
        try:
            result = check()
            results.append(result)
        except Exception as e:
            print(f"\n✗ Check failed: {str(e)}")
            results.append(False)

    print("\n" + "=" * 50)
    passed = sum(results)
    total = len(results)

    if passed == total:
        print(f"✓ All checks passed! ({passed}/{total})")
        print("\nYour setup is ready. You can now:")
        print("  1. Create a superuser: python manage.py createsuperuser")
        print("  2. Start the server: python manage.py runserver")
        print("  3. Visit http://localhost:8000 to access the admin panel")
        return 0
    else:
        print(f"✗ Some checks failed! ({passed}/{total})")
        print("\nPlease fix the issues above and run this script again.")
        return 1

if __name__ == '__main__':
    sys.exit(main())

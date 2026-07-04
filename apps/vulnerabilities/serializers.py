"""Vulnerabilities app serializers"""
from rest_framework import serializers
from .models import Vulnerability

class VulnerabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vulnerability
        fields = ('id', 'scan', 'title', 'description', 'severity', 'cve_id',
                  'affected_service', 'port', 'remediation', 'discovered_at')

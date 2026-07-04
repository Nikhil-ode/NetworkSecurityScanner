"""Scans app serializers"""
from rest_framework import serializers
from .models import Scan, ScanResult

class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = ('id', 'target_ip', 'target_domain', 'status', 'scan_type', 
                  'started_at', 'completed_at', 'created_at', 'updated_at')

class ScanResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanResult
        fields = ('id', 'scan', 'open_ports', 'services', 'vulnerabilities_found', 'scan_data')

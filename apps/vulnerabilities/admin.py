"""Vulnerabilities app admin"""
from django.contrib import admin
from .models import Vulnerability

@admin.register(Vulnerability)
class VulnerabilityAdmin(admin.ModelAdmin):
    list_display = ('title', 'severity', 'scan', 'port', 'cve_id', 'discovered_at')
    list_filter = ('severity', 'discovered_at')
    search_fields = ('title', 'cve_id', 'affected_service', 'scan__target_ip')
    readonly_fields = ('discovered_at',)

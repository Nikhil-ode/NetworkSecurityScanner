"""Scans app admin"""
from django.contrib import admin
from .models import Scan, ScanResult

@admin.register(Scan)
class ScanAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'target_ip', 'status', 'scan_type', 'created_at', 'completed_at')
    list_filter = ('status', 'scan_type', 'created_at')
    search_fields = ('target_ip', 'target_domain', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ScanResult)
class ScanResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'scan', 'vulnerabilities_found', 'created_at')
    readonly_fields = ('created_at', 'updated_at')

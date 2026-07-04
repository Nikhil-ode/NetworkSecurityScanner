"""Reports app admin"""
from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'scan', 'user', 'format', 'created_at')
    list_filter = ('format', 'created_at')
    search_fields = ('title', 'scan__target_ip', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

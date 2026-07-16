"""Scans app models"""
from django.db import models
from django.contrib.auth.models import User

class Scan(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scans')
    target_ip = models.CharField(max_length=255)
    target_domain = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    scan_type = models.CharField(max_length=50, default='full')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Scan {self.id} - {self.target_ip}"

class ScanResult(models.Model):
    scan = models.OneToOneField(Scan, on_delete=models.CASCADE, related_name='result')
    open_ports = models.JSONField(default=list, null=True, blank=True)
    services = models.JSONField(default=list, null=True, blank=True)
    vulnerabilities_found = models.IntegerField(default=0)
    scan_data = models.JSONField(default=dict, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Result for Scan {self.scan.id}"

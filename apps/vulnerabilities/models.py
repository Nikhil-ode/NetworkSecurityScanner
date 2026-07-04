"""Vulnerabilities app models"""
from django.db import models

class Vulnerability(models.Model):
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('info', 'Info'),
    ]

    scan = models.ForeignKey('scans.Scan', on_delete=models.CASCADE, related_name='vulnerabilities')
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    cve_id = models.CharField(max_length=50, blank=True)
    affected_service = models.CharField(max_length=255)
    port = models.IntegerField()
    remediation = models.TextField(blank=True)
    discovered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-discovered_at']

    def __str__(self):
        return f"{self.title} ({self.severity})"

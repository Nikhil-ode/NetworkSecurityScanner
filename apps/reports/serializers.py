"""Reports app serializers"""
from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ('id', 'scan', 'title', 'description', 'format', 'file_path', 'created_at', 'updated_at')

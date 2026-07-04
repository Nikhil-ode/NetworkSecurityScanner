"""Vulnerabilities app views"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Vulnerability
from .serializers import VulnerabilitySerializer

class VulnerabilityViewSet(viewsets.ModelViewSet):
    serializer_class = VulnerabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vulnerability.objects.filter(scan__user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_severity(self, request):
        severity = request.query_params.get('severity')
        queryset = self.get_queryset()
        if severity:
            queryset = queryset.filter(severity=severity)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

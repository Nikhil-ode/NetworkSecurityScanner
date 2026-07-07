"""Scans app views"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Scan, ScanResult
from .serializers import ScanSerializer, ScanResultSerializer
from .tasks import run_scan_task
import logging

logger = logging.getLogger(__name__)

class ScanViewSet(viewsets.ModelViewSet):
    serializer_class = ScanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Scan.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        try:
            scan = serializer.save(user=self.request.user, status='pending')
            # Schedule the scan task
            try:
                run_scan_task.delay(scan.id)
                logger.info(f"Scan {scan.id} created and scheduled for user {self.request.user.username}")
            except Exception as celery_error:
                logger.warning(f"Celery not available, running scan synchronously: {celery_error}")
                scan.status = 'in_progress'
                scan.save()
                run_scan_task(scan.id)
                logger.info(f"Scan {scan.id} completed synchronously")
        except Exception as e:
            logger.error(f"Error creating scan: {str(e)}")
            raise

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error retrieving scan: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        try:
            scan = self.get_object()
            if scan.status in ['in_progress', 'completed']:
                return Response(
                    {'error': f'Cannot start scan with status {scan.status}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            run_scan_task.delay(scan.id)
            return Response({'status': 'Scan started'})
        except Scan.DoesNotExist:
            return Response({'error': 'Scan not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error starting scan: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ScanResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ScanResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScanResult.objects.filter(scan__user=self.request.user)

from rest_framework import generics, permissions
from .models import Notification
from .serializers import NotificationSerializer


class MyNotificationsView(generics.ListAPIView):
    """See your own notifications, newest first."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class MarkNotificationReadView(generics.UpdateAPIView):
    """Mark a single notification as read."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def perform_update(self, serializer):
        serializer.save(is_read=True)
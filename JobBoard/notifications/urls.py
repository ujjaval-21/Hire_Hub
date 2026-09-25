from django.urls import path
from .views import MyNotificationsView, MarkNotificationReadView

urlpatterns = [
    path('', MyNotificationsView.as_view(), name='my-notifications'),
    path('<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
]
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse
from django.conf import settings

def debug_settings(request):
    return JsonResponse({
        'ALLOWED_HOSTS': settings.ALLOWED_HOSTS,
        'DEBUG': settings.DEBUG,
        'CORS_ALLOWED_ORIGINS': settings.CORS_ALLOWED_ORIGINS,
    })

urlpatterns = [
    path('debug-settings/', debug_settings),
    path('admin/', admin.site.urls),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('users.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/applications/', include('applications.urls')),
    path('api/notifications/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


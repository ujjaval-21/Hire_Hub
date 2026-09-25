from django.urls import path
from .views import (
    JobListCreateView, JobDetailView, MyJobListingsView,
    PublicJobStatsView, SavedJobListCreateView, SavedJobDeleteView,
)

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path('mine/', MyJobListingsView.as_view(), name='my-jobs'),
    path('stats/', PublicJobStatsView.as_view(), name='public-job-stats'),
    path('saved/', SavedJobListCreateView.as_view(), name='saved-jobs'),
    path('saved/<int:job_id>/', SavedJobDeleteView.as_view(), name='unsave-job'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
]
from django.urls import path
from .views import (
    ResumeUploadView, ApplyForJobView, MyApplicationsView,
    JobApplicationsView, ApplicationStatusUpdateView, MyStatsView, RecentApplicantsView,
)


urlpatterns = [
    path('resumes/', ResumeUploadView.as_view(), name='resume-upload'),
    path('apply/', ApplyForJobView.as_view(), name='apply-job'),
    path('mine/', MyApplicationsView.as_view(), name='my-applications'),
    path('job/<int:job_id>/', JobApplicationsView.as_view(), name='job-applications'),
    path('<int:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application-status-update'),
    path('stats/', MyStatsView.as_view(), name='my-stats'),
    path('recent/', RecentApplicantsView.as_view(), name='recent-applicants'),
]
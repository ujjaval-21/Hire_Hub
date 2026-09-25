from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Resume, Application
from .serializers import ResumeSerializer, ApplicationSerializer, ApplicationStatusUpdateSerializer
from notifications.models import Notification
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from jobs.models import JobListing


class ResumeUploadView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(candidate=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'candidate':
            raise PermissionDenied("Only candidates can upload resumes.")
        serializer.save(candidate=self.request.user)


class ApplyForJobView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'candidate':
            raise PermissionDenied("Only candidates can apply for jobs.")
        application = serializer.save(candidate=self.request.user)

        # Notify the employer
        Notification.objects.create(
            recipient=application.job.employer,
            message=f"New application from {application.candidate.username} for '{application.job.title}'",
        )


class MyApplicationsView(generics.ListAPIView):
    """Candidate: see their own applications."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(candidate=self.request.user)


class JobApplicationsView(generics.ListAPIView):
    """Employer: see applications for a specific job they posted."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_id = self.kwargs['job_id']
        return Application.objects.filter(job_id=job_id, job__employer=self.request.user)


class ApplicationStatusUpdateView(generics.UpdateAPIView):
    """Employer: update status of an application to their job."""
    queryset = Application.objects.all()
    serializer_class = ApplicationStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(job__employer=self.request.user)

    def perform_update(self, serializer):
        application = serializer.save()
        # Notify the candidate of status change
        Notification.objects.create(
            recipient=application.candidate,
            message=f"Your application for '{application.job.title}' is now: {application.get_status_display()}",
        )
        

class MyStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role == 'employer':
            jobs = JobListing.objects.filter(employer=request.user)
            applications = Application.objects.filter(job__employer=request.user)
            status_breakdown = applications.values('status').annotate(count=Count('id'))
            return Response({
                'active_jobs': jobs.filter(status='open').count(),
                'total_jobs': jobs.count(),
                'total_applications': applications.count(),
                'status_breakdown': {row['status']: row['count'] for row in status_breakdown},
            })
        else:
            applications = Application.objects.filter(candidate=request.user)
            status_breakdown = applications.values('status').annotate(count=Count('id'))
            return Response({
                'total_applications': applications.count(),
                'status_breakdown': {row['status']: row['count'] for row in status_breakdown},
            })


class RecentApplicantsView(generics.ListAPIView):
    """Employer: 5 most recent applications across all their jobs."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(job__employer=self.request.user).order_by('-applied_at')[:5]
from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
from .models import JobListing, SavedJob
from .serializers import JobListingSerializer, SavedJobSerializer
from .permissions import IsEmployer, IsOwnerEmployer


User = get_user_model()


class PublicJobStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'open_jobs': JobListing.objects.filter(status='open').count(),
            'total_employers': User.objects.filter(role='employer').count(),
            'total_candidates': User.objects.filter(role='candidate').count(),
        })

    
class JobListCreateView(generics.ListCreateAPIView):
    queryset = JobListing.objects.filter(status='open')
    serializer_class = JobListingSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['job_type', 'location']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['posted_at', 'salary_min', 'salary_max']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsEmployer()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsOwnerEmployer()]
        return [permissions.AllowAny()]


class MyJobListingsView(generics.ListAPIView):
    """Employer's own job postings (including closed ones)."""
    serializer_class = JobListingSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]

    def get_queryset(self):
        return JobListing.objects.filter(employer=self.request.user)


class SavedJobListCreateView(generics.ListCreateAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(candidate=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'candidate':
            raise PermissionDenied("Only candidates can save jobs.")
        serializer.save(candidate=self.request.user)


class SavedJobDeleteView(generics.DestroyAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'job_id'

    def get_queryset(self):
        return SavedJob.objects.filter(candidate=self.request.user)

    def get_object(self):
        return self.get_queryset().get(job_id=self.kwargs['job_id'])
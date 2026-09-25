from rest_framework import serializers
from .models import JobListing, SavedJob


class JobListingSerializer(serializers.ModelSerializer):
    employer_username = serializers.CharField(source='employer.username', read_only=True)
    company_name = serializers.CharField(source='employer.employer_profile.company_name', read_only=True)

    class Meta:
        model = JobListing
        fields = [
            'id', 'title', 'description', 'location', 'job_type',
            'salary_min', 'salary_max', 'status',
            'employer_username', 'company_name',
            'posted_at', 'updated_at',
        ]
        read_only_fields = ['id', 'employer_username', 'company_name', 'posted_at', 'updated_at']

class SavedJobSerializer(serializers.ModelSerializer):
    job_detail = JobListingSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'job_detail', 'saved_at']
        read_only_fields = ['id', 'job_detail', 'saved_at']
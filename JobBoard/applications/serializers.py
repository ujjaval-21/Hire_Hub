from rest_framework import serializers
from .models import Resume, Application
from jobs.models import JobListing


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'file', 'original_filename', 'uploaded_at']
        read_only_fields = ['id', 'original_filename', 'uploaded_at']


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)
    job_type = serializers.CharField(source='job.job_type', read_only=True)
    company_name = serializers.CharField(source='job.employer.employer_profile.company_name', read_only=True)
    candidate_username = serializers.CharField(source='candidate.username', read_only=True)
    resume_file = serializers.FileField(source='resume.file', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'job_location', 'job_type', 'company_name',
            'resume', 'resume_file', 'candidate_username', 'status', 'applied_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'applied_at', 'updated_at']

    def validate(self, data):
        request = self.context['request']
        job = data.get('job')
        resume = data.get('resume')

        if job.status != JobListing.Status.OPEN:
            raise serializers.ValidationError("This job is no longer accepting applications.")

        if resume.candidate != request.user:
            raise serializers.ValidationError("You can only apply using your own resume.")

        return data


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']
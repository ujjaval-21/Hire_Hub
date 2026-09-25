from django.db import models
from django.conf import settings
from jobs.models import JobListing


def resume_upload_path(instance, filename):
    # Organizes uploads as: resumes/<user_id>/<filename>
    return f'resumes/{instance.candidate.id}/{filename}'


class Resume(models.Model):
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes',
        limit_choices_to={'role': 'candidate'},
    )
    file = models.FileField(upload_to=resume_upload_path)
    original_filename = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def save(self, *args, **kwargs):
        if self.file and not self.original_filename:
            self.original_filename = self.file.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Resume: {self.original_filename} ({self.candidate.username})"


class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'applied', 'Applied'
        REVIEWED = 'reviewed', 'Reviewed'
        SHORTLISTED = 'shortlisted', 'Shortlisted'
        REJECTED = 'rejected', 'Rejected'
        HIRED = 'hired', 'Hired'

    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications',
        limit_choices_to={'role': 'candidate'},
    )
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='applications')
    resume = models.ForeignKey(Resume, on_delete=models.PROTECT, related_name='applications')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        # A candidate can only apply once to a given job
        unique_together = ('candidate', 'job')

    def __str__(self):
        return f"{self.candidate.username} → {self.job.title} ({self.status})"
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        EMPLOYER = 'employer', 'Employer'
        CANDIDATE = 'candidate', 'Candidate'

    role = models.CharField(max_length=20, choices=Role.choices)

    def __str__(self):
        return f"{self.username} ({self.role})"


class EmployerProfile(models.Model):
    class CompanySize(models.TextChoices):
        SMALL = '1-10', '1-10 employees'
        MEDIUM = '11-50', '11-50 employees'
        LARGE = '51-200', '51-200 employees'
        XLARGE = '200+', '200+ employees'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=255)
    company_website = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True)
    industry = models.CharField(max_length=255, blank=True)
    company_size = models.CharField(max_length=10, choices=CompanySize.choices, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.company_name


class CandidateProfile(models.Model):
    class Gender(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'
        OTHER = 'other', 'Other'
        PREFER_NOT_TO_SAY = 'prefer_not_to_say', 'Prefer not to say'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)
    headline = models.CharField(max_length=255, blank=True)
    skills = models.CharField(max_length=500, blank=True, help_text="Comma-separated skills")
    gender = models.CharField(max_length=20, choices=Gender.choices, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.full_name
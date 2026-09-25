from django.contrib import admin
from .models import JobListing

@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer', 'location', 'job_type', 'status', 'posted_at')
    list_filter = ('status', 'job_type', 'location')
    search_fields = ('title', 'description', 'location')
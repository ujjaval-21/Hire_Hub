from django.contrib import admin
from .models import Resume, Application

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'original_filename', 'uploaded_at')
    search_fields = ('candidate__username', 'original_filename')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'job', 'status', 'applied_at')
    list_filter = ('status',)
    search_fields = ('candidate__username', 'job__title')
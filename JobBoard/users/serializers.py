from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, EmployerProfile, CandidateProfile


class EmployerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    company_name = serializers.CharField(write_only=True)
    company_website = serializers.URLField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'company_name', 'company_website')

    def create(self, validated_data):
        company_name = validated_data.pop('company_name')
        company_website = validated_data.pop('company_website', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=User.Role.EMPLOYER,
        )
        EmployerProfile.objects.create(
            user=user,
            company_name=company_name,
            company_website=company_website,
        )
        return user


class CandidateRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    full_name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'full_name', 'phone')

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        phone = validated_data.pop('phone', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=User.Role.CANDIDATE,
        )
        CandidateProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
        )
        return user

class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['company_name', 'company_website', 'location', 'industry', 'company_size', 'description']


class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['full_name', 'phone', 'location', 'headline', 'skills', 'gender', 'date_of_birth']


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


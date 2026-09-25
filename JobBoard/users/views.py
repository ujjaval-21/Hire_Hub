from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CurrentUserSerializer, EmployerRegisterSerializer, CandidateRegisterSerializer
from .serializers import EmployerProfileSerializer, CandidateProfileSerializer
from .serializers import (
    EmployerRegisterSerializer,
    CandidateRegisterSerializer,
    CurrentUserSerializer,
    EmployerProfileSerializer,
    CandidateProfileSerializer,
)


class EmployerRegisterView(generics.CreateAPIView):
    serializer_class = EmployerRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {'username': user.username, 'role': user.role},
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=201)


class CandidateRegisterView(generics.CreateAPIView):
    serializer_class = CandidateRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {'username': user.username, 'role': user.role},
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=201)


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = CurrentUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user



class MyProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.user.role == 'employer':
            return EmployerProfileSerializer
        return CandidateProfileSerializer

    def get_object(self):
        if self.request.user.role == 'employer':
            return self.request.user.employer_profile
        return self.request.user.candidate_profile


class MyProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.user.role == 'employer':
            return EmployerProfileSerializer
        return CandidateProfileSerializer

    def get_object(self):
        if self.request.user.role == 'employer':
            return self.request.user.employer_profile
        return self.request.user.candidate_profile
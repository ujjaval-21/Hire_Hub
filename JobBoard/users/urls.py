from django.urls import path
from .views import EmployerRegisterView, CandidateRegisterView, CurrentUserView, MyProfileView

urlpatterns = [
    path('register/employer/', EmployerRegisterView.as_view(), name='register-employer'),
    path('register/candidate/', CandidateRegisterView.as_view(), name='register-candidate'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('me/profile/', MyProfileView.as_view(), name='my-profile'),
]

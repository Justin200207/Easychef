from django.shortcuts import render, get_object_or_404
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from accounts.serializers import UserSerializer
from accounts.models import User

# Create your views here.

class SignupView(CreateAPIView):
    serializer_class = UserSerializer

class LogoutView(RetrieveAPIView):
    serializer_class = UserSerializer
    def get_object(self):
        return None

class ProfileEditView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # No 403 check since id is based of token auth        
        return get_object_or_404(User, id=self.request.user.id)
    
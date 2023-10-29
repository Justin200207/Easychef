from django.db import models
from django.contrib.auth.models import AbstractUser


# Inherits all attributes of django user
# All that are needed are stated again in this child
class User(AbstractUser):
    
    username = models.CharField(max_length=150, blank=True, unique=False) # Not used, allow blank
    
    # Make the email the username since EasyChef users don't have usernames
    # and email is the only unique attribute besides the auto assigned id.
    # This means that email is both the USERNAME_FIELD and EMAIL_FIELD.
    USERNAME_FIELD = "email"
    
    # Email should not be in here since it is set as username
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']
    
    email = models.EmailField(blank=False, unique=True)
    
    # Not required fields
    phone_number = models.CharField(max_length=12, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    
    profile_pic = models.ImageField(upload_to="profile_pic/", null=True, blank=True)
    
    

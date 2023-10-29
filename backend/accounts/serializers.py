from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'password', 'profile_pic']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True}
        }
        
    # This somehow works, dont touch
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return User.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        if (validated_data.get('password') != None):
            validated_data['password'] = make_password(validated_data.get('password'))
        return super().update(instance, validated_data)
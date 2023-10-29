from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from accounts.views import SignupView, LogoutView, ProfileEditView

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view()),
    path('edit/', ProfileEditView.as_view()),
]
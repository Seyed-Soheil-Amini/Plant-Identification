from django.urls import path
from .views import ObtainJWTWithCookie, RefreshJWTWithCookie, VerifyJWTWithCookie, LogoutView

urlpatterns = [
    path('login/', ObtainJWTWithCookie.as_view(), name="login"),
    path('refresh/token/', RefreshJWTWithCookie.as_view(), name="refresh_token"),
    path('verify/token/', VerifyJWTWithCookie.as_view(), name="verify_token"),
    path('logout/', LogoutView.as_view(), name="logout")
]

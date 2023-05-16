from datetime import timedelta

from django.shortcuts import render
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from rest_framework_simplejwt.views import TokenVerifyView


class ObtainJWTWithCookie(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        tempResponse = super().post(request, *args, **kwargs)
        access_token = tempResponse.data['access_token']
        refresh_token = tempResponse.data['refresh_token']
        access_token_expiration = tempResponse.data['access_token_expiration']
        refresh_token_expiration = tempResponse.data['refresh_token_expiration']

        # Set access token in a cookie
        response = Response('Successfully')
        response.set_cookie('access_token', access_token, expires=access_token_expiration,
                            secure=settings.SESSION_COOKIE_SECURE, httponly=True, samesite='Lax')

        # Set refresh token in a cookie
        response.set_cookie('refresh_token', refresh_token, expires=refresh_token_expiration,
                            secure=settings.SESSION_COOKIE_SECURE, httponly=True, samesite='Lax')

        return response


class RefreshJWTWithCookie(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        # Response.data is a forEach that saves header's data in response's object
        new_access_token = response.data.get('access')

        if new_access_token:
            # Set new access token in a cookie
            mainResponse = Response('New Token is created.')
            mainResponse.set_cookie('access_token', new_access_token, expires=timedelta(minutes=5),
                                    secure=settings.SESSION_COOKIE_SECURE, httponly=True, samesite='Lax')
        return super().finalize_response(request, mainResponse, *args, **kwargs)


class VerifyJWTWithCookie(TokenVerifyView):
    def __init__(self):
        super().__init__()

    def get_token(self, request):
        access_token = request.COOKIES.get('access_token')
        if access_token:
            return access_token.strip('\"')

        return None

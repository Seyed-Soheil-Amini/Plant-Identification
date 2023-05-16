from datetime import timedelta

from django.shortcuts import render
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.conf import settings
from rest_framework_simplejwt.views import TokenVerifyView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


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

        # mainResponse = Response().setdefault('default' ,'HttpOnly')
        if new_access_token:
            # Set new access token in a cookie
            mainResponse = Response('New Token is created.')
            mainResponse.set_cookie('access_token', new_access_token, expires=timedelta(minutes=5),
                                    secure=settings.SESSION_COOKIE_SECURE, httponly=True, samesite='Lax')
        else:
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        return super().finalize_response(request, mainResponse, *args, **kwargs)


class VerifyJWTWithCookie(TokenVerifyView):
    def __init__(self):
        super().__init__()

    def get_token(self, request):
        access_token = request.COOKIES.get('access_token')
        if access_token:
            return access_token.strip('\"')

        return None


class LogoutView(APIView):
    def post(self, request, format=None):
        # Get the refresh token from the request's cookies
        refresh_token = request.COOKIES.get('refresh_token')
        access_token = request.COOKIES.get('access_token')
        # If the refresh token is not present, return an error response
        if not refresh_token:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Blacklist the refresh token to invalidate it
        # try:
        #     token_obj = RefreshToken(refresh_token)
        #     token_obj.blacklist()
        # except:
        #     return Response(status=status.HTTP_400_BAD_REQUEST)

        # Clear the refresh token cookie
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token')
        response.delete_cookie('access_token')
        return response

# from datetime import timedelta
#
# from django.shortcuts import render
#
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from .serializers import CustomTokenObtainPairSerializer
# from django.http import JsonResponse, HttpResponse
# from django.conf import settings
# from rest_framework_simplejwt.views import TokenVerifyView
#
#
#
# class ObtainJWTWithCookie(TokenObtainPairView):
#     serializer_class = CustomTokenObtainPairSerializer
#
#     def post(self, request, *args, **kwargs):
#         tempResponse = super().post(request, *args, **kwargs)
#         access_token = tempResponse.data['access_token']
#         refresh_token = tempResponse.data['refresh_token']
#         access_token_expiration = tempResponse.data['access_token_expiration']
#         refresh_token_expiration = tempResponse.data['refresh_token_expiration']
#
#         # Set access token in a cookie
#         response = HttpResponse('Successfully')
#         response.set_cookie('access_token', access_token, expires=access_token_expiration,
#                             secure=settings.SESSION_COOKIE_SECURE, httponly=True, samesite='Lax')
#
#         # Set refresh token in a cookie
#         response.set_cookie('refresh_token', refresh_token, expires=refresh_token_expiration,
#                             secure=settings.SESSION_COOKIE_SECURE, httponly=True, samesite='Lax')
#
#         return response
#
#
# class RefreshJWTWithCookie(TokenRefreshView):
#     def finalize_response(self, request, response, *args, **kwargs):
#         new_access_token = response.data.get('access')
#
#         if new_access_token:
#             # Set new access token in a cookie
#             response.set_cookie('access_token', new_access_token, expires=timedelta(minutes=5),
#                                 secure=settings.SESSION_COOKIE_SECURE, httponly=True, samesite='Lax')
#
#         return super().finalize_response(request, response, *args, **kwargs)
#
#
# class VerifyJWTWithCookie(TokenVerifyView):
#     def __init__(self):
#         super().__init__()
#
#     def get_token(self, request):
#         access_token = request.COOKIES.get('access_token')
#         if access_token:
#             return access_token.strip('\"')
#
#         return None


from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware import csrf
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import status


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class LoginView(APIView):
    def post(self, request, format=None):
        print("test")
        data = request. data
        response = Response()
        username = data.get('username', None)
        password = data.get('password', None)
        user = authenticate(username=username, password=password)

        print(user)
        if user is not None:
            if user.is_active:
                print("is active")
                data = get_tokens_for_user(user)
                print(data)
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'],
                    value=data["refresh"],
                    expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'],
                    value=data["access"],
                    expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                csrf.get_token(request)
                # You can set data attr to date to see tokens in testing in below line
                response.data = {"Success": "Login successfully",
                                 "data": str(user)}
                return response
            else:
                return Response({"No active": "This account is not active!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"Invalid": "Invalid username or password!!"}, status=status.HTTP_404_NOT_FOUND)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh_token = self.get_token(self.user)
        response = {
            'access_token': str(data['access']),
            'refresh_token': str(refresh_token),
        }

        expiration = timezone.now() + timedelta(minutes=5)
        response['access_token_expiration'] = expiration.strftime('%Y-%m-%d %H:%M:%S')
        response['refresh_token_expiration'] = (
            (refresh_token.current_time + timedelta(days=90)).strftime('%Y-%m-%d %H:%M:%S')
        )

        return response

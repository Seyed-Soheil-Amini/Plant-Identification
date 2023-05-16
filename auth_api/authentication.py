from jwt import exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.translation import gettext_lazy as _

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        """
        Returns a two-tuple of `User` and token if a valid signature has been
        supplied using JWT-based authentication.  Otherwise, returns `None`.
        """
        auth_header = self.get_header(request)
        if auth_header is None:
            auth_cookie = request.COOKIES.get('access_token')
            if auth_cookie:
                auth_header = f'Bearer {auth_cookie}'

        if auth_header is None:
            return None

        raw_token = self.get_raw_token(auth_header)
        validated_token = self.get_validated_token(raw_token)

        user = self.get_user(validated_token)
        if user is None:
            raise exceptions.AuthenticationFailed(_('Invalid token.'))

        return user, validated_token
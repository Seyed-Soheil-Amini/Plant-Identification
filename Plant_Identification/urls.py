"""Plant_Identification URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.template.defaulttags import url
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# from rest_framework_simplejwt.views import TokenVerifyView, TokenObtainPairView, TokenRefreshView

# from auth_api.views import ObtainJWTWithCookie, RefreshJWTWithCookie, VerifyJWTWithCookie

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
    path('plants/', include('detail.urls')),
    path('identify/', include('identify.urls')),
    path('explore/', include('explore.urls')),
    path('services/medicinal/',include('medicinal_properties.urls'
        # url('medicinal/',include('medicinal_properties.urls')),
        # Add Other urls of services
    )),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/',  TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('', include('auth_api.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

"""
URL configuration for base project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    LoginView,
    LogoutView,
    MyCrocodilesViewSet,
    PublicCrocodilesViewSet,
    UserCreateAPIView,
)

urlpatterns = [
    path("", TemplateView.as_view(template_name="index.html")),
    path("admin/", admin.site.urls),
    # used only for the browseable API interface
    re_path(r"^api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("auth/cookie/login/", LoginView.as_view()),
    path("auth/cookie/logout/", LogoutView.as_view()),
    path("auth/basic/login/", LoginView.as_view()),
    path("auth/basic/logout/", LogoutView.as_view()),
    path("auth/token/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/register/", UserCreateAPIView.as_view()),
    path(
        "my/crocodiles/", MyCrocodilesViewSet.as_view({"get": "list", "post": "create"})
    ),
    path(
        "my/crocodiles/<int:pk>/",
        MyCrocodilesViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
    ),
    path("public/crocodiles/", PublicCrocodilesViewSet.as_view({"get": "list"})),
    path(
        "public/crocodiles/<int:pk>/",
        PublicCrocodilesViewSet.as_view({"get": "retrieve"}),
    ),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

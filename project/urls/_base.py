from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.api.views.auth import session_basic
from apps.api.views.crocodiles import MyCrocodilesViewSet, PublicCrocodilesViewSet
from apps.api.views.users import UserCreateAPIView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),

    path('admin/', admin.site.urls),

    # used only for the browseable API interface
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    path('auth/cookie/login/', session_basic.LoginView.as_view()),
    path('auth/cookie/logout/', session_basic.LogoutView.as_view()),

    path('auth/basic/login/', session_basic.LoginView.as_view()),
    path('auth/basic/logout/', session_basic.LogoutView.as_view()),

    path('auth/token/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('user/register/', UserCreateAPIView.as_view()),

    path('my/crocodiles/', MyCrocodilesViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('my/crocodiles/<int:pk>/', MyCrocodilesViewSet.as_view({'get': 'retrieve',
                                                                 'put': 'update',
                                                                 'patch': 'partial_update',
                                                                 'delete': 'destroy',
                                                                 })),

    path('public/crocodiles/', PublicCrocodilesViewSet.as_view({'get': 'list'})),
    path('public/crocodiles/<int:pk>/', PublicCrocodilesViewSet.as_view({'get': 'retrieve'})),
]

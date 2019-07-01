from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.api.views.auth import cookie
from apps.api.views.crocodiles import MyCrocodilesViewSet, PublicCrocodilesViewSet

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),

    path('admin/', admin.site.urls),

    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth/cookie/login/', cookie.SessionLoginView.as_view()),
    path('auth/cookie/logout/', cookie.SessionLogoutView.as_view()),

    url(r'^auth/token/login/$', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    url(r'^auth/token/refresh/$', TokenRefreshView.as_view(), name='token_refresh'),


    path('my/crocodiles/', MyCrocodilesViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('my/crocodiles/<int:pk>/', MyCrocodilesViewSet.as_view({'get': 'retrieve'})),

    path('public/crocodiles/', PublicCrocodilesViewSet.as_view({'get': 'list'})),
    path('public/crocodiles/<int:pk>/', PublicCrocodilesViewSet.as_view({'get': 'retrieve'})),

]


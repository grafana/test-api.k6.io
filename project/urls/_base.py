from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

from apps.api.views.auth import cookie
from apps.api.views.crocodiles import MyCrocodilesViewSet, PublicCrocodilesViewSet

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),

    path('admin/', admin.site.urls),

    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth/cookie/login/', cookie.SessionLoginView.as_view()),
    path('auth/cookie/logout/', cookie.SessionLogoutView.as_view()),

    path('my/crocodiles/', MyCrocodilesViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('my/crocodiles/<int:pk>/', MyCrocodilesViewSet.as_view({'get': 'retrieve'})),

    path('public/crocodiles/', PublicCrocodilesViewSet.as_view({'get': 'list'})),
    path('public/crocodiles/<int:pk>/', PublicCrocodilesViewSet.as_view({'get': 'retrieve'})),

]


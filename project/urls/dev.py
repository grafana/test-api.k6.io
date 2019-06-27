# additional URLs used in development

from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static

from ._base import urlpatterns


urlpatterns = urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



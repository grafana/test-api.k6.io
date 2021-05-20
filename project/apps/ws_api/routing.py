
from django.conf.urls import url

from .consumers.simple import CrocoChatRoom

websocket_urlpatterns = [
    url(r'^ws/crocochat/(?P<room_code>\w+)/$', CrocoChatRoom.as_asgi()),
]
from django.urls import re_path

from api.websocket import CrocoChatRoom

urlpatterns = [
    re_path(r"^ws/crocochat/(?P<room_code>\w+)/$", CrocoChatRoom.as_asgi()),
]

from django.urls import path
from . import consumers


game_websocket_urlpatterns = [
    path('ws/game/1v1/<str:game_id>/', consumers.OneVsOneConsumer.as_asgi()),
    path('ws/game/2v2/<str:game_id>/', consumers.TwoVsTwoConsumer.as_asgi()),
]

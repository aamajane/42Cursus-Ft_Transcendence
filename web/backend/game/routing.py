from django.urls import path
from . import consumers


game_websocket_urlpatterns = [
    path('ws/game/one_vs_one/<str:game_id>/', consumers.OneVsOneConsumer.as_asgi()),
    path('ws/game/two_vs_two/<str:game_id>/', consumers.TwoVsTwoConsumer.as_asgi()),
]

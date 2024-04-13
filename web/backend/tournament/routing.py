from django.urls import path
from . import consumers


tournament_websocket_urlpatterns = [
    path('ws/tournament/<str:tournament_id>/', consumers.TournamentConsumer.as_asgi()),
]

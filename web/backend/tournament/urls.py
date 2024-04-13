from django.urls import path
from . import views


app_name = 'tournament'

urlpatterns = [
    path('', views.home, name='home_view'),
    path('<str:tournament_id>/', views.tournament, name='tournament_view'),
]

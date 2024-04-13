from django.urls import path
from . import views


app_name = 'game'

urlpatterns = [
	path('', views.home, name='home_view'),
    path('ai/', views.ai, name='ai_view'),
    path('one_vs_one/<str:game_id>/', views.one_vs_one, name='one_vs_one_view'),
    path('two_vs_two/<str:game_id>/', views.two_vs_two, name='two_vs_two_view'),
]

"""
URL configuration for transcendence project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from graphene_django.views import GraphQLView
from .middleware import MyGraphQLView
from . import views

urlpatterns = [
    path('api', views.root_view),
    path('api/admin/', admin.site.urls),
    path('api/graphql/', MyGraphQLView.as_view(graphiql=True)),
    path('api/oauth2/intra42/consent/', views.intra42_consent),
    path('api/oauth2/google/consent/', views.google_consent),
    path('api/oauth2/intra42/exchange/', views.intra42_exchange),
    path('api/oauth2/google/exchange/', views.google_exchange),
    path('api/oauth2/verify/', views.verify_token),
    path('api/upload/<str:username>/', views.upload_image, name='upload'),
    path('api/media/<str:image_file>/', views.serve_image, name='image'),
]

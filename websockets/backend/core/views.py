from django.http import HttpResponse

def root_view(request):
    # Your view logic goes here
    return HttpResponse("Hello from CLIENT !")

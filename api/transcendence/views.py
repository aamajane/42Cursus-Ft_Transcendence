from django.http import JsonResponse
from users.models import User

def upload_image(request, username):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        user = None
        try:
            user = User.objects.get(username=username)
        except Exception as e:
            return JsonResponse({'error': 'User not found', 'success': None})
        user.image = image_file
        user.save()
        return JsonResponse({'success': 'Image uploaded successfully', 'error': None})
    else:
        return JsonResponse({'error': 'No image file provided', 'success': None})

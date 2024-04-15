import secrets
from django.shortcuts import render, reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required


# @login_required
def home(request):
    if request.method == 'POST':
        game_id = secrets.token_hex(16)
        create_one_vs_one = request.POST.get('create_one_vs_one')
        create_two_vs_two = request.POST.get('create_two_vs_two')
        create_ai = request.POST.get('create_ai')

        if create_ai == 'true':
            url = reverse('game:ai_view')

        if create_one_vs_one == 'true':
            url = reverse('game:one_vs_one_view', kwargs={'game_id': game_id})

        if create_two_vs_two == 'true':
            url = reverse('game:two_vs_two_view', kwargs={'game_id': game_id})

        return HttpResponseRedirect(url)

    return render(request, 'game/home.html')


# @login_required
def ai(request):
    context = {'game_mode': 'ai'}
    return render(request, 'game/game.html', context)


@login_required
def one_vs_one(request, game_id):
    context = {'game_id': game_id, 'game_mode': 'one_vs_one'}
    return render(request, 'game/game.html', context)


@login_required
def two_vs_two(request, game_id):
    context = {'game_id': game_id, 'game_mode': 'two_vs_two'}
    return render(request, 'game/game.html', context)

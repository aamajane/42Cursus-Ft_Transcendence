import secrets
from django.shortcuts import render, reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required


def home(request):
    if request.method == 'POST':
        tournament_id = secrets.token_hex(16)
        create_tournament = request.POST.get('create_tournament')

        if create_tournament == 'true':
            url = reverse('tournament:one_vs_one_view', kwargs={'tournament_id': tournament_id})

        return HttpResponseRedirect(url)

    return render(request, 'tournament/home.html')


@login_required
def tournament(request, tournament_id):
    context = {'tournament_id': tournament_id}
    return render(request, 'tournament/tournament.html', context)

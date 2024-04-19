# Generated by Django 4.2.10 on 2024-04-18 22:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0005_alter_tournament_demi_final_first_game_and_more'),
        ('games', '0004_game_tournament_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='score1',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='game',
            name='score2',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='game',
            name='tournament_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tournaments.tournament'),
        ),
    ]

# Generated by Django 5.0.4 on 2024-04-29 01:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('games', '0001_initial'),
        ('tournaments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='tournament_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tournaments.tournament'),
        ),
    ]

# Generated by Django 4.2.10 on 2024-04-05 03:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0002_alter_tournament_tournament_hoster'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tournament',
            name='name',
        ),
    ]
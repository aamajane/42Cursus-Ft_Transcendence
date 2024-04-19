# Generated by Django 4.2.10 on 2024-04-18 17:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_user_friends'),
    ]

    operations = [
        migrations.CreateModel(
            name='Followership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('relevancy_score', models.IntegerField(db_index=True, default=0)),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='friends',
        ),
        migrations.AddField(
            model_name='user',
            name='number_of_following',
            field=models.IntegerField(default=0),
        ),
        migrations.DeleteModel(
            name='Friend',
        ),
        migrations.AddField(
            model_name='followership',
            name='following',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following', to='users.user'),
        ),
        migrations.AddField(
            model_name='followership',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user', to='users.user'),
        ),
    ]

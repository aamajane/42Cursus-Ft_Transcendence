# Generated by Django 5.0.4 on 2024-04-23 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_user_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar_url',
            field=models.CharField(blank=True, default='http://localhost/assets/images/anonimous.jpeg', max_length=2000),
        ),
    ]
# Generated by Django 4.2 on 2023-04-13 23:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='cuisine',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]

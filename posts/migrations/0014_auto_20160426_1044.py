# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-26 10:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0013_post_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.ImageField(default=b'postimages/None-No-img.jpg', upload_to=b'postimages/'),
        ),
    ]

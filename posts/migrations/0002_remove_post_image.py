# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-28 16:12
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='image',
        ),
    ]

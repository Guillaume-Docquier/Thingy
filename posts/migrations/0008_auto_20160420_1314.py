# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-20 13:14
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0007_auto_20160420_1312'),
    ]

    operations = [
        migrations.RenameField(
            model_name='postreview',
            old_name='author',
            new_name='reviewauthor',
        ),
    ]

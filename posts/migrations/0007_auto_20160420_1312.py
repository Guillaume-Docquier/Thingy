# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-20 13:12
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0006_auto_20160420_1303'),
    ]

    operations = [
        migrations.RenameField(
            model_name='postreview',
            old_name='auther',
            new_name='author',
        ),
    ]

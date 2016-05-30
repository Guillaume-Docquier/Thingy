# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-26 12:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('message', '0008_auto_20160519_1629'),
    ]

    operations = [
        migrations.AlterField(
            model_name='request',
            name='status',
            field=models.CharField(choices=[(b'Pending', b'Pending'), (b'Accepted', b'Accepted'), (b'Declined', b'Declined'), (b'Ended', b'Ended')], default='Pending', max_length=8),
        ),
    ]

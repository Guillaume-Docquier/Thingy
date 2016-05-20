# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-19 14:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('message', '0007_auto_20160519_1620'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rentmessage',
            name='type',
            field=models.CharField(choices=[(b'Rent request', b'Rent request'), (b'Rent accepted', b'Rent accepted'), (b'Rent declined', b'Rent declined')], default='Rent request', max_length=13),
        ),
        migrations.AlterField(
            model_name='request',
            name='status',
            field=models.CharField(choices=[(b'Pending', b'Pending'), (b'Accepted', b'Accepted'), (b'Declined', b'Declined')], default='Pending', max_length=8),
        ),
    ]
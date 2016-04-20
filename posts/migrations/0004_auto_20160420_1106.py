# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-20 11:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_auto_20160420_0936'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostReview',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(default=0)),
                ('comment', models.CharField(max_length=500)),
                ('postID', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='posts.Post')),
            ],
        ),
        migrations.RemoveField(
            model_name='postrating',
            name='postID',
        ),
        migrations.DeleteModel(
            name='PostRating',
        ),
    ]

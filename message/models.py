from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from authentication.models import Account

class Message(models.Model):

    recipient = models.ForeignKey(Account, related_name='recipient')
    author = models.ForeignKey(Account, related_name='author')
    type = models.ForeignKey(messTypes)
    created = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=400,blank=True, default='')
    unread = models.BooleanField(default=True)

    class Meta:
        ordering = ('created',)

class messTypes(models.Model):

    type = models.CharField(max_length=400,blank=True,on_delete=models.CASCADE)
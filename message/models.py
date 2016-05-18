from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from authentication.models import Account
from posts.models import Post
from message.choices import *

class BaseMessage(models.Model):

    thingy = models.ForeignKey(Post)
    rentee = models.ForeignKey(Account)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=400, blank=True, default='')

#Extends basemessage
class RentMessage(BaseMessage):
    type = models.CharField(max_length=4, choices=RENT_CHOICES, default='Rent')
    unread = models.BooleanField(default=True)

#Extends basemessage
class Request(BaseMessage):
    status = models.CharField(max_length=3, choices=STATUS_CHOICES, default='Pen')

class PrivateMessage(models.Model):
    pass





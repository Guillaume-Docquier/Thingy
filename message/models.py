from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from authentication.models import Account
from posts.models import Post
from message.choices import *

class BaseMessage(models.Model):
    thingy = models.ForeignKey(Post, related_name ='bm_thingy')
    rentee = models.ForeignKey(Account, related_name ='bm_rentee')
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=400, blank=True, default='')

#Extends basemessage
class RentMessage(BaseMessage):
    type = models.CharField(max_length=13, choices=RENT_CHOICES, default='Rent request')
    unread = models.BooleanField(default=True)
    recipient = models.ForeignKey(Account, related_name ='rm_recipient')

#Extends basemessage
class Request(BaseMessage):
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='Pending')

class PrivateMessage(models.Model):
    author = models.ForeignKey(Account)
    recipient = models.ForeignKey(Account, related_name='pm_recipient')
    created_at = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=2000, blank=True)
    unread = models.BooleanField(default=True)

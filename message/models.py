from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from authentication.models import Account

class messTypes(models.Model):

    type = models.CharField(max_length=400,blank=True)

    def __unicode__(self):
        return self.type

class Message(models.Model):

    recipient = models.ForeignKey(Account, related_name='messages')
    author = models.ForeignKey(Account)
    type = models.ForeignKey(messTypes,on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=400,blank=True, default='')
    unread = models.BooleanField(default=True)

    class Meta:
        ordering = ('created',)

    def __unicode__(self):
        return u'%s / %s/ %s' % (self.body, self.author, self.recipient)

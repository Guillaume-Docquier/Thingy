from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from authentication.models import Account

class messTypes(models.Model):

<<<<<<< HEAD
    type = models.CharField(max_length=400,blank=True)

    def __unicode__(self):
        return self.type
=======
    type = models.CharField(max_length=400,blank=True,on_delete=models.CASCADE)
>>>>>>> 0db1ec02530626a3d18ad0d36ed851db4181d622

class Message(models.Model):

    recipient = models.ForeignKey(Account, related_name='messages')
    author = models.ForeignKey(Account)
    type = models.ForeignKey(messTypes,on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=400,blank=True, default='')
    unread = models.BooleanField(default=True)

    class Meta:
        ordering = ('created',)
<<<<<<< HEAD

    def __unicode__(self):
        return u'%s / %s/ %s' % (self.body, self.author, self.recipient)
=======
>>>>>>> 0db1ec02530626a3d18ad0d36ed851db4181d622

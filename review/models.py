from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from authentication.models import Account

class Rating(models.Model):
    rating_grade = models.IntegerField(default=3)

    def __unicode__(self):
        return unicode(self.rating_grade)

class Review(models.Model):

    reviewed_user = models.ForeignKey(Account, related_name='reviewed_user')
    review_author = models.ForeignKey(Account, related_name='review')
    created = models.DateTimeField(auto_now_add=True)
    comment = models.CharField(max_length=400,blank=True, default='')
    rating = models.ForeignKey(Rating, on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ('created',)

    def __unicode__(self):
        return u'%s / %s/' % (self.comment, self.review_author, self.reviewed_user)

from django.db import models
#from __future__ import unicode_literals

from posts.fields import Base64ImageField
from authentication.models import Account

class Category(models.Model):
    cname = models.CharField(max_length=50)

    def __unicode__(self):
        return self.cname

class Subcategory(models.Model):
    sub_cat_name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)

    def __unicode__(self):
        return u'%s / %s' % (self.category, self.sub_cat_name)

class Condition(models.Model):
    cond_desc = models.CharField(max_length=50)
    cond_grade = models.IntegerField(default=0)
    def __unicode__(self):
        return u'%s / %s' % (self.cond_grade, self.cond_desc)

class Region(models.Model):
    name = models.CharField(max_length=50)
    def __unicode__(self):
        return self.name

class Town(models.Model):
    name = models.CharField(max_length=50)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True)
    def __unicode__(self):
        return u'%s / %s' % (self.region, self.name)

class Status(models.Model):
    name = models.CharField(max_length=50)

    def __unicode__(self):
        return self.name


class Post(models.Model):
    author = models.ForeignKey(Account, related_name='posts')

    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, null=True)
    condition = models.ForeignKey(Condition, on_delete=models.CASCADE, null =True)
    location = models.ForeignKey(Town, on_delete=models.CASCADE, null=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE, null=True, default = 1)

    title = models.CharField(max_length=35)
    price = models.IntegerField(default=0)
    description = models.TextField(max_length=500)

    # The default image is default.png so we should always have it in media/postimages/
    image = models.ImageField(upload_to='postimages/', default='postimages/default.png')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title



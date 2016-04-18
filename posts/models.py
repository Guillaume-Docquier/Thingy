from django.db import models
#from __future__ import unicode_literals

from authentication.models import Account

class Category(models.Model):
    cname = models.CharField(max_length=50)
    def __unicode__(self):
        return '{0}'.format(self.content)

class Subcategory(models.Model):
    sub_cat_name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)	
    def __unicode__(self):
	return '{0}'.format(self.content)

class Condition(models.Model):
    cond_desc = models.CharField(max_length=50)
    def __unicode__(self):
        return '{0}'.format(self.cond_desc)

class Region(models.Model):
    name = models.CharField(max_length=50)
    def __unicode__(self):
        return '{0}'.format(self.name)

class Town(models.Model):
    name = models.CharField(max_length=50)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True)
    def __unicode__(self):
        return '{0}'.format(self.name)

class Post(models.Model):
    author = models.ForeignKey(Account)
    #category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, null=True)
    condition = models.ForeignKey(Condition, on_delete=models.CASCADE, null=True)
    location = models.ForeignKey(Town, on_delete=models.CASCADE, null=True)

    title = models.CharField(max_length=35)
    price = models.IntegerField(default=0) 
    description = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __unicode__(self):
        return '{0}'.format(self.content)

class PostRating(models.Model):
    postID = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    avg_rating = models.IntegerField(default=0)
    nr_of_ratings = models.IntegerField(default=0)
    def __unicode__(self):
        return '{0}'.format(self.content)

class PostComments(models.Model):
    postID = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    comment_title = models.CharField(max_length=50)
    comment_txt = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __unicode__(self):
        return '{0}'.format(self.content)


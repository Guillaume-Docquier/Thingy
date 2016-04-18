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

class Condition
	cond_desc = models.CharField(max_length=50)

class Post(models.Model):
    author = models.ForeignKey(Account)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
	subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, null=True)
	condition = models.ForeignKey(Condition, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=35)
    price = models.IntegerField(default=0) 
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '{0}'.format(self.content)

class Region(models.Model):
	name = models.CharField(max_length=50)
	
	def __unicode__(self):
        return '{0}'.format(self.content)

class Town(models.Model):
	name = models.CharField(max_length=50)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True)

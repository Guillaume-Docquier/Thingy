from __future__ import unicode_literals

from django.db import models
from django.contrib.auth import models as Userinfo

# Create your models here.

class Category(models.Model):
    cname = models.CharField(max_length=50)

    def __str__(self):
	return self.cname

class Item(models.Model):
    user = models.ForeignKey(Userinfo.User, on_delete=models.CASCADE, null=True) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    itemID = models.IntegerField(default=0)
    title = models.CharField(max_length=200)
    price = models.IntegerField(default=0) 
    description = models.CharField(max_length=200)
   
    #owner = models.ForeignKey(User)
    #condition 
    #category 
    #photo
    #geolocation
    pub_date = models.DateTimeField('date published')

    def __str__(self):
	return self.title



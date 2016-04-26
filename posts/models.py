from django.db import models
#from __future__ import unicode_literals

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

class Post(models.Model):
    author = models.ForeignKey(Account, related_name='posts')

    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, null=True)
    condition = models.ForeignKey(Condition, on_delete=models.CASCADE, null =True)
    location = models.ForeignKey(Town, on_delete=models.CASCADE, null=True)

    title = models.CharField(max_length=35)
    price = models.IntegerField(default=0) 
    description = models.TextField(max_length=500)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title

    # @property
    def reviews(self):
        return self.postreview_set.all()

class PostReview(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    rating = models.IntegerField(default=0)
    comment = models.CharField(max_length=500)
    reviewauthor = models.ForeignKey(Account, null=True)
    def __unicode__(self):
<<<<<<< HEAD
        return u'%s (%d)' % (self.post, self.id)


#TA bort - Andre gav bra argument
class Review(models.Model):
    reviewed_user = models.ForeignKey(Account, on_delete=models.CASCADE, null=True)
    rating = models.IntegerField(default=0)
    #grade_of_description_of_item = models.IntegerField(default=0)
    #grade_of_communication = models.IntegerField(default=0)
    comment = models.CharField(max_length=500, blank=True)
    author_of_review = models.ForeignKey(Account, null=True)
    def __unicode__(self):
        return u'%s (%d)' % (self.reviewed_user, self.id)
=======
        return u'%s (%d)' % (self.post, self.id)
>>>>>>> be47bebbefbe3e1b310bb53e5e9487dbd2661455

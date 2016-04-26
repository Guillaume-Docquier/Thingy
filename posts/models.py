from django.db import models
#from __future__ import unicode_literals

from authentication.models import Account

class Category(models.Model):
    cname = models.CharField(max_length=50)
    
    def __unicode__(self):
        return self.cname

class Subcategory(models.Model):
    sub_cat_name = models.CharField(max_length=50)
<<<<<<< HEAD
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)

    def __unicode__(self):
        return '{0}'.format(self.content)

class Condition(models.Model):
    cond_desc = models.CharField(max_length=50)

    def __unicode__(self):
        return '{0}'.format(self.content)

class Region(models.Model):
    name = models.CharField(max_length=50)
	
    def __unicode__(self):
        return '{0}'.format(self.content)

class Town(models.Model):
    name = models.CharField(max_length=50)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True)
 
    def __unicode__(self):
        return '{0}'.format(self.content)



class Post(models.Model):
    author = models.ForeignKey(Account)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, null=True)
    condition = models.ForeignKey(Condition, on_delete=models.CASCADE, null=True)
=======
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
>>>>>>> e27607453c6e5e7bb237348caea3136871480bbf
    location = models.ForeignKey(Town, on_delete=models.CASCADE, null=True)

    title = models.CharField(max_length=35)
    price = models.IntegerField(default=0) 
    description = models.TextField(max_length=500)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title

<<<<<<< HEAD
class Post_rating(models.Model):
    postID = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    avg_rating = models.IntegerField(default=0)
    nr_of_ratings = models.IntegerField(default=0)

    def __unicode__(self):
        return '{0}'.format(self.content)

=======
    # @property
    def reviews(self):
        return self.postreview_set.all()

class PostReview(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    rating = models.IntegerField(default=0)
    comment = models.CharField(max_length=500)
    reviewauthor = models.ForeignKey(Account, null=True)
    def __unicode__(self):
        return u'%s (%d)' % (self.post, self.id)
>>>>>>> e27607453c6e5e7bb237348caea3136871480bbf

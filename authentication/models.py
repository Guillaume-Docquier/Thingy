from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.db import models


#from review.views import ReviewViewSet
#import Review
from django.db.models import Avg

class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')

        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')

        account = self.model(
            email=self.normalize_email(email), username=kwargs.get('username')
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)

        account.is_admin = True
        account.save()

        return account

class Account(AbstractBaseUser):
    username = models.CharField(max_length=40, unique=True)
    email = models.EmailField(unique=True)

    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    tagline = models.CharField(max_length=140, blank=True)

    is_admin = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # The default image is default.png so we should always have it in media/userimages/
    image = models.ImageField(upload_to='userimages/', default='userimages/default.png')


    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __unicode__(self):
        return self.username

    def get_full_name(self):
        return u' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    @property
    def avg_rating(self):
        from review import models
        data = models.Review.objects.filter(reviewed_user=self.id).aggregate(avg_rating=Avg('rating__rating_grade')).values()
        if data[0] == None:
            return 'Not rated yet'
        else:
            return data[0]



class UserImage(models.Model):
    user = models.ForeignKey(Account)
    image = models.ImageField(max_length = None,  upload_to='userimages', default = 'userimages/None-No-img.jpg')

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.db import models

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
<<<<<<< HEAD
=======


>>>>>>> cb628b9624bf521fe3f5c1482dfcf549003c76b4
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

    # @property
    def reviews(self):
        return self.review_set.all()




class Review(models.Model):
    revieweduser = models.ForeignKey(Account, null=True, on_delete=models.CASCADE)
    rating = models.IntegerField(default=0)
    comment = models.CharField(max_length=500)
    #comments = models.CharField(max_length=500)

    def __unicode__(self):
        return u'%s (%d)' % (self.revieweduser, self.id)


class UserImage(models.Model):
    user = models.ForeignKey(Account)
    image = models.ImageField(max_length = None,  upload_to='userimages', default = 'userimages/None-No-img.jpg')

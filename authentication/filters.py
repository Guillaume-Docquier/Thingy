import django_filters
from authentication.models import *

class AccountFilter(django_filters.FilterSet):
    class Meta:
        model = Account
        fields = ['username']
import django_filters
from message.models import *

class RentMessageFilter(django_filters.FilterSet):

    class Meta:
        model = RentMessage
        fields = ['type', 'rentee', 'thingy__author']

class PrivateMessageFilter(django_filters.FilterSet):
    class Meta:
        model = PrivateMessage
        fields = ['author', 'recipient', 'created_at', 'unread']

class RequestFilter(django_filters.FilterSet):
    class Meta:
        model = Request
        fields = ['rentee', 'thingy__author', 'status']






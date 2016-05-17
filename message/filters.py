import django_filters
from message.models import RentMessage

class RentMessageFilter(django_filters.FilterSet):
    class Meta:
        model = RentMessage
        fields = ['type', 'rentee']






import django_filters
from message.models import Message


class MessageFilter(django_filters.FilterSet):
    class Meta:
        model = Message
        fields = ['type', 'author', 'recipient']



# class RecipientFilter(django_filters.FilterSet):
#     filter_overrides = {
#         models.CharField: {
#             'filter_class': django_filters.CharFilter,
#             'extra': lambda f: {
#                 'lookup_expr': 'icontains',
#             },
#         }
#     }
#
#     class Meta:
#         model = Message, Account
#         fields = ['type']



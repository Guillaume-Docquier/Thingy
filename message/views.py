from rest_framework import viewsets,filters

from django.db.models.query_utils import Q

from message.serializers import *
from message.filters import *

from posts.models import Post

class RentMessageViewSet(viewsets.ModelViewSet):
    queryset = RentMessage.objects.all()
    serializer_class = RentMessageSerializer

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = RentMessageFilter

    def perform_create(self, serializer):
        serializer.save(rentee=self.request.user)

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = RequestFilter

    def perform_create(self, serializer):
        instance = serializer.save(rentee=self.request.user)
        post = Post.objects.get(Q(id=instance.thingy_id))
        RentMessage.objects.create(thingy_id=instance.thingy_id, rentee=instance.rentee,
                                   start_date=instance.start_date, end_date=instance.end_date,
                                   created_at=instance.created_at, body="The user %s wants to rent your Thingy. You can go in 'My requests' to accept or decline the offer. Additional comment from the user: %s" % (post.author.username, instance.body),
                                   type='Rent request', unread=True)        

class PrivateMessageViewSet(viewsets.ModelViewSet):
    queryset = PrivateMessage.objects.all()
    serializer_class = PrivateMessageSerializer

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = PrivateMessageFilter

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

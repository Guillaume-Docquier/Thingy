from django.shortcuts import render
from rest_framework import viewsets
from message.models import Message
from message.serializers import MessageSerializer, RecipientSerializer
from authentication.models import Account
from rest_framework import filters
from message.filters import MessageFilter

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)

    filter_class = MessageFilter

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class RecipientViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = RecipientSerializer

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    #filter_class = RecipientFilter
    #ordering_fields = ('title', 'price', 'created_at')

    #search_fields = ('title', 'description')
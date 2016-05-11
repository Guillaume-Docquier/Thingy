from django.shortcuts import render
from rest_framework import viewsets
from message.models import Message
from message.serializers import MessageSerializer, RecipientSerializer
from authentication.models import Account

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class RecipientViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = RecipientSerializer
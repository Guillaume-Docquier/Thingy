from django.shortcuts import render
from rest_framework import viewsets
from message.models import *
from message.serializers import *
from authentication.models import Account
from rest_framework import filters
from message.filters import *

class RentMessageViewSet(viewsets.ModelViewSet):
    queryset = RentMessage.objects.all()
    serializer_class = RentMessageSerializer

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)

    filter_class = RentMessageFilter

    def perform_create(self, serializer):
        serializer.save(rentee=self.request.user)


class RequestSerializer(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer


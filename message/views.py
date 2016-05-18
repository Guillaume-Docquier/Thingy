from rest_framework import viewsets,filters
from message.serializers import *
from message.filters import *

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

    def perform_create(self, serializer):
        instance = serializer.save(rentee=self.request.user)

        RentMessage.objects.create(thingy_id=instance.thingy_id, rentee=instance.rentee,
                                   start_date=instance.start_date, end_date=instance.end_date,
                                   created_at=instance.created_at, body=instance.body,
                                   type='Rent', unread=True)








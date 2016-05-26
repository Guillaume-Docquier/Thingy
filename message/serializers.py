from rest_framework import serializers
from message.models import *
from datetime import date
from datetime import datetime
import time
import datetime
from autoupdate import *
from authentication.serializers import AccountSerializer

class ChoicesField(serializers.Field):
    def __init__(self, choices, **kwargs):
        self._choices = choices
        super(ChoicesField, self).__init__(**kwargs)

    def to_representation(self, obj):
        return self._choices[obj]

    def to_internal_value(self, data):
        return getattr(self._choices, data)

class RentMessageSerializer(serializers.ModelSerializer):
    rentee = serializers.ReadOnlyField(source='rentee.username')

    class Meta:
        model = RentMessage
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    rentee = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Request
        fields = '__all__'

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)

        instance.save()
        if instance.status == 'Accepted':
            type = 'Rent accepted'
        else:
            type = 'Rent declined'

        RentMessage.objects.create(thingy_id=validated_data.get('thingy').id, rentee=instance.rentee,
                                    start_date=instance.start_date, end_date=instance.end_date,
                                    created_at=instance.created_at, body="The user %s %s your offer." % (instance.rentee.username, instance.status.lower()),
                                    type=type, unread=True)

        return instance

class PrivateMessageSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)
    a = time.strftime("%x")
    print(a)
    class Meta:
        model = PrivateMessage
        fields = '__all__'

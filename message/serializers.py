from rest_framework import serializers
from autoupdate import *

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
    rentee = serializers.ReadOnlyField(source='rentee.username')

    class Meta:
        model = Request
        fields = '__all__'

class PrivateMessageSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = PrivateMessage
        fields = '__all__'









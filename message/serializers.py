from rest_framework import serializers
#from django.contrib.auth.models import User
from message.models import Message, messTypes
from authentication.models import Account

class MessageSerializer(serializers.ModelSerializer):

    recipient = serializers.ReadOnlyField()
    author = serializers.ReadOnlyField(source='author.username')
    type = serializers.PrimaryKeyRelatedField(queryset=messTypes.objects.all(), write_only=True)

    class Meta:
        model = Message
        fields = ('recipient','author','type', 'created', 'body', 'unread')

class RecipientSerializer(serializers.ModelSerializer):
    messages = serializers.PrimaryKeyRelatedField(many=True,queryset=Message.objects.all())

    class Meta:
        model = Account
        fields = ('id', 'username', 'messages')
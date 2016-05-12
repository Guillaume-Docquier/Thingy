from rest_framework import serializers
from message.models import Message, messTypes
from authentication.models import Account

class messTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = messTypes
        fields = ('id', 'type')
        read_only_fields = ('id')

class MessageSerializer(serializers.ModelSerializer):

    author = serializers.ReadOnlyField(source='author.username')
    type = serializers.PrimaryKeyRelatedField(queryset=messTypes.objects.all())
    class Meta:
        model = Message

        fields = ('id','author', 'type', 'created', 'body', 'unread', 'recipient')

class RecipientSerializer(serializers.ModelSerializer):

    messages = MessageSerializer(many=True)
    class Meta:
        model = Account
        fields = ('username', 'messages')


# recipient = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), write_only=True)
# recipient = serializers.StringRelatedField(many=True)
# location = serializers.PrimaryKeyRelatedField(queryset=Town.objects.all(), write_only=True)
# type = messTypeSerializer()
#type = serializers.PrimaryKeyRelatedField(queryset=messTypes.objects.all(), write_only=True)

#messages = serializers.StringRelatedField(many=True)
#messages = serializers.PrimaryKeyRelatedField(queryset=Message.objects.all())

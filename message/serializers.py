from rest_framework import serializers
#from django.contrib.auth.models import User
from message.models import Message, messTypes
from authentication.models import Account

# class AccountSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Account
#         fields = ('author',)

#
# class MessageSerializer(serializers.ModelSerializer):
#
#     author = serializers.ReadOnlyField(source='author.username')
#     #recipient = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), write_only=True)
#     recipient = serializers.StringRelatedField(many=True)
#
#     #location = serializers.PrimaryKeyRelatedField(queryset=Town.objects.all(), write_only=True)
#     type = serializers.PrimaryKeyRelatedField(queryset=messTypes.objects.all(), write_only=True)
#
#     class Meta:
#         model = Message
#         fields = ('author','type', 'created', 'body', 'unread', 'recipient')
#
# class RecipientSerializer(serializers.ModelSerializer):
#     messages = serializers.PrimaryKeyRelatedField(many=True,queryset=Message.objects.all(), write_only=True)
#
#     class Meta:
#         model = Account
#         fields = ('id', 'username', 'messages')
#
#
#         # location_details = TownSerializer(source='location', read_only=True, required=False)
#         # location = serializers.PrimaryKeyRelatedField(queryset=Town.objects.all(), write_only=True)

class messTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = messTypes
        fields = ('id', 'type')
        read_only_fields = ('id')

class MessageSerializer(serializers.ModelSerializer):

    author = serializers.ReadOnlyField(source='author.username')
    #recipient = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), write_only=True)
    #recipient = serializers.StringRelatedField(many=True)

    #location = serializers.PrimaryKeyRelatedField(queryset=Town.objects.all(), write_only=True)
    #type = messTypeSerializer()
    type = serializers.PrimaryKeyRelatedField(queryset=messTypes.objects.all())
    #type = serializers.PrimaryKeyRelatedField(queryset=messTypes.objects.all(), write_only=True)

    class Meta:
        model = Message
        fields = ('id','author', 'type', 'created', 'body', 'unread', 'recipient')


class RecipientSerializer(serializers.ModelSerializer):
    #messages = serializers.StringRelatedField(many=True)
    messages = MessageSerializer(many=True)
    #messages = serializers.PrimaryKeyRelatedField(queryset=Message.objects.all())
    class Meta:
        model = Account
        fields = ('username', 'messages')
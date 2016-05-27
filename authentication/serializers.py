from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from django.core.validators import RegexValidator

#from posts.serializers import PostSerializer

from authentication.models import Account, UserImage

from posts.fields import Base64ImageField
#from posts.models import Post



class AccountSerializer(serializers.ModelSerializer):
    alphanumeric = RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')
    password = serializers.CharField(write_only=True, required=False, min_length = 8, validators=[alphanumeric])
    confirm_password = serializers.CharField(write_only=True, required=False, min_length = 8, validators=[alphanumeric])
    # The client-side will send a base64 string of the image binary data.
    # Base64ImageField is in posts.fields.py and converts the string to binary data.
    # The model uses a normal ImageField after that.
    image = Base64ImageField(required=False)
    #image = serializers.ImageField(max_length=None, use_url=True, required=False)

    avg_rating = serializers.ReadOnlyField()

    class Meta:
        model = Account
        fields = ('id', 'email', 'username', 'created_at', 'updated_at',
                  'first_name', 'last_name', 'tagline', 'password', 'confirm_password',
                    'image', 'avg_rating')
        read_only_fields = ('created_at', 'updated_at',)

    def create(self, validated_data):

        return Account.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.tagline = validated_data.get('tagline', instance.tagline)
        instance.image = validated_data.get('image', instance.image)

        instance.save()

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and confirm_password and password == confirm_password:
            print "Saving password"
            instance.set_password(password)
            instance.save()

        update_session_auth_hash(self.context.get('request'), instance)



        return instance


class AuthorPostSerializer(serializers.ModelSerializer):
      posts = serializers.StringRelatedField(many=True)

      class Meta:
          model = Account
          fields = ('id', 'username', 'posts')

          class UserImageSerializer(serializers.HyperlinkedModelSerializer):
              class Meta:
                  model = UserImage
                  fields = ('url', 'id', 'user', 'image')
                  user = serializers.Field(source='user.username')

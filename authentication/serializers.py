from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

#from posts.serializers import PostSerializer

from authentication.models import Account, UserImage

from posts.fields import Base64ImageField
#from posts.models import Post



class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    # The client-side will send a base64 string of the image binary data.
    # Base64ImageField is in posts.fields.py and converts the string to binary data.
    # The model uses a normal ImageField after that.
    image = Base64ImageField(required=False)
    #image = serializers.ImageField(max_length=None, use_url=True, required=False)

    class Meta:
        model = Account
        fields = ('id', 'email', 'username', 'created_at', 'updated_at',
                  'first_name', 'last_name', 'tagline', 'password', 'confirm_password',
                    'image')
        read_only_fields = ('created_at', 'updated_at',)

        def create(self, validated_data):
            return Account.objects.create(**validated_data)

        def update(self, instance, validated_data):
            instance.username = validated_data.get('username', instance.username)
            instance.tagline = validated_data.get('tagline', instance.tagline)

            instance.save()

            password = validated_data.get('password', None)
            confirm_password = validated_data.get('confirm_password', None)

            if password and confirm_password and password == confirm_password:
                instance.set_password(password)
                instance.save()

            update_session_auth_hash(self.context.get('request'), instance)

            return instance

class AuthorPostSerializer(serializers.ModelSerializer):
      posts = serializers.StringRelatedField(many=True)

      class Meta:
          model = Account
          fields = ('id', 'username', 'posts')




# class SimpleReviewSerializer(serializers.ModelSerializer):
#     revieweduser = AccountSerializer(read_only=True, required=False)
#
#     class Meta:
#         model = Review
#         fields = ('id', 'rating', 'revieweduser')


#
# class AccountWithReviews(AccountSerializer):
#     reviews = SimpleReviewSerializer(read_only=True, required=False, many=True)
#
#     class Meta(AccountSerializer.Meta):
#         fields = ('id', 'email', 'username', 'created_at', 'updated_at',
#                   'first_name', 'last_name', 'tagline', 'password',
#                   'confirm_password', 'reviews' , 'image')
#
#
#
# class ReviewSerializer(serializers.ModelSerializer):
#     #author = AccountSerializer(read_only=True, required=False)
#     author = serializers.ReadOnlyField(source = 'author.username')
#
#     #revieweduser = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), write_only=True)
#
#     #revieweduser = AccountSerializer()
#     #revieweduser = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), write_only=True)
#     #post = PostSerializer(read_only=True, required=False)
#     #= AccountSerializer()
#
#     class Meta:
#         model = Review
#         fields = ('id','author' ,'rating', 'comment', 'revieweduser')
#         read_only_fields = ('id')
#
#     #def create(self, validated_data):
#         #revieweduser_data = validated_data.pop('revieweduser')
#         #username = Review.objects.create(**validated_data)
#         #Account.objects.create(username=username, **profile_data)
#         #return username
#         #read_only_fields = ('id')
#
#     # def get_validation_exclusions(self, *args, **kwargs):
#     #     exclusions = super(ReviewSerializer, self).get_validation_exclusions()
#     #
#     #     return exclusions + ['author']

class UserImageSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = UserImage
        fields = ('url','id', 'user', 'image')
        user = serializers.Field(source='user.username')

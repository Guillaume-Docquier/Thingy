from django.forms import ModelForm, CharField, PasswordInput
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

#Registration of User

class UserForm(ModelForm):
    password1 = CharField(widget=PasswordInput())
    password2 = CharField(widget=PasswordInput())

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']

    def clean(self):
        data = self.cleaned_data
        if "password1" in data and "password2" in data and data["password1"] != data["password2"]:
            raise ValidationError(u'Passwords does not match.')
        return data

    def save(self, *args, **kwargs):
        user = super(UserForm, self).save()
        if self.cleaned_data['password1']:
            user.set_password(self.cleaned_data['password1'])
            user.save()
        if not user.password:
            user.set_password('!')
            user.save()
        return user

#Registration of Item

	

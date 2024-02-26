from django import forms 
from captcha.fields import CaptchaField


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
    captcha = CaptchaField()

class _2faForm(forms.Form):
    code = forms.CharField()
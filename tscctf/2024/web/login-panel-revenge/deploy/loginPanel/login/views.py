from django.shortcuts import render, redirect
from django.http import HttpResponse
import random
from .forms import LoginForm, _2faForm
import logging


# Create your views here.
def index(request):
    return redirect(login)

def login(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if not form.is_valid():
            return redirect(f'/login?error=Invalid CAPTCHA')
        if (form.cleaned_data["username"] == "admin" and form.cleaned_data["password"] == "admin"): 
            request.session["username"] = "admin"
            request.session["2fa_passed"] = False
            code = random.randint(100000, 2**1024)
            request.session["2fa_code"] = code
            logging.warning(f'2FA code: {code}')
            return redirect(_2fa)
        return redirect(f'/login?error=Invalid username/password')
    return render(request, "login.html", {"error": request.GET.get("error"), 'form': LoginForm()})

def _2fa(request):
    if not request.session.get("username"):
        return redirect("/login")
    if request.session.get("2fa_passed"):
        return redirect("/dashboard")
    if request.method == "POST":
        form = _2faForm(request.POST)
        if not form.is_valid():
            return redirect(f'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        code = request.session.get("2fa_code")
        if form.cleaned_data['code'] == str(code):
            request.session["2fa_passed"] = True
            return redirect("/dashboard")
        return redirect("/2fa?error=Invalid code")
    return render(request, "2fa.html", {"error": request.GET.get("error")})

def dashboard(request):
    if not request.session.get("username"):
        return redirect(login)
    if not request.session.get("2fa_passed"):
        return redirect(login)
    FLAG = 'TSC{e697a9e5ae89efbc81e69c89e4babae69c83e68a8ae98099e5808be69db1e8a5bfe8a7a3e9968be4be86e79c8be5978eefbc9fe79c8be8b5b7e4be86e5a5bde5838fe69c89efbc81efbc81}'
    return render(request, "dashboard.html", {"username": request.session.get("username"), "FLAG": FLAG})

def logout(request):
    request.session.flush()
    return redirect(login)
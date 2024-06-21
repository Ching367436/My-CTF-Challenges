from django.shortcuts import render, redirect
from django.http import HttpResponse
import random
from .forms import LoginForm, _2faForm
import logging
from base64 import b64decode
import os


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
            return redirect(f'https://www.youtube.com/watch?v=W8DCWI_Gc9c')
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
    FLAG = os.environ.get("FLAG")
    return render(request, "dashboard.html", {"username": request.session.get("username"), "FLAG": FLAG})

def image(request):
    # return the b64decoded image of file parameter
    path = request.GET.get("file")
    if not path:
        return HttpResponse("No file specified", status=400)
    path = b64decode(path).decode()
    
    path = os.path.join('/loginPanel', path)
    path = os.path.normpath(path)

    # prevent directory traversal
    if not path.startswith('/loginPanel'):
        return HttpResponse("Invalid file", status=400)
    
    # read the file
    with open(path, 'rb') as f:
        data = f.read()

    # return the file
    return HttpResponse(data, content_type="image/png")

    

    

def logout(request):
    request.session.flush()
    return redirect(login)
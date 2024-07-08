# Login Panel Revenge Revenge

- Category: Web
- Solves: 
  - All: 4 / 253 (score > 100)
## Description
The saga continues in "Login Panel Revenge Revenge," where the shadows of past vulnerabilities linger and new defenses have been erected. After the tumultuous events of "Login Panel Revenge," the architects behind the infamous login panel have doubled down, patching old weaknesses and introducing an array of perplexing new security measures.

For your information: [Login Panel](https://github.com/Ching367436/My-CTF-Challenges/blob/main/ais3-pre-exam/2023/web/login-panel), [Login Panel Revenge](https://github.com/Ching367436/My-CTF-Challenges/blob/main/tscctf/2024/web/login-panel-revenge).

## Solution

In [login/views.py:19](https://github.com/Ching367436/My-CTF-Challenges/blob/main/ais3-pre-exam/2024/web/login-panel-revenge-revenge/dist/loginPanel/login/views.py#L19), we can see that the admin's password is `admin`. The only part left is to bypass the 2FA. The 2FA code is stored inside `request.session["2fa_code"]`, which will be stored to `/loginPanel/db.sqlite3` (It's the Django DB file, the path can be found at [loginPanel/loginPanel/settings.py:93](https://github.com/Ching367436/My-CTF-Challenges/blob/main/ais3-pre-exam/2024/web/login-panel-revenge-revenge/dist/loginPanel/loginPanel/settings.py#L93-L98)). So if we could somehow leak the file, we could get the 2FA code.

```python
def login(request):
    if request.method == "POST":
      # [...]
      if (form.cleaned_data["username"] == "admin" and form.cleaned_data["password"] == "admin"):
          request.session["username"] = "admin"
          request.session["2fa_passed"] = False
          code = random.randint(100000, 2**1024)
          request.session["2fa_code"] = code
          logging.warning(f'2FA code: {code}')
          return redirect(_2fa)
```

In [login/views.py:53](https://github.com/Ching367436/My-CTF-Challenges/blob/main/ais3-pre-exam/2024/web/login-panel-revenge-revenge/dist/loginPanel/login/views.py#L53-L72), we have an LFI vulnerability that can be exploited to steal the `/loginPanel/db.sqlite3` file.

```python
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

```

We now have the Django database, so the final step is to extract the 2FA code from it. The code for extracting the 2FA code can be found [here](https://github.com/Ching367436/My-CTF-Challenges/blob/main/ais3-pre-exam/2024/web/login-panel-revenge-revenge/exp/exp.py#L54-L68).

See [exp/exp.py](exp/exp.py) for the complete exploit script.

## Unintended Solution

We can retrieve all the `sessionid` values from `/loginPanel/db.sqlite3`. If someone has already passed the 2FA, using their `sessionid` can also log in as an admin.

`Whale120` and `ianiiaannn` solved it using this method. Check out their write-ups:

- [Whale120's write-up](https://wha13.github.io/2024/06/29/ais3-pre-exam-2024/#Login-Panel-Revenge-Revenge)

- [ianiiaannn's write-up](https://iancmd.dev/posts/ctf/ais3-2024-pre-exam/#login-panel-revenge-revenge)

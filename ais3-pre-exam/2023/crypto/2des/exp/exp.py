from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad

res = '6020e9735ca3bf2f63aebcf3622c994880ffed2b509c91414c75d4c500ee80f4'
hint_pt = '414953337b3f3f3f3f3f3f3f3f3f3f7d'
hint = '118cd68957ac93b269335416afda70e6d79ad65a09b0c0c6c50917e0cee18c93'
iv = '4149533320e4b889'

res = bytes.fromhex(res)
hint_pt = bytes.fromhex(hint_pt)
hint = bytes.fromhex(hint)
iv = bytes.fromhex(iv)


def encrypt(key, iv, plaintext) -> bytes:
    cipher = DES.new(key, DES.MODE_CBC, iv)
    ciphertext = cipher.encrypt(pad(plaintext, DES.block_size))
    return ciphertext


def decrypt(key, iv, ciphertext):
    cipher = DES.new(key, DES.MODE_CBC, iv)
    plaintext = unpad(cipher.decrypt(ciphertext), DES.block_size)
    return plaintext


def main():
    middle = {}
    for i in range(0b11110000, 0b11111111, 2):
        print(f'{i}/255')
        for j in range(0b11110000, 0b11111111, 2):
            for k in range(0b11110000, 0b11111111, 2):
                for l in range(0b11110000, 0b11111111, 2):
                    for m in range(0b11110000, 0b11111111, 2):
                        for n in range(0b11110000, 0b11111111, 2):
                            for o in range(0b11110000, 0b11111111, 2):
                                for p in range(0b11110000, 0b11111111, 2):
                                    key1 = bytes([i, j, k, l, m, n, o, p])
                                    middle[encrypt(key1, iv, hint_pt)] = key1

    for i in range(0b11110000, 0b11111111, 2):
        print(f'{i}/255')
        for j in range(0b11110000, 0b11111111, 2):
            for k in range(0b11110000, 0b11111111, 2):
                for l in range(0b11110000, 0b11111111, 2):
                    for m in range(0b11110000, 0b11111111, 2):
                        for n in range(0b11110000, 0b11111111, 2):
                            for o in range(0b11110000, 0b11111111, 2):
                                for p in range(0b11110000, 0b11111111, 2):
                                    key2 = bytes([i, j, k, l, m, n, o, p])
                                    try:
                                        if decrypt(key2, iv, hint) in middle:
                                            key1 = middle[decrypt(
                                                key2, iv, hint)]
                                            print(f"key1: {key1.hex()}")
                                            print(f"key2: {key2.hex()}")
                                            m = decrypt(
                                                key1, iv, decrypt(key2, iv, res))
                                            print(f"flag: {m.decode()}")
                                            return
                                    except:
                                        continue


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from ast import literal_eval

from pwn import *

context.log_level = 'error'

def aes_cbc_decrypt(encrypted_msg: bytes, key: bytes) -> bytes:
    """
    Decrypts a message encrypted using AES in CBC mode.
    
    Parameters:
        encrypted_msg (bytes): The encrypted message (IV + ciphertext).
        key (bytes): The decryption key (must be 16, 24, or 32 bytes long).
    
    Returns:
        bytes: The original plaintext message.
    """
    if len(key) not in {16, 24, 32}:
        raise ValueError("Key must be 16, 24, or 32 bytes long.")
    
    # Extract the IV (first 16 bytes) and ciphertext (remaining bytes)
    iv = encrypted_msg[:16]
    ciphertext = encrypted_msg[16:]
    
    # Create the AES cipher in CBC mode
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    
    # Decrypt the ciphertext
    padded_msg = decryptor.update(ciphertext) + decryptor.finalize()
    return padded_msg
    
    # Remove padding from the decrypted message
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    msg = unpadder.update(padded_msg) + unpadder.finalize()
    
    return msg

def getBlock(offset):
    io = remote('172.31.2.2', 36363)
    io.sendlineafter(b'What do you want to know? ', bytes(str(offset), 'utf-8'))

    io.recvuntil(b'key = ')
    key = io.recvline(keepends=False).decode()
    key = literal_eval(key)

    io.recvuntil(b'encrypted_image[k0n:k0n+32] = ')
    c = io.recvline(keepends=False).decode()
    c = literal_eval(c)
    if len(c) == 0 or len(c) == 16:
        return b''

    m = aes_cbc_decrypt(c, key)
    io.close()

    return m

def main():
    res = b''
    for i in range(100000000000000):
        print(f'Byte {i*16}', end='\r')
        r = getBlock(i * 16)
        if len(r) == 0:
            break
        res += r
    with open('image.jpg', 'wb') as f:
        f.write(res)


if __name__ == '__main__':
    main()
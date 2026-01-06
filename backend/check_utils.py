from app.utils import encrypt_password, decrypt_password
try:
    encrypted = encrypt_password("test_password")
    decrypted = decrypt_password(encrypted)
    print(f"Encryption check: {'Success' if decrypted == 'test_password' else 'Failed'}")
except Exception as e:
    print(f"Encryption check failed with error: {e}")

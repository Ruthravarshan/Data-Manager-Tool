from cryptography.fernet import Fernet
import os
import base64

# Use a fixed key for development to ensure credentials persist across restarts
# In production, this should be an environment variable
# Generated using Fernet.generate_key()
FIXED_KEY = b'w0q0_x_y_z_1234567890abcdefghijklmnopqrstuv=' 

# Try to get from env, else use fixed key
ENCRYPTION_KEY = os.getenv("DB_ENCRYPTION_KEY", None)
if not ENCRYPTION_KEY:
    # Use a specific fallback key for consistency in this dev environment
    # Must be 32 url-safe base64-encoded bytes
    ENCRYPTION_KEY = b'NKXfVHgESHRBCHBmXsjYltDDqRHDbtzvIvst3XJa1HQ='

if isinstance(ENCRYPTION_KEY, str):
    ENCRYPTION_KEY = ENCRYPTION_KEY.encode()

cipher_suite = Fernet(ENCRYPTION_KEY)

def encrypt_password(password: str) -> str:
    if not password:
        return ""
    return cipher_suite.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password: str) -> str:
    if not encrypted_password:
        return ""
    try:
        return cipher_suite.decrypt(encrypted_password.encode()).decode()
    except Exception:
        # Fallback if decryption fails (e.g., if we changed keys or it's plain text)
        return encrypted_password

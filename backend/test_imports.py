print("Checking imports...")
try:
    from app.main import app
    print("✓ Main app imported")
    from app.routers import dashboard, studies, integrations, activities, data_files, preview
    print("✓ All routers imported")
    print("Backend import test successful!")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()

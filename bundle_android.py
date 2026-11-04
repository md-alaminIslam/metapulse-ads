import os
import zipfile

def zipdir(path, ziph):
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            # archive path relative to the android folder
            arcname = os.path.relpath(file_path, os.path.dirname(path))
            ziph.write(file_path, arcname)

os.makedirs('public', exist_ok=True)
zipf = zipfile.ZipFile('public/metapulse-android-project.zip', 'w', zipfile.ZIP_DEFLATED)
zipdir('android', zipf)
zipf.close()

print("Created public/metapulse-android-project.zip successfully!")

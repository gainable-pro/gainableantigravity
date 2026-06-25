import shutil
import os

project_root = r"C:\Users\gmaro\.gemini\antigravity-ide\scratch\gainable-fr"

mappings = {
    "extracted_all_slide_3_img_5.png": "user_scr_search.png",
    "extracted_all_slide_4_img_5.png": "user_scr_profile.png",
    "extracted_all_slide_4_img_6.png": "user_scr_profile_mobile.png",
    "extracted_all_slide_5_img_4.png": "user_scr_articles.png",
    "extracted_all_slide_6_img_5.png": "user_scr_seo.png",
    "extracted_slide_7_img_0.png": "user_scr_labels.png",
    "extracted_slide_8_img_0.png": "user_scr_pricing.png"
}

for src, dest in mappings.items():
    src_path = os.path.join(project_root, src)
    dest_path = os.path.join(project_root, dest)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src} to {dest}")
    else:
        print(f"File {src} not found!")

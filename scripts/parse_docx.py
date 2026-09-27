import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = r'videos/motion_video_effect/Gainable_Master_Prompt_Book.docx'
out_path = r'videos/motion_video_effect/Gainable_Master_Prompt_Book.txt'

with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)
    
    paragraphs = []
    # Find all paragraphs (p elements)
    for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
        if texts:
            paragraphs.append(''.join(texts))

    full_text = '\n\n'.join(paragraphs)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(full_text)

print(f"Extracted {len(full_text)} characters into {out_path}")

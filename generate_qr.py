import sys
import subprocess

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import qrcode
    from PIL import Image, ImageDraw
except ImportError:
    install("qrcode")
    install("pillow")
    import qrcode
    from PIL import Image, ImageDraw

def get_fat_anchor_mask(size):
    scale = 20
    w = size * scale
    h = size * scale
    img = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(img)
    cx = w / 2
    
    # Extremely fat anchor (85%+ coverage)
    draw.ellipse([cx - w*0.4, h*0.0, cx + w*0.4, h*0.45], fill=255) # Massive ring
    draw.ellipse([cx - w*0.05, h*0.15, cx + w*0.05, h*0.25], fill=0) # Tiny hole
    draw.rectangle([cx - w*0.45, h*0.35, cx + w*0.45, h*0.5], fill=255) # Stock
    draw.rectangle([cx - w*0.35, h*0.45, cx + w*0.35, h*0.9], fill=255) # Shank
    draw.polygon([(cx, h*0.4), (cx - w*0.5, h*1.0), (cx + w*0.5, h*1.0)], fill=255) # Flukes
    
    img = img.resize((size, size), Image.BILINEAR)
    
    mask = []
    for y in range(size):
        row = []
        for x in range(size):
            row.append(img.getpixel((x, y)) > 128)
        mask.append(row)
    return mask

def get_classic_anchor_mask(size):
    scale = 20
    w = size * scale
    h = size * scale
    img = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(img)
    cx = w / 2
    
    draw.ellipse([cx - w*0.25, h*0.05, cx + w*0.25, h*0.35], outline=255, width=int(w*0.1))
    draw.rectangle([cx - w*0.08, h*0.35, cx + w*0.08, h*0.8], fill=255)
    draw.rectangle([cx - w*0.35, h*0.4, cx + w*0.35, h*0.5], fill=255)
    draw.arc([cx - w*0.4, h*0.4, cx + w*0.4, h*0.8], start=0, end=180, fill=255, width=int(w*0.1))
    ly = h * 0.6
    draw.polygon([(cx - w*0.4 - w*0.1, ly + w*0.1), (cx - w*0.4 + w*0.1, ly + w*0.1), (cx - w*0.4, ly - w*0.1)], fill=255)
    draw.polygon([(cx + w*0.4 - w*0.1, ly + w*0.1), (cx + w*0.4 + w*0.1, ly + w*0.1), (cx + w*0.4, ly - w*0.1)], fill=255)
    
    img = img.resize((size, size), Image.BILINEAR)
    
    mask = []
    for y in range(size):
        row = []
        for x in range(size):
            row.append(img.getpixel((x, y)) > 64)
        mask.append(row)
    return mask

def is_finder(x, y, N, border=4):
    if border <= x < border + 7 and border <= y < border + 7: return True
    if N - border - 7 <= x < N - border and border <= y < border + 7: return True
    if border <= x < border + 7 and N - border - 7 <= y < N - border: return True
    return False

def generate():
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data('https://www.canaanglobalinternational.com')
    qr.make(fit=True)
    matrix = qr.modules
    N = len(matrix)
    border = 4
    
    qr_size = N - 2 * border
    mask_fat = get_fat_anchor_mask(qr_size)
    mask_classic = get_classic_anchor_mask(qr_size)
    
    # Generate 1: Fat Silhouette (Strict Intersection)
    svg1 = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {N*10} {N*10}" width="500" height="500">']
    svg1.append(f'<rect width="{N*10}" height="{N*10}" fill="white" />')
    for y in range(N):
        for x in range(N):
            if not matrix[y][x]: continue
            finder = is_finder(x, y, N, border)
            in_anchor = False
            if border <= x < N-border and border <= y < N-border:
                in_anchor = mask_fat[y-border][x-border]
            
            if finder:
                svg1.append(f'<rect x="{x*10}" y="{y*10}" width="10" height="10" fill="#996515" />') # Dark Gold
            elif in_anchor:
                svg1.append(f'<rect x="{x*10}" y="{y*10}" width="10" height="10" fill="#000080" />') # Navy
    svg1.append('</svg>')
    
    # Generate 2: Textured (Keeps all modules, non-anchor modules are smaller squares)
    svg2 = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {N*10} {N*10}" width="500" height="500">']
    svg2.append(f'<rect width="{N*10}" height="{N*10}" fill="white" />')
    for y in range(N):
        for x in range(N):
            if not matrix[y][x]: continue
            finder = is_finder(x, y, N, border)
            in_anchor = False
            if border <= x < N-border and border <= y < N-border:
                in_anchor = mask_classic[y-border][x-border]
            
            if finder:
                svg2.append(f'<rect x="{x*10}" y="{y*10}" width="10" height="10" fill="#996515" />')
            elif in_anchor:
                svg2.append(f'<rect x="{x*10}" y="{y*10}" width="10" height="10" fill="#000080" />')
            else:
                # Shrink by drawing a 6x6 rect centered in 10x10 cell. Scans perfectly!
                svg2.append(f'<rect x="{x*10 + 2}" y="{y*10 + 2}" width="6" height="6" fill="#000080" />')
    svg2.append('</svg>')

    with open('anchor_qr_fat.svg', 'w') as f:
        f.write("\n".join(svg1))
    with open('anchor_qr_textured.svg', 'w') as f:
        f.write("\n".join(svg2))
        
    svg1_str = "\n".join(svg1)
    svg2_str = "\n".join(svg2)
    html = f'''<html><body style="background: #e0e0e0; display: flex; flex-direction: column; align-items: center; padding: 50px; font-family: sans-serif;">
    <h2>Version 1: Fat Silhouette (Strict Deletion)</h2>
    {svg1_str}
    <h2 style="margin-top: 50px;">Version 2: Textured Background (100% Guaranteed Scan)</h2>
    {svg2_str}
    </body></html>'''
    
    with open('anchor_qr.html', 'w') as f:
        f.write(html)

    print("Successfully generated anchor_qr_fat.svg, anchor_qr_textured.svg and anchor_qr.html!")

if __name__ == "__main__":
    generate()

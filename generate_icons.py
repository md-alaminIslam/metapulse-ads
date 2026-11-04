import zlib
import struct
import os

def create_png(width, height, color_bg, draw_meta_symbol=True):
    # Prepare RGBA raw data
    raw_data = bytearray()
    
    # Base colors
    bg_r, bg_g, bg_b, bg_a = color_bg
    
    # We will draw a stylish Meta blue rounded badge with white pulse/chart bars
    for y in range(height):
        raw_data.append(0) # filter byte: 0 = None
        ny = (y - height / 2) / (height / 2) # -1 to 1
        for x in range(width):
            nx = (x - width / 2) / (width / 2) # -1 to 1
            
            # Default to background color
            r, g, b, a = bg_r, bg_g, bg_b, bg_a
            
            if draw_meta_symbol:
                # Rounded rect inner card or circle
                dist_sq = nx*nx + ny*ny
                
                # Draw white bar chart or pulse wave
                # Bar 1 (left): x from -0.5 to -0.3, y from 0.1 to 0.4
                # Bar 2 (mid): x from -0.15 to 0.05, y from -0.2 to 0.4
                # Bar 3 (right): x from 0.2 to 0.4, y from -0.45 to 0.4
                in_bar1 = (-0.5 <= nx <= -0.3) and (0.05 <= ny <= 0.45)
                in_bar2 = (-0.15 <= nx <= 0.05) and (-0.2 <= ny <= 0.45)
                in_bar3 = (0.2 <= nx <= 0.4) and (-0.45 <= ny <= 0.45)
                
                # Trend upward line or indicator
                in_line = False
                # Line connecting points (-0.4, 0.05) -> (-0.05, -0.2) -> (0.3, -0.45)
                # Just nice clean bars + upward dot
                dot_dist = ((nx - 0.3)**2 + (ny - (-0.6))**2)**0.5
                in_dot = dot_dist < 0.1
                
                if in_bar1 or in_bar2 or in_bar3 or in_dot:
                    r, g, b, a = 255, 255, 255, 255
            
            raw_data.extend([r, g, b, a])
            
    # PNG signature
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', len(ihdr_data)))
    png.extend(b'IHDR')
    png.extend(ihdr_data)
    png.extend(struct.pack('>I', ihdr_crc))
    
    # IDAT chunk
    compressed = zlib.compress(bytes(raw_data), 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', len(compressed)))
    png.extend(b'IDAT')
    png.extend(compressed)
    png.extend(struct.pack('>I', idat_crc))
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0))
    png.extend(b'IEND')
    png.extend(struct.pack('>I', iend_crc))
    
    return bytes(png)

os.makedirs('public', exist_ok=True)

# Generate 192x192
with open('public/pwa-192x192.png', 'wb') as f:
    f.write(create_png(192, 192, (37, 99, 235, 255)))

# Generate 512x512
with open('public/pwa-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, (37, 99, 235, 255)))

# Generate maskable 512x512 (with padding safe zone)
with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, (29, 78, 216, 255)))

# Generate apple-touch-icon 180x180
with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(create_png(180, 180, (37, 99, 235, 255)))

print("PWA Icons generated successfully!")

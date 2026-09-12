from PIL import Image
img = Image.open('public/home/header-background.png').convert('RGB')
w, h = img.size
top = 0
bottom = h - 1
for y in range(h):
    if any(sum(img.getpixel((x, y))) > 20 for x in range(0, w, 10)):
        top = y
        break
for y in range(h - 1, -1, -1):
    if any(sum(img.getpixel((x, y))) > 20 for x in range(0, w, 10)):
        bottom = y
        break
print('Cropping from', top, 'to', bottom)
cropped = img.crop((0, top, w, bottom + 1))
cropped.save('public/home/header-background.png')

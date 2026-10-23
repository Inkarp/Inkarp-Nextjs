from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw

names = [
    "BWB", "Chemspeed", "GEA", "Heidolph", "Kubota", "Labstationi",
    "Litescope", "RotaChrom", "Sonics", "SP", "Freeze_drying", "Kjel_line",
    "Nanophotometer", "AFM",
]
source = Path("tmp/pdfs")
output = source / "contacts"
output.mkdir(exist_ok=True)

for name in names:
    pdf = pdfium.PdfDocument(str(source / f"{name}.pdf"))
    images = []
    for index in range(len(pdf)):
        image = pdf[index].render(scale=0.18).to_pil().convert("RGB")
        ImageDraw.Draw(image).text((3, 3), str(index + 1), fill="red", stroke_width=1, stroke_fill="white")
        images.append(image)
    width = max(image.width for image in images)
    height = max(image.height for image in images)
    columns = 4
    rows = (len(images) + columns - 1) // columns
    contact = Image.new("RGB", (width * columns, height * rows), "white")
    for index, image in enumerate(images):
        contact.paste(image, ((index % columns) * width, (index // columns) * height))
    contact.save(output / f"{name}.png")

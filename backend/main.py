from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from generator import twobit_pixel_art, color_palettes
import matplotlib.pyplot as plt
import datetime
import os
import time
import asyncio

app = Flask(__name__)

CORS(app)

# Create public folder if it doesn't exist
if not os.path.exists('public'):
    os.makedirs('public')

async def clean_public_folder():
    """
        Delete files older than 5 minutes
    """
    now = time.time()
    for f in os.listdir('public'):
        if os.stat(os.path.join('public', f)).st_mtime < now - 60 * 5:
            if os.path.isfile(os.path.join('public', f)):
                print("Deleting file: " + f)
                os.remove(os.path.join('public', f))

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/result/<path:filename>')
def send_file(filename):
    """
    Send file from public folder
    """
    return send_from_directory('public', filename)

@app.route('/generate/2-bit-pixel-art', methods=['POST'])
async def handle_2bit_pixel_art():
    """
    Handle 2-bit pixel art generation
    """
    asyncio.ensure_future(clean_public_folder())

    image_file = request.files.get('image')
    image = plt.imread(image_file) # read image as numpy array

    total_pixels = image.shape[0] * image.shape[1]
    if total_pixels > 8947360:
        return jsonify({
            "message": "Image too large. Maximum resolution is 4K"
        }), 400
    
    pixel_size = int(request.form.get('pixel_size'))
    color_palette = request.form.get('color_palette')

    result = twobit_pixel_art(image, pixel_size, color_palettes[color_palette])
    result_file_name = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f") + ".png"
    plt.imsave("public/" + result_file_name, result) # save image to public folder

    return jsonify({
        "result_url": f"result/{result_file_name}"
    })
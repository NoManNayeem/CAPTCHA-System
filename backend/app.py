from flask import Flask, request, jsonify, send_file, abort
import os
from PIL import Image, ImageDraw, ImageFont
import random
import string
from uuid import uuid4
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simple in-memory "database" for demonstration
captcha_store = {}

def generate_text_captcha(text_length=5):
    letters = string.ascii_uppercase
    random_text = ''.join(random.choice(letters) for i in range(text_length))
    
    img = Image.new('RGB', (300, 200), color=(255, 255, 255))
    d = ImageDraw.Draw(img)

    try:
        fnt = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        fnt = ImageFont.load_default()
        print("Default font used; arial.ttf not found.")

    # Measure text size to center it
    bbox = d.textbbox((0, 0), random_text, font=fnt)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (300 - text_width) / 2
    y = (200 - text_height) / 2

    for letter in random_text:
        color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        d.text((x, y), letter, fill=color, font=fnt)
        # Move x for the next letter
        x += d.textbbox((0,0), letter, font=fnt)[2] - d.textbbox((0,0), letter, font=fnt)[0]

    captcha_id = str(uuid4())
    captcha_image_path = f'tmp/{captcha_id}.png'
    img.save(captcha_image_path)
    
    return captcha_id, captcha_image_path, random_text

def generate_numeric_captcha():
    num1 = random.randint(1, 9)
    num2 = random.randint(1, 9)
    captcha_text = f"{num1} + {num2}"
    answer = str(num1 + num2)
    
    img = Image.new('RGB', (300, 200), color=(255, 255, 255))
    d = ImageDraw.Draw(img)

    try:
        fnt = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        fnt = ImageFont.load_default()
        print("Arial font not found, using default font.")

    # Measure text size to center it
    bbox = d.textbbox((0, 0), captcha_text, font=fnt)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (300 - text_width) / 2
    y = (200 - text_height) / 2

    d.text((x, y), captcha_text, fill=(0, 0, 0), font=fnt)
    
    captcha_id = str(uuid4())
    captcha_image_path = f'tmp/{captcha_id}.png'
    img.save(captcha_image_path)
    
    return captcha_id, captcha_image_path, answer

@app.route('/generate_captcha', methods=['GET'])
def generate_captcha():
    captcha_type = request.args.get('type', 'text')
    if captcha_type == 'numeric':
        captcha_id, captcha_image_path, captcha_text = generate_numeric_captcha()
    else:
        captcha_id, captcha_image_path, captcha_text = generate_text_captcha()
    
    captcha_store[captcha_id] = captcha_text
    return jsonify({"captcha_id": captcha_id}), 200

@app.route('/verify_captcha', methods=['POST'])
def verify_captcha():
    data = request.json
    captcha_id = data.get('captcha_id')
    user_input = data.get('captcha', '')
    correct_captcha = captcha_store.pop(captcha_id, None)
    
    if not correct_captcha:
        return jsonify({"success": False, "message": "CAPTCHA not found or expired."}), 404
    
    if user_input == correct_captcha:
        return jsonify({"success": True, "message": "CAPTCHA verification passed"}), 200
    else:
        return jsonify({"success": False, "message": "CAPTCHA verification failed"}), 400

@app.route('/captcha_image/<captcha_id>', methods=['GET'])
def serve_captcha_image(captcha_id):
    captcha_path = f'tmp/{captcha_id}.png'
    if os.path.exists(captcha_path):
        return send_file(captcha_path, mimetype='image/png')
    abort(404, description="CAPTCHA image not found.")

if __name__ == '__main__':
    if not os.path.exists('tmp'):
        os.makedirs('tmp')
    app.run(debug=True)

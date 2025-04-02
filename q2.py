import os, sys
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

import copy
import io

import cv2
import onnxruntime
import torch
import torchvision
import PIL
from flask import Flask, render_template, request, jsonify, send_file
import onnxruntime as ort
import numpy as np
import json
import os

import scipy
import logging
log_file = 'app.log'
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename=log_file,
    filemode='w'
)

from define import output_model, transform

app = Flask(__name__)

session = onnxruntime.InferenceSession(output_model)

full_dataset = torchvision.datasets.MNIST(root='./data', transform=transform, download=True)

example_data = []
for xx in range(10):
    single_img = dict()
    single_img["image_data"] = full_dataset[xx][0].numpy()[0, :, :]
    single_img["class_name"] = f"n{full_dataset[xx][1]}"
    example_data.append(single_img)

    uint8_array = (255 * (single_img["image_data"] - np.min(single_img["image_data"])) /
                   (np.max(single_img["image_data"]) - np.min(single_img["image_data"]))).astype(np.uint8)
    im = PIL.Image.fromarray(uint8_array)
    im.save(f"static/output{xx}.png")
app = Flask(__name__)

def load_image(input_data):
    logging.error("load_image")
    # logging.error(f"input_data: {input_data}")
    if isinstance(input_data, str) and os.path.isfile(input_data):
        image = PIL.Image.open(input_data).convert('L').resize(example_data[0]["image_data"].shape)
        # logging.error(f"step1: {input_data}")

        if np.average(image) > 200:
            image = PIL.ImageOps.invert(image)
        # logging.error(f"step2: {input_data}")

        image_np = np.array(image,dtype=np.float32) / 255.0
        # logging.error(f"step3: {input_data}")

        uint8_array = (255 * (image_np - np.min(image_np)) /
                       (np.max(image_np) - np.min(image_np))).astype(np.uint8)
        im = PIL.Image.fromarray(uint8_array)
        im.save(f"static/Processed.png")

        if image_np is None:
            logging.error(f"Unable to load image from: {input_data}")
            raise ValueError(f"Unable to load image from: {input_data}")
        return image_np
    else:
        logging.error("Invalid input: provide a numpy array or valid file path")
        raise ValueError("Invalid input: provide a numpy array or valid file path")

def predict(image_data):
    logging.error("predict")

    image_np = load_image(image_data)
    # logging.error("load_image finished")

    ort_inputs = {session.get_inputs()[0].name: np.expand_dims(image_np, 0)}
    ort_outs = session.run(None, ort_inputs)

    # logging.error(f"run Model finished {ort_outs}")

    result = np.argmax(ort_outs[0])
    probabilities = ort_outs[0]

    # logging.error(f"Calc Prob finished: {probabilities} - {result}")

    return {
        "class_id": int(result),
        "class_name": f"n{result}",
        "probabilities": {'n' + str(i): float(probabilities[i]) for i in range(len(probabilities))}
    }

@app.route('/')
def index():
    return render_template('index.html', examples=example_data)

@app.route('/predict', methods=['POST'])
def make_prediction():
    logging.error("make_prediction")
    logging.error(request.json)

    data = request.get_json()

    file_path = data["features"][0]
    logging.error("file_path={}".format(file_path))
    try:
        result = predict(file_path)
        return jsonify(result)
    except Exception as e:
        logging.error(str(e))
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

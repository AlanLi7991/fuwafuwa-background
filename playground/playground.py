import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt
import os as os
import math as math

def isWhite(img):
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    hist = cv.calcHist([gray], [0], None, [50], [0, 256])
    white_factor = 0.2
    is_white = hist[-1, 0] > white_factor*gray.size
    return is_white


white_dir = "/White"
plain_dir = "/Plain"
for root, dirs, files in os.walk("/LoveLive"):
    for name in files:
        _, ext = os.path.splitext(name)
        if ext != ".png":
            continue
        file_path = os.path.join(root, name)
        img = cv.imread(file_path, cv.IMREAD_COLOR)
        if img is None:
            print(name)
            continue
        row, col = img.shape[:2]
        ratio = col/row
        row = 1280 if row > col else 720
        col = math.floor(row * ratio)
        target_dir = white_dir if isWhite(img) == True else plain_dir
        target_path = os.path.join(target_dir, name)
        target_path = target_path.replace(".png", ".jpg")
        # print(target_path)
        dst = cv.resize(img, (col, row))
        cv.imwrite(target_path, dst)
    pass

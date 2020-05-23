import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt


def isWhite(img):
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    hist = cv.calcHist([gray], [0], None, [50], [0, 256])
    white_factor = 0.2
    is_white = hist[-1, 0] > white_factor*gray.size
    return is_white


def findCertainBackground(img):
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    ret, otsu = cv.threshold(gray, 0, 255, cv.THRESH_OTSU)
    otsu = cv.morphologyEx(otsu, cv.MORPH_ERODE, np.ones((5, 5), dtype="uint8"))
    return otsu


def findClip(img, name=""):
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    mask = np.zeros(img.shape[:2], dtype="uint8")
    # otsu find white background
    ret, otsu = cv.threshold(gray, 0, 255, cv.THRESH_OTSU)
    erode_otsu = cv.morphologyEx(otsu, cv.MORPH_ERODE, np.ones((5, 5), np.uint8), iterations=1)
    # draw background
    fillBigArea(erode_otsu)
    # remove background
    mask[erode_otsu != 128] = 255

    # binary find dark pixels, object
    ret, binary = cv.threshold(gray, 250, 255, cv.THRESH_TOZERO_INV)
    # draw main object
    fillBigArea(binary)
    # add main object, fill lost pixels by otsu
    mask[binary == 128] = 255    
    return mask


def fillBigArea(src, factor=0.8):
    ret, contours, hierarchy = cv.findContours(src, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)
    areas = map(lambda cnt: cv.contourArea(cnt), contours)
    max_area = max(areas)

    for i, cnt in enumerate(contours):
        area = cv.contourArea(cnt)
        if area > factor*max_area:
            cv.drawContours(src, contours, i, 128, -1)

    return src


def refineClip(img, clip_mask):
    # remove all white pixels
    clip_mask[np.all(img == (255, 255, 255), -1)] = 0
    # erode
    erode = cv.morphologyEx(clip, cv.MORPH_ERODE, np.ones((5, 5), np.uint8), iterations=1)
    # fill the main object
    fillBigArea(erode)
    # get mask
    mask = np.zeros(img.shape[:2], dtype="uint8")
    mask[erode == 128] = 255
    return mask


names = ("white1.jpg", "white2.jpg", "color1.jpg", "color2.jpg")
images = []
for idx, name in enumerate(names):
    img = cv.imread("img/"+name, cv.IMREAD_COLOR)
    rgb = cv.cvtColor(img, cv.COLOR_BGR2RGB)
    result = rgb.copy()

    if isWhite(img):
        clip = findClip(img, name=name)
        refine = refineClip(img, clip)
        result[refine == 0] = (0, 0, 0)
    
    plt.subplot(2, 4, idx+1)
    plt.imshow(rgb, None)
    plt.title(name)

    plt.subplot(2, 4, idx+5)
    plt.imshow(result, None)

plt.show()

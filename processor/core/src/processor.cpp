#include "processor.h"
#include <opencv2/opencv.hpp>

using namespace cv;
using namespace std;

namespace fuwafuwa {
namespace core {

bool isWhite(cv::InputArray img, float factor = 0.2) {
    Mat gray;
    cv::cvtColor(img, gray, COLOR_BGR2GRAY);
    int bins[] = {50};
    const float range[] = {0, 256};
    const float *ranges[] = {range};
    int channels[] = {0};
    Mat hist;
    calcHist(&gray, 1, channels, Mat(), hist, 1, bins, ranges);
    auto white = int(hist.at<float_t>(hist.rows - 1, 0));
    auto count = gray.rows *gray.cols;
    auto threshold = count * factor;
    auto ret = white > threshold;
    return ret;
}

int fillBigArea(cv::InputOutputArray img, float factor = 0.8) {
    vector<vector<Point>> contours;
    vector<double> areas;
    vector<Vec4i> hierarchy;
    findContours(img, contours, hierarchy, RETR_TREE, CHAIN_APPROX_SIMPLE);
    areas.resize(contours.size());
    transform(contours.begin(), contours.end(), areas.begin(), [](const vector<Point> &contour) -> double {
        return contourArea(contour);
    });
    auto max_area = *max_element(areas.begin(), areas.end());
    for (size_t i = 0; i < contours.size(); i++) {
        if (areas.at(i) > factor * max_area) {
            drawContours(img, contours, i, 128, -1);
        }
    }
    return 0;
}

int findCertainBackground(cv::InputArray src, cv::OutputArray dst) {
    Mat gray, otsu;
    cv::cvtColor(src, gray, COLOR_BGR2GRAY);
    auto ret = threshold(gray, otsu, 0, 255, THRESH_OTSU);
    morphologyEx(otsu, dst, MORPH_ERODE, Mat::ones(5, 5, CV_8U));
    return 0;
}

int findClip(cv::InputArray src, cv::OutputArray dst) {
    Mat background;
    Mat mask = Mat::zeros(src.size(), CV_8UC1);
    // otsu find white background
    findCertainBackground(src, background);
    // draw background
    fillBigArea(background);
    // remove background
    mask.setTo(255, background != 128);

    // binary find dark pixels which means object
    Mat gray, binary;
    cvtColor(src, gray, COLOR_BGR2GRAY);
    threshold(gray, binary, 250, 255, THRESH_TOZERO_INV);
    // draw main object
    fillBigArea(binary);
    // add main object, fill lost pixels by otsu
    mask.setTo(255, binary == 128);
    mask.copyTo(dst);
    return 0;
}

int refineClip(cv::InputArray src, cv::InputArray clip_mask, cv::OutputArray result_mask) {
    // remove all white pixels
    Mat clip, white, erode;
    clip_mask.copyTo(clip);
    auto pixel = Vec3b(255, 255, 255);
    inRange(src, pixel, pixel, white);
    clip.setTo(0, white);
    // erode
    morphologyEx(clip, erode, MORPH_ERODE, Mat::ones(5, 5, CV_8U));
    // find the main object
    fillBigArea(erode);
    // get mask
    auto mask = Mat(Mat::zeros(src.size(), CV_8UC1));
    mask.setTo(255, erode == 128);
    mask.copyTo(result_mask);
    return 0;
}

int segmentWhiteImage(const std::string input, const std::string output) {
    auto img = cv::imread(input, cv::IMREAD_COLOR);
    auto is_white = isWhite(img);
    if (!is_white) {
        std::cout << "fuwafuwaImage file: " << input << " not white" << std::endl;
        return -1;
    }
    Mat clip, refine, result;
    findClip(img, clip);
    refineClip(img, clip, refine);
    cvtColor(img, result, COLOR_BGR2BGRA);
    auto clear = Vec4b(0, 0, 0, 0);
    result.setTo(clear, refine == 0);
    auto ret = imwrite(output, result);
    if (ret) {
        std::cout << "fuwafuwaImage file: " << input << " write down" << std::endl;
    } else {
        std::cout << "fuwafuwaImage file: " << input << " write failure" << std::endl;
        return -1;
    }
    return 0;
}

} // namespace core
} // namespace fuwafuwa

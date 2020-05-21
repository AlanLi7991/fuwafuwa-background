#include <iostream>
#include "processor.h"

int main() {
    auto input = "image/ZERO-R_6028.jpg";
    auto output = "cache/ZERO-R_6028.jpg";
    auto ret = fuwafuwa::core::segmentWhiteImage(input, output);
    return ret;
}
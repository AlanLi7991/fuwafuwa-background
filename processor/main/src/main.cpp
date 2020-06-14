#include <iostream>
#include "processor.h"

int main() {
    std::string input, output;
    std::cin >> input;
    output = input;
    auto i = output.rfind('.', output.length());
    if (i != std::string::npos) {
        output.replace(i + 1, 3, "png");
    }
    auto ret = fuwafuwa::core::segmentWhiteImage(input, output);
    return ret;
}
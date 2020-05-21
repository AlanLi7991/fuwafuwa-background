#include "addon.h"
#include "processor.h"
#include <iostream>
#include <string>

Napi::Number fuwafuwa::addon::fuwafuwaImage(const Napi::CallbackInfo &info) {

    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return Napi::Number::New(env, -1);
    }

    auto std_input = std::string(info[0].As<Napi::String>());
    auto std_output = std::string(info[1].As<Napi::String>());

    auto ret = fuwafuwa::core::segmentWhiteImage(std_input, std_output);

    return Napi::Number::New(env, ret);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "fuwafuwaImage"), Napi::Function::New(env, fuwafuwa::addon::fuwafuwaImage));
    return exports;
}

NODE_API_MODULE(fuwafuwa, Init)
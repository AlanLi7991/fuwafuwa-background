# ふわふわ(Fuwafuwa) Background

This is an editor background extension can bring unlimited sisters company with you code.

This work referred three other extensions:

* [vscode-background](https://github.com/shalldie/vscode-background)
* [vscode-background-cover](https://github.com/vscode-extension/vscode-background-cover)
* [vscode-fix-checksums](https://github.com/lehni/vscode-fix-checksums)

I am very appreciated those works build by pioneer

这是一个可以让十万个不同小姐姐作为背景图出现在你代码编辑器中的插件。

这项工作参考了以下几个库的源代码:

* [vscode-background](https://github.com/shalldie/vscode-background)
* [vscode-background-cover](https://github.com/vscode-extension/vscode-background-cover)
* [vscode-fix-checksums](https://github.com/lehni/vscode-fix-checksums)

我十分感谢这些先驱者的代码

## Features

![](https://github.com/AlanLi7991/fuwafuwa-background/blob/master/extension/media/sample.gif?raw=true)

This extension provides 4 mode of background

1. Default Random: use five inner images as background and loop
2. Default Stable: use fixed inner image as background
3. Custom Random: use images from folder configuration and random loop
4. Custom Stable: use fixed image from configuration as background

Above is a illustration of "Default Random" mode

本插件一共提供了四种模式

1. 默认循环模式：使用内置的固定图片作为背景图并且循环展示
2. 默认固定模式：使用内置的固定图片作为背景图
3. 自定义随机模式：使用一个文件夹作为数据库，并随机选取图片作为背景图
4. 自定义固定模式：使用一张固定的图片作为背景图

以上是 “默认循环模式” 的展示效果

## Directory

Description of sub directory

| Directory    | Module   |
| :------------ | :------------ |
| extension     | VSCode Extension Root      |
| playground    | Playground for opencv operator |
| processor     | Implement OpenCV with C++ & Build as node-addon |

子文件夹的说明

| Directory    | Module   |
| :------------ | :------------ |
| extension     | VSCode 插件根目录      |
| playground    | OpenCV操作的测试代码 |
| processor     | OpenCV的C++实现，并且给VSCode提供node-addon|

## Discussion

This extension did segment just via pixel operation, it is a practice of my [OpenCV Note](https://github.com/AlanLi7991/opencv-turtorial-notes)

If anyone has good a idea to improve the result of segment sisters from different context, please contact me by issue of github. I would like learn those knowledge and implement it.

这个插件通过简单的像素运算实现了白背景人物分割，是我[OpenCV学习笔记](https://github.com/AlanLi7991/opencv-turtorial-notes)的一个练习

如果哪位图像领域的工程师，愿意指教我其他方案来提高复杂背景的分割效果，请通过Github的issue和我联系，我十分愿意在插件中实现它。


# ふわふわ(Fuwafuwa) Background

This is an editor background extension can bring unlimited sisters company with you code.

这是一个可以让十万个不同小姐姐作为背景图出现在你代码编辑器中的插件。

![](https://github.com/AlanLi7991/fuwafuwa-background/blob/master/resource/gif/sample.gif?raw=true)

This work referred three other extensions:

这项工作参考了以下几个库的源代码:

* [vscode-background](https://github.com/shalldie/vscode-background)
* [vscode-background-cover](https://github.com/vscode-extension/vscode-background-cover)
* [vscode-fix-checksums](https://github.com/lehni/vscode-fix-checksums)

I am very appreciated those works build by pioneer

我十分感谢这些先驱者的代码

## Features

This extension provides 3 mode of background

本插件一共提供了三种模式

| Mode    | Feature    | 特点 |
| :------------ | :------------ | :------------ |
| Image 静态图片模式 | use fix image as background image | 使用固定的背景图片 |
| Random 随机图片模式 | use random images from folder or default as loop background | 使用文件夹中随机循环的背景图片 |
| Fuwafuwa 软萌萌模式 | use fuwafuwa images from folder as loop background | 使用文件夹中的图片作为数据源，进行处理后作为的背景图片 |


## Requirements

**"toggle" Commands in this extension maybe need administrator authority**

**本插件的 "注入 & 还原" 命令可能需要管理员权限，不同平台的情况如下**

"/tmp" can be any directory

"/tmp" 可以是任意文件夹

| Operator System    | How to install   | 如何获得权限   |
| :------------ | :------------ | :------------ |
| Windows   | run with the administrator authority | 以管理员身份运行 |
| MacOS     | cd /tmp && sudo code .  | cd /tmp && sudo code .    |

## Extension Settings

Settings need redo "toggle" command

需要再次执行 “注入&还原” 指令的配置选项

| Settings    |  Function   |  作用   |
| :------------ | :------------ | :------------ |
| fuwafuwa.interval | control the random loop interval | 控制随机循环的时间间隔 |
| fuwafuwa.style    | control the background css style | 控制背景图片展示的CSS样式 |

## Discussion

This extension did segment just via pixel operation, it is a practice of my [OpenCV Note](https://github.com/AlanLi7991/opencv-turtorial-notes)

If anyone has good a idea to improve the result of segment sisters from different context, please contact me by issue of github. I would like learn those knowledge and implement it.

这个插件通过简单的像素运算实现了白背景人物分割，是我[OpenCV学习笔记](https://github.com/AlanLi7991/opencv-turtorial-notes)的一个练习

如果哪位图像领域的工程师，愿意指教我其他方案来提高复杂背景的分割效果，请通过Github的issue和我联系，我十分愿意在插件中实现它。

## Copy Right

All images are collected form internet， if you own the copy right. please contact me to remove it as soon as possible.

所有的图片均从互联网上收集，如果您拥有其版权，请尽快联系我删除。

## Release Notes

### 1.0.4

update library from dynamic to static

### 1.0.3

Add image shift animation & error message detail

### 1.0.2

Fix warning information logic at first install

### 1.0.1

Update clean logic

### 1.0.0

Initial release of alpha version

### 1.1.0

Fix the extension and simplify interactive command
Update support for M1

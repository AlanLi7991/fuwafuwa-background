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

This extension provides 4 mode of background

本插件一共提供了四种模式

> Custom mode need download and load library manually, library file and sample images can be obtained from git repository "resource"

> 自定义模式需要手动下载库文件并加载, 库文件和测试用的素材可以通过 Git 仓库的 "resource" 路径获取

| Mode    | Feature    | 特点 |
| :------------ | :------------ | :------------ |
| Default Random 默认循环模式 | use five inner images as background and loop | 使用内置的固定图片作为背景图并且循环展示 |
| Default Stable 默认固定模式 | use fixed inner image as background | 使用内置的固定图片作为背景图 |
| Custom Random 自定义随机模式 | use images from folder configuration and random loop | 使用一个文件夹作为数据库，并随机选取图片作为背景图 |
| Custom Stable 自定义固定模式 | use fixed image from configuration as background | 使用一张固定的图片作为背景图 |


## Requirements

**"Activate" "Deactivate" Commands in this extension maybe need administrator authority**

**本插件的 “启用” “停用” 命令可能需要管理员权限，不同平台的情况如下**

"/tmp" can be any directory

"/tmp" 可以是任意文件夹

| Operator System    | How to install   | 如何获得权限   |
| :------------ | :------------ | :------------ |
| Windows   | run with the administrator authority | 以管理员身份运行 |
| MacOS     | cd /tmp && sudo code .  | cd /tmp && sudo code .    |
| Linux     | cd /tmp && sudo code .  | cd /tmp && sudo code .    |

## Extension Settings

Settings need redo install command

需要再次执行 “启用” 指令的配置选项

| Settings    |  Function   |  作用   |
| :------------ | :------------ | :------------ |
| fuwafuwa.interval | control the random loop interval | 控制随机循环的时间间隔 |
| fuwafuwa.style    | control the background css style | 控制背景图片展示的CSS样式 |
| fuwafuwa.opacity  | control the background image css opacity | 控制背景图片展示的CSS透明度 |

Settings can change during using

可以在使用中修改的配置选项

| Settings    |  Function   |  作用   |
| :------------ | :------------ | :------------ |
| fuwafuwa.hidden   | hide the fuwafuwa background image          | 隐藏背景图片的显示 |
| fuwafuwa.segment  | switch the segment process of image         | 开启或关闭自动切割白色背景功能 |
| fuwafuwa.random   | switch between stable mode and random mode  | 切换随机模式或固定模式    |
| fuwafuwa.image    | depict the custom stable background image   | 设定自定义固定模式的背景图 |
| fuwafuwa.folder   | depict the custom random background image data source | 设定自定义随机模式的图片文件夹 |
| fuwafuwa.cache    | depict the custom random background processed image location | 设定自定义随机模式的缓存文件夹，用于储存图片处理结果 |
| fuwafuwa.library  | depict load the library file downloaded from git repository | 加载从Git仓库下载的库文件 |

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

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


## Requirements

**"Install" "Uninstall" "Reinstall" Commands in this extension maybe need administrator authority**

"/tmp" can be any directory

| Operator System    | How to install   |
| :------------ | :------------ |
| Windows   | run with the administrator authority |
| MacOS     | cd /tmp && sudo code .    |
| Linux     | cd /tmp && sudo code .    |

**本插件的 “启用” “停用” “重装” 命令可能需要管理员权限，不同平台的情况如下**

| Operator System    | How to install   |
| :------------ | :------------ |
| Windows   | 以管理员身份运行 |
| MacOS     | cd /tmp && sudo code .    |
| Linux     | cd /tmp && sudo code .    |

"/tmp" 可以是任意文件夹

## Extension Settings

Settings need reinstall fuwafuwa

* `fuwafuwa.interval`: control the random loop interval
* `fuwafuwa.style`: control the background css style
* `fuwafuwa.opacity`: control the background image css opacity


Settings can change during using

* `fuwafuwa.hidden`: hide the fuwafuwa background image
* `fuwafuwa.segment`: switch the segment process of image
* `fuwafuwa.random`: switch between stable mode and random mode
* `fuwafuwa.image`: depict the custom stable background image
* `fuwafuwa.folder`: depict the custom random background image data source
* `fuwafuwa.cache`: depict the custom random background processed image location

需要 “重装” 指令的配置选项

* `fuwafuwa.interval`: 控制随机循环的时间间隔
* `fuwafuwa.style`: 控制背景图片展示的CSS样式
* `fuwafuwa.opacity`: 控制背景图片展示的CSS透明度

可以在使用中修改的配置选项

* `fuwafuwa.hidden`: 隐藏背景图片的显示
* `fuwafuwa.segment`: 开启或关闭自动切割白色背景功能
* `fuwafuwa.random`: 切换随机模式或固定模式
* `fuwafuwa.image`: 设定自定义固定模式的背景图
* `fuwafuwa.folder`: 设定自定义随机模式的图片文件夹
* `fuwafuwa.cache`: 设定自定义随机模式的缓存文件夹，用于储存图片处理结果

## Discussion

This extension did segment just via pixel operation, it is a practice of my [OpenCV Note](https://github.com/AlanLi7991/opencv-turtorial-notes)

If anyone has good a idea to improve the result of segment sisters from different context, please contact me by issue of github. I would like learn those knowledge and implement it.

这个插件通过简单的像素运算实现了白背景人物分割，是我[OpenCV学习笔记](https://github.com/AlanLi7991/opencv-turtorial-notes)的一个练习

如果哪位图像领域的工程师，愿意指教我其他方案来提高复杂背景的分割效果，请通过Github的issue和我联系，我十分愿意在插件中实现它。

## Release Notes

### 1.0.0

Initial release of alpha version


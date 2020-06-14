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

## Directory

Description of sub directory 

子文件夹的说明

| Directory    | Module   | 模块   |
| :------------ | :------------ | :------------ |
| extension     | VSCode Extension Root | VSCode 插件根目录 |
| playground    | Playground for opencv operator | OpenCV操作的测试代码 |
| processor     | Implement OpenCV with C++ & Build as node-addon | OpenCV的C++实现，并且给VSCode提供node-addon|
| resource      | Library and sample resources | 库文件和测试资源 |


## Discussion

This extension did segment just via pixel operation, it is a practice of my [OpenCV Note](https://github.com/AlanLi7991/opencv-turtorial-notes)

If anyone has good a idea to improve the result of segment sisters from different context, please contact me by issue of github. I would like learn those knowledge and implement it.

这个插件通过简单的像素运算实现了白背景人物分割，是我[OpenCV学习笔记](https://github.com/AlanLi7991/opencv-turtorial-notes)的一个练习

如果哪位图像领域的工程师，愿意指教我其他方案来提高复杂背景的分割效果，请通过Github的issue和我联系，我十分愿意在插件中实现它。


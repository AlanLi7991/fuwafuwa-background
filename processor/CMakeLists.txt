cmake_minimum_required(VERSION 3.14)
set(CMAKE_CXX_STANDARD 17)

project(Processor)

set(CMAKE_VERBOSE_MAKEFILE ON)

add_subdirectory(core)
add_subdirectory(addon)
add_subdirectory(main)

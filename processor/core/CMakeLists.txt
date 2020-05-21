cmake_minimum_required(VERSION 3.14)
set(CMAKE_CXX_STANDARD 17)

file(GLOB_RECURSE TARGET_HEADERS ${CMAKE_CURRENT_LIST_DIR}/src/*.h)
file(GLOB_RECURSE TARGET_SOURCES ${CMAKE_CURRENT_LIST_DIR}/src/*.cpp)

add_library(
    FuwafuwaCore STATIC
    ${TARGET_HEADERS}
    ${TARGET_SOURCES}
)

# Find OpenCV
find_package(OpenCV REQUIRED)

# Add include 
target_include_directories(
    FuwafuwaCore
    PRIVATE ${OpenCV_INCLUDE_DIRS}
    )

# Add link
target_link_libraries(
    FuwafuwaCore 
    ${OpenCV_LIBS}
    )

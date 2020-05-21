cmake_minimum_required(VERSION 3.14)
set(CMAKE_CXX_STANDARD 17)

# Found header files & source files
file(GLOB_RECURSE TARGET_HEADERS ${CMAKE_CURRENT_LIST_DIR}/src/*.h)
file(GLOB_RECURSE TARGET_SOURCES ${CMAKE_CURRENT_LIST_DIR}/src/*.cpp)

# Create default wasm target
add_executable(
    FuwafuwaMain
    ${TARGET_HEADERS}
    ${TARGET_SOURCES}
)

add_dependencies(
    FuwafuwaMain
    FuwafuwaCore
)

# Add include 
target_include_directories(
    FuwafuwaMain
    PRIVATE ${CMAKE_SOURCE_DIR}/core/src
)

# Add C++ library as link libraries
target_link_libraries(
    FuwafuwaMain
    FuwafuwaCore
)
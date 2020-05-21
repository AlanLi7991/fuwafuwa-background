cmake_minimum_required(VERSION 3.14)
set(CMAKE_CXX_STANDARD 17)

# Found header files & source files
file(GLOB_RECURSE TARGET_HEADERS ${CMAKE_CURRENT_LIST_DIR}/src/*.h)
file(GLOB_RECURSE TARGET_SOURCES ${CMAKE_CURRENT_LIST_DIR}/src/*.cpp)

# Create default wasm target
add_library(
    FuwafuwaAddon SHARED
    ${TARGET_HEADERS}
    ${TARGET_SOURCES}
)

add_dependencies(
    FuwafuwaAddon
    FuwafuwaCore
)

# Include N-API wrappers
execute_process(
    COMMAND node -p "require('node-addon-api').include"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    OUTPUT_VARIABLE NODE_ADDON_API_DIR
)
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})


# Add include 
target_include_directories(
    FuwafuwaAddon
    PRIVATE ${CMAKE_SOURCE_DIR}/core/src
    PRIVATE ${CMAKE_JS_INC}
    PRIVATE ${NODE_ADDON_API_DIR}
)

# Add C++ library as link libraries
target_link_libraries(
    FuwafuwaAddon
    FuwafuwaCore
    ${CMAKE_JS_LIB}
)

# target node property
set_target_properties(
    FuwafuwaAddon PROPERTIES 
    PREFIX "" 
    SUFFIX ".node"
)
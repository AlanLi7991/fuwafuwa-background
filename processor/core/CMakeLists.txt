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
find_package (
    OpenCV REQUIRED 
    PATHS ${CMAKE_SOURCE_DIR}/build_opencv
    NO_DEFAULT_PATH
)

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

if(APPLE)
    
    foreach(LIB ${OpenCV_LIBS})
        list(APPEND OpenCV_LLIBS -l${LIB})
    endforeach()

    add_custom_target(
        FuwafuwaCombine
        COMMAND libtool -static -arch_only x86_64 -D
        ${CMAKE_CURRENT_BINARY_DIR}/libFuwafuwaCore.a 
        $$\(find ${CMAKE_SOURCE_DIR}/opencv -type f -name \"*.a\"\)
        -o libFuwafuwaCombine.a 
        WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
        DEPENDS FuwafuwaCore
    )

endif()



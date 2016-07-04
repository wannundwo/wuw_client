#!/usr/bin/env bash

platform="$1"
ionic_bin="ionic"

platforms=("ios" "android")


## all platforms
logb() {
    # output ( 1 red | 2 green | 3 yellow | 4 blue | 5 magenta | 6 cyan | 7 white | 9 default )
    echo -e " $(tput setaf "$1")\033[1m*\033[0m$(tput sgr 0) $2";
}

readd_platform() {
    # remove...
    logb 7 "running '$ionic_bin platform rm $platform' & deleting folder..."
<<<<<<< HEAD
    $ionic_bin platform rm "$platform"
    rm -rf platforms/"$platform"

    #  ...and readd ionic platform
    logb 7 "running '$ionic_bin platform add $platform'..."
    $ionic_bin platform add "$platform"
=======
    $ionic_bin platform rm $platform
    rm -rf platforms/$platform

    #  ...and readd ionic platform
    logb 7 "running '$ionic_bin platform add $platform'..."
    $ionic_bin platform add $platform
>>>>>>> feat-grades
}

build_release() {
    # build release package
    logb 7 "running '$ionic_bin build --release $platform'..."
<<<<<<< HEAD
    $ionic_bin build --release "$platform"
=======
    $ionic_bin build --release $platform
>>>>>>> feat-grades
}

join() { local IFS='|'; declare -a arr=("${!1}"); echo "${arr[*]}"; }


## android
build_android () {
    keystore="sec/hft-app-release-key.keystore"
    keyalias="hft-app-release-key"
    apk_unsigned="platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk"
    apk_release="sec/hft-release.apk"

    ## cleanup
    echo; logb 7 "clean up..."
    rm -f $apk_unsigned $apk_release

    ## add platform
    readd_platform

    ## build
    build_release

    ## sign
    logb 7 "running jarsigner..."
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $keystore $apk_unsigned $keyalias

    ## alignment
    logb 7 "running zipalign..."
    zipalign -v 4 $apk_unsigned $apk_release

    echo; logb 2 "successful build! apk saved to $apk_release"; echo
}


## ios
build_ios () {
    xcode_file="platforms/ios/HFT App.xcodeproj"
    xcode_target="HFT App"
    xcode_buildcfg="Release"

    ## cleanup
    echo; logb 7 "clean up..."
    xcodebuild -project "$xcode_file" -configuration "$xcode_buildcfg" -target "$xcode_target" clean

    ## add platform
    readd_platform

    ## build
    build_release

    echo; logb 2 "successful build! opening '$xcode_file' in Xcode..."; echo
    open "$xcode_file"
}


## build
if [[ "${platforms[@]}" =~ ${platform} ]]; then
<<<<<<< HEAD
    build_"${platform}"
=======
    build_${platform}
>>>>>>> feat-grades
else
    echo; logb 7 "usage: $(basename "$0") <$(join platforms[*])>"; echo;
    exit 1
fi

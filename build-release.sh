#!/usr/bin/env bash

platform="$1"

## output ( 1 red | 2 green | 3 yellow | 4 blue | 5 magenta | 6 cyan | 7 white | 9 default )
logb() { echo -e " $(tput setaf "$1")\033[1m*\033[0m$(tput sgr 0) $2"; }

build_android () {
    keystore="sec/hft-app-release-key.keystore"
    keyalias="hft-app-release-key"
    apk_unsigned="platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk"
    apk_release="sec/hft-release.apk"

    ## cleanup
    echo; logb 7 "clean up..."
    rm -f $apk_unsigned $apk_release

    ## build
    logb 7 "running 'cordova build'..."
    cordova build --release android > /dev/null

    ## sign
    logb 7 "running jarsigner..."
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $keystore $apk_unsigned $keyalias > /dev/null

    ## alignment
    logb 7 "running zipalign..."
    zipalign -v 4 $apk_unsigned $apk_release > /dev/null

    echo; logb 2 "successful build! apk saved to $apk_release"; echo
}

build_ios () {
    logb 1 "todo"
}

## build for which platform
if [ "$platform" == "android" ]; then
    build_android
elif [ "$platform" == "ios" ]; then
    build_ios
else
    echo; logb 7 "usage: $(basename "$0") <android|ios>"; echo;
    exit 1
fi

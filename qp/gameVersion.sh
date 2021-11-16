node bundle_version_generator.js -v $2 -b $1
pwd=${PWD}
cp -rf $pwd/bundle-update/$1-$2/$1 $pwd/hotupdate

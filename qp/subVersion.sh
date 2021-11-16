
pwd=${PWD}
cd $pwd/assets/game/$1
sed -i ".txt" 's!\("'version'":"\).*!\1'$2'"!g' version.json

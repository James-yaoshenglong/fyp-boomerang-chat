cd background && npm run build
cd ..

cd chatpage && npm run build
cd ..

cp background/build/background.js extension/ 

cp chatpage/build/index.html extension/
cp -r chatpage/build/static extension/

cp popup/* extension/

cp manifest.json extension/
cp -r extension/* /mnt/c/Users/YSL/Documents/boomerang_chat_extension/
cp -r extension/* /mnt/c/Users/YSL/Documents/boomerang_chat_extension_copy/
cp manifest_copy.json /mnt/c/Users/YSL/Documents/boomerang_chat_extension_copy/manifest.json

set -e
npm run build
cd docs/.vuepress/dist
 
git init
git add -A
git commit -m 'deploy'
 
git push -f https://gitee.com/cc_spaces/blogs.git master
cd -
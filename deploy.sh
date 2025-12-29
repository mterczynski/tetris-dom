# 1. Update files in ../mterczynski.github.io/tetris
rm -rf ../mterczynski.github.io/tetris
mkdir ../mterczynski.github.io/tetris
cp index.html ../mterczynski.github.io/tetris/
cp figures.css ../mterczynski.github.io/tetris/
cp -r js ../mterczynski.github.io/tetris/
cp -r img ../mterczynski.github.io/tetris/
cd ../mterczynski.github.io
# 2. Commit in ../mterczynski.github.io
git add tetris
git commit -m "Update tetris"
# 3. Push in ../mterczynski.github.io
git push

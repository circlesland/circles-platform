branch_name=`git rev-parse --abbrev-ref HEAD`
echo "ignore: []" >> omo-shell/fission.yml
if [ $branch_name == "main" ]; then
  echo "url: omo.fission.app" >> omo-shell/fission.yml
else
  echo "url: ${branch_name}-omo.fission.app" >> omo-shell/fission.yml
fi
echo "build: ./public" >> omo-shell/fission.yml

branch_name=`git rev-parse --abbrev-ref HEAD`
echo "ignore: []" >> omo-shell/fission.yaml
if [ $branch_name == "main" ]; then
  echo "url: omo.fission.app" >> omo-shell/fission.yaml
else
  echo "url: ${branch_name}-omo.fission.app" >> omo-shell/fission.yaml
fi
echo "build: ./public" >> omo-shell/fission.yaml

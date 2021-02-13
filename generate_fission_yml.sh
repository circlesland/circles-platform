branch_name=`git rev-parse --abbrev-ref HEAD`
echo "ignore: []" >> fission.yaml
if [ $branch_name == "main" ]; then
  echo "url: omo.fission.app" >> fission.yaml
else
  echo "url: ${branch_name}-omo.fission.app" >> fission.yaml
fi
echo "build: ./omo-shell/public" >> fission.yaml

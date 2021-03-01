branch_name=`git rev-parse --abbrev-ref HEAD`
echo "ignore: []" >> fission.yaml
if [ $branch_name == "main" ]; then
  echo "url: circles.fission.app" >> fission.yaml
else
  echo "url: ${branch_name}-circles.fission.app" >> fission.yaml
fi
echo "build: ./dapps/public" >> fission.yaml

branch_name=`git rev-parse --abbrev-ref HEAD`
echo "ignore: []" >> omo-shell/fission.yml
echo `url: ${branch_name}-omo.fission.app` >> omo-shell/fission.yml
echo "build: ./public" >> omo-shell/fission.yml

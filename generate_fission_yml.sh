branch_name=`git rev-parse --abbrev-ref HEAD`
if [ $branch_name == "main" ]; then
  yes "" | fission app register -n "omo" -v
else
  yes "" | fission app register -n "${branch_name}-bla" -v
fi

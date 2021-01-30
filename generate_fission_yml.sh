branch_name=`git rev-parse --abbrev-ref HEAD`
yes "" | fission app register -n "${branch_name}-bla" -v

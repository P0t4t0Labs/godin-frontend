#!/bin/bash
set -e
dir=$(git rev-parse --show-toplevel)
thisdir="${dir}/uigrid-style"
if [ -z "$dir" ] || [ ! -f "${thisdir}/build.sh" ]; then
    echo "Please run this from the repository"
    exit 1
fi

${dir}/node_modules/.bin/lessc --sass2less \
    ${thisdir}/uigrid-custom.less \
    ${dir}/src/style/uigrid-custom.css

echo "DONE"

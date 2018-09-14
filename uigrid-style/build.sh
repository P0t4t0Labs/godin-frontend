#!/bin/bash
set -e
dir="$(git rev-parse --show-toplevel)"
thisdir="${dir}/uigrid-style"
if [ -z "$dir" ] || [ ! -f "${thisdir}/extract-sass.js" ]; then
    echo "Please run this from the repository"
    exit 1
fi
cd "$thisdir"
set -x

node "${thisdir}/extract-sass.js" > "${thisdir}/extracted.less"

"${dir}/node_modules/.bin/lessc" \
    "${thisdir}/uigrid-custom.less" \
    "${thisdir}/out.css"

set +x

echo "/* DO NOT EDIT THIS FILE MANUALLY!" > "${dir}/src/style/uigrid-custom.css"
echo "   Generated on $(date) */" >> "${dir}/src/style/uigrid-custom.css"
cat "${thisdir}/out.css" >> "${dir}/src/style/uigrid-custom.css"

# Cleanup
rm "${thisdir}/out.css"
rm "${thisdir}/extracted.less"

echo "DONE"

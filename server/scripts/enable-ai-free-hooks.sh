#!/bin/sh
# Run once after clone: strips "Co-authored-by: Cursor …" lines on every commit made on this machine.
cd "$(dirname "$0")/../.." || exit 1
chmod +x server/.githooks/commit-msg server/.githooks/prepare-commit-msg 2>/dev/null
git config core.hooksPath server/.githooks && echo "hooksPath -> server/.githooks"

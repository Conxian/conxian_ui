#!/bin/bash
# Temporary swap JSX for Vitest
sed -i 's/"jsx": "preserve"/"jsx": "react-jsx"/' tsconfig.json
# Ensure we run in test mode
export NODE_ENV=test
pnpm exec vitest run
status=$?
# Restore for Next.js
sed -i 's/"jsx": "react-jsx"/"jsx": "preserve"/' tsconfig.json
if [ $status -ne 0 ]; then
  echo "Tests failed"
fi

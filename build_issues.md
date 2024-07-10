# Things that went wrong and how to fix them

## pnpm.cjs is not a valid Win32 Application

Go to the path of the pnpm.cjs file and change '#!/usr/bin/env node' to '#!node'
.npmrc should be 'shamefully-hoist=true'

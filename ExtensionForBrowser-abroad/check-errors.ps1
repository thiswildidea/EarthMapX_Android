npx vue-tsc --noEmit 2> tsc-errors.txt
Write-Output "Error checking completed, displaying errors:"
Get-Content tsc-errors.txt
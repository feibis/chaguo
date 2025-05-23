Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*([^#=]+)\s*=\s*(.*)$" -and $matches[2] -ne "") {
        $key = $matches[1]
        $value = $matches[2]
        # Strip surrounding quotes if present
        $value = $value -replace '^"(.*)"$', '$1'
        $value = $value -replace "^'(.*)'$", '$1'
        Write-Host "Pushing $key..."
        echo $value | vercel env add $key production
    }
}
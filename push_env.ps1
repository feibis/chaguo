Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*([^#=]+)\s*=\s*(.+)$") {
        $key = $matches[1]
        $value = $matches[2]
        Write-Host "Pushing $key to Vercel..."
        echo $value | vercel env add $key development
    }
}
$source = "d:\pyrevit\Extensions\Gimhan\Riyan-\Riyan-EXTENSION\RevitAIChatbot\RevitAIChatbot.addin"
$destDir = "$env:AppData\Autodesk\Revit\Addins\2025"
$dest = "$destDir\RevitAIChatbot.addin"

if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir
}

Copy-Item -Path $source -Destination $dest -Force
Write-Host "Deployed manifest to $dest"
Write-Host "Content of deployed file:"
Get-Content $dest | Select-String "Assembly"

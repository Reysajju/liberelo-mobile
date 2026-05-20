# Bind Metro to your Wi-Fi IP (avoids VMware/virtual adapters).
$wifiIp = (
  Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object {
    ($_.InterfaceAlias -like '*Wi-Fi*' -or $_.InterfaceAlias -like '*WLAN*') -and
    $_.IPAddress -match '^192\.168\.\d+\.\d+$'
  } |
  Select-Object -First 1
).IPAddress

if (-not $wifiIp) {
  Write-Host 'No Wi-Fi IPv4 found. Connect to Wi-Fi or set REACT_NATIVE_PACKAGER_HOSTNAME manually.'
  exit 1
}

Write-Host "Expo will use Wi-Fi IP: $wifiIp"
Write-Host "Scan in Expo Go: exp://$wifiIp`:8081"
Write-Host ''

$env:CI = 'false'
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $wifiIp
Set-Location $PSScriptRoot\..
npx expo start --lan --clear @args

# Builds a debug APK on your PC (requires Android Studio + SDK once).
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $root

$sdk = $env:ANDROID_HOME
if (-not $sdk) { $sdk = "$env:LOCALAPPDATA\Android\Sdk" }
if (-not (Test-Path $sdk)) {
  Write-Host @'

Android SDK not found. Install Android Studio once:
  https://developer.android.com/studio

Then open Android Studio -> SDK Manager -> install:
  - Android SDK Platform 35
  - Android SDK Build-Tools
  - Android SDK Command-line Tools

Set environment variable (PowerShell as Admin optional):
  [Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")

Re-run: npm run build:apk:local

'@
  exit 1
}

$env:ANDROID_HOME = $sdk
$env:PATH = "$sdk\platform-tools;$sdk\cmdline-tools\latest\bin;$env:PATH"

Write-Host 'Generating native Android project...'
npx expo prebuild --platform android --clean

Write-Host 'Bundling JS and building debug APK (installable without Metro)...'
npx expo run:android --variant release --no-install --no-bundler

$apk = Get-ChildItem -Path 'android\app\build\outputs\apk' -Recurse -Filter '*.apk' |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if ($apk) {
  $out = Join-Path $root 'liberelo-release.apk'
  Copy-Item $apk.FullName $out -Force
  Write-Host ''
  Write-Host "APK ready: $out"
  Write-Host 'Copy to your phone and open it (allow Install unknown apps).'
} else {
  Write-Host 'Build finished but APK not found under android/app/build/outputs/apk'
  exit 1
}

# Cinematic Interactive Presentation 글로벌 스킬 설치 스크립트
$ErrorActionPreference = "Stop"

$src = Join-Path $PSScriptRoot ".agents\skills\cinematic-interactive-presentation"
$dest = Join-Path $env:USERPROFILE ".gemini\config\skills\cinematic-interactive-presentation"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Cinematic Interactive Presentation 글로벌 스킬 설치기" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $src)) {
    Write-Host "[오류] 소스 스킬 폴더를 찾을 수 없습니다: $src" -ForegroundColor Red
    exit 1
}

Write-Host "[1/2] 대상 폴더 준비 중... -> $dest" -ForegroundColor Gray
if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

Write-Host "[2/2] 최신 스킬 파일 복사 중..." -ForegroundColor Gray
Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  [성공] 글로벌 스킬 설치가 완료되었습니다!" -ForegroundColor Green
Write-Host "  위치: $dest" -ForegroundColor Yellow
Write-Host "  이제 어떤 폴더/작업 공간에서도 '시네마틱 발표자료'를 항상 소환할 수 있습니다!" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green

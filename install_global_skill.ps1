# Cinematic Interactive Presentation 글로벌 스킬 설치 스크립트
$ErrorActionPreference = "Stop"

$skills = @(
    "cinematic-interactive-presentation",
    "cinematic-motion-graphics-presentation"
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Cinematic & Motion Graphics Presentation 글로벌 스킬 설치기" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

foreach ($skillName in $skills) {
    $src = Join-Path $PSScriptRoot ".agents\skills\$skillName"
    $dest = Join-Path $env:USERPROFILE ".gemini\config\skills\$skillName"

    if (-not (Test-Path $src)) {
        Write-Host "[오류] 소스 스킬 폴더를 찾을 수 없습니다: $src" -ForegroundColor Red
        exit 1
    }

    Write-Host "[설치 중] $skillName -> $dest" -ForegroundColor Gray
    if (-not (Test-Path $dest)) {
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
    }
    Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  [성공] 글로벌 스킬 2종 설치가 완료되었습니다!" -ForegroundColor Green
Write-Host "  1. cinematic-interactive-presentation (시네마틱 발표자료)" -ForegroundColor Yellow
Write-Host "  2. cinematic-motion-graphics-presentation (시네마틱 모션 그래픽 발표자료)" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Green

#!/usr/bin/env bash
# Cinematic Interactive Presentation 글로벌 스킬 설치기 (Mac / Linux)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SRC="$DIR/.agents/skills/cinematic-interactive-presentation"
DEST="$HOME/.gemini/config/skills/cinematic-interactive-presentation"

echo "============================================================"
echo "  Cinematic Interactive Presentation 글로벌 스킬 설치기"
echo "============================================================"

if [ ! -d "$SRC" ]; then
    echo "[오류] 소스 스킬 폴더를 찾을 수 없습니다: $SRC"
    exit 1
fi

echo "[1/2] 대상 폴더 준비 중..."
mkdir -p "$DEST"

echo "[2/2] 스킬 파일 복사 중..."
cp -R "$SRC/"* "$DEST/"

echo ""
echo "============================================================"
echo "  [성공] 글로벌 스킬 설치가 완료되었습니다!"
echo "  위치: $DEST"
echo "  이제 어느 폴더나 작업 공간에서도 '시네마틱 발표자료'를 항시 소환할 수 있습니다!"
echo "============================================================"

#!/usr/bin/env bash
# Cinematic Interactive Presentation 글로벌 스킬 설치기 (Mac / Linux)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SKILLS=("cinematic-interactive-presentation" "cinematic-motion-graphics-presentation")
DEST_ROOTS=("$HOME/.gemini/config/skills" "$HOME/.claude/skills")

echo "============================================================"
echo "  Cinematic & Motion Graphics Presentation 글로벌 스킬 설치기"
echo "============================================================"

for SKILL in "${SKILLS[@]}"; do
    SRC="$DIR/.agents/skills/$SKILL"
    if [ ! -d "$SRC" ]; then
        echo "[오류] 소스 스킬 폴더를 찾을 수 없습니다: $SRC"
        exit 1
    fi
    for ROOT in "${DEST_ROOTS[@]}"; do
        DEST="$ROOT/$SKILL"
        echo "[설치 중] $SKILL -> $DEST"
        mkdir -p "$DEST"
        cp -R "$SRC/"* "$DEST/"
    done
done

echo ""
echo "============================================================"
echo "  [성공] 글로벌 스킬 2종 설치가 완료되었습니다! (Gemini + Claude Code)"
echo "  1. cinematic-interactive-presentation (시네마틱 발표자료)"
echo "  2. cinematic-motion-graphics-presentation (시네마틱 모션 그래픽 발표자료)"
echo "============================================================"

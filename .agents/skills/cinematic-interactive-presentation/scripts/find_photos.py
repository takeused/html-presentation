# Unsplash 공식 API로 무료 라이선스 가로 사진을 검색해 DECK에 넣을 bg/photo 값을 출력하는 스크립트
# 사용: python find_photos.py "laptop night" "misty forest" [--n 5]
#       python find_photos.py --track <id> [<id> ...]   # 덱에 실제로 쓴 사진의 다운로드 이벤트 전송(API 가이드라인 필수)
# 환경변수 UNSPLASH_ACCESS_KEY(unsplash.com/developers 앱의 Access Key)가 필요하다.
# 웹사이트 내부 경로(/napi)는 2026-11부터 봇 확인(Anubis)에 막혀 공식 API만 쓴다.
import sys, os, json, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

API = "https://api.unsplash.com"
KEY = os.environ.get("UNSPLASH_ACCESS_KEY")
if not KEY:
    sys.exit("UNSPLASH_ACCESS_KEY 환경변수가 없습니다. unsplash.com/developers에서 Access Key를 발급해 등록하세요.")


def get(path, params=None):
    url = API + path + ("?" + urllib.parse.urlencode(params) if params else "")
    req = urllib.request.Request(url, headers={"Authorization": f"Client-ID {KEY}", "Accept-Version": "v1"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r), r.headers.get("X-Ratelimit-Remaining")


def search(queries, n):
    left = None
    for q in queries:
        print(f"\n# {q}")
        data, left = get("/search/photos", {"query": q, "per_page": 20, "orientation": "landscape"})
        # Unsplash+ 유료 사진은 plus.unsplash.com 주소라 제외한다
        hits = [x for x in data["results"] if not x.get("premium") and "images.unsplash.com/photo-" in x["urls"]["raw"]][:n]
        for x in hits:
            bg = x["urls"]["raw"].split("?")[0].split("/")[-1]
            print(f"bg: '{bg}', photo: '{x['user']['name']}',  // id: {x['id']} · {x.get('alt_description') or ''}\n    thumb: {x['urls']['small']}")
    print(f"\n남은 요청 수(시간당): {left}")
    print("덱에 쓴 사진은 id로 다운로드 이벤트를 보내세요: python find_photos.py --track <id> ...")


def track(ids):
    left = None
    for i in ids:
        _, left = get(f"/photos/{urllib.parse.quote(i)}/download")
        print(f"다운로드 이벤트 전송: {i}")
    print(f"남은 요청 수(시간당): {left}")


args = sys.argv[1:]
if args[:1] == ["--track"]:
    if len(args) < 2:
        sys.exit("usage: python find_photos.py --track <id> [<id> ...]")
    track(args[1:])
else:
    n = 5
    if "--n" in args:
        i = args.index("--n"); n = int(args[i + 1]); del args[i:i + 2]
    if not args:
        sys.exit('usage: python find_photos.py "query" ["query" ...] [--n 5]')
    search(args, n)

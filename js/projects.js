/*
 * projects.js — 프로젝트 목록
 * 새 프로젝트를 추가하려면 아래 배열에 { ... } 하나를 복사해 붙여넣고 내용만 바꾸면 됩니다.
 * type: "research"(리서치·분석) 또는 "motion"(모션·영상)
 * video가 있으면 썸네일을 누를 때 영상이 열립니다.
 */
const PROJECTS = [
  {
    id: "fc-sla",
    type: "research",
    label: "데이터 분석 · PBL",
    date: "2026.11",
    title: "쿠팡 FC 인력계획 — SLA가 무너지는 조건 찾기",
    desc: "물류센터(FC)의 일별 물량·인력 데이터로 어떤 날 정시 출고율(SLA)이 떨어지는지 분석했습니다. Colab에서 그래프 12장과 결정나무로 조건을 좁히고, 보고서를 웹 이북으로 배포했습니다.",
    facts: [
      ["73.6%", "부하율 1.2를 넘은 날 중 SLA 목표 미달 비율"],
      ["1.42배 vs 1.16배", "프로모션 기간 물량 증가 vs 인원 증가"]
    ],
    thumb: "assets/img/fc-fig06.png",
    thumbFit: "contain",
    links: [
      { text: "웹 이북 보기", href: "https://ubiquitous-kringle-e53fc9.netlify.app", external: true }
    ]
  },
  {
    id: "hbm-ebook",
    type: "research",
    label: "전자책",
    date: "2026.11",
    title: "HBM 반도체 투자 취급설명서",
    desc: "제품 취급설명서 형식을 빌려, HBM 반도체에 투자하기 전에 확인할 것들을 A4 20쪽으로 정리했습니다. 책장을 넘기며 읽는 웹 리더로 만들었습니다.",
    facts: [
      ["20쪽", "A4 PDF"],
      ["PDF.js + PageFlip", "브라우저에서 바로 넘겨 보기"]
    ],
    thumb: "assets/img/ebook-01.jpg",
    thumbFit: "contain",
    links: [
      { text: "전자책 열기", href: "ebook-hbm/index.html", external: true },
      { text: "PDF", href: "assets/docs/hbm-ebook.pdf", download: "20212954_HBM_투자_취급설명서.pdf" }
    ]
  },
  {
    id: "hbm-motion",
    type: "motion",
    label: "모션 그래픽 · 30초",
    date: "2026.11",
    title: "AI 붐, 왜 메모리일까?",
    desc: "HBM이 왜 주목받는지 6장면으로 설명하는 30초 산업 브리핑입니다. 장면별 계획서를 먼저 쓰고, Claude로 HTML 애니메이션을 만든 뒤 영상으로 변환했습니다.",
    facts: [["6장면", "문제 제기 → 메모리 병목 → HBM 구조 → 한국 기업 → 사이클 위험 → 체크포인트"]],
    thumb: "assets/img/hbm-motion.jpg",
    video: "assets/video/hbm-motion.mp4",
    links: []
  },
  {
    id: "biz-promo",
    type: "motion",
    label: "모션 그래픽 · 30초",
    date: "2026.11",
    title: "한림대학교 경영학과 홍보 영상",
    desc: "학과 교육목표, 6개 트랙, 창업·진로를 30초 안에 소개하는 홍보 모션입니다. 학과 소개 자료를 바탕으로 장면을 구성했습니다.",
    facts: [["6장면", "인트로 → 교육목표 → 6개 트랙 → 창업 → 진로 → 인재상"]],
    thumb: "assets/img/biz-promo.jpg",
    video: "assets/video/biz-promo.mp4",
    links: []
  },
  {
    id: "portfit-ad",
    type: "motion",
    label: "광고 영상 · 30초",
    date: "2026.11",
    title: "포트핏 30초 광고",
    desc: "직접 만든 웹앱 '포트핏'(레버리지 손익 계산·투자 습관 점검)을 소개하는 광고입니다. 앱 화면을 장면에 넣고 AI 음성으로 더빙했습니다.",
    facts: [["직접 만든 앱", "레버리지 ETF의 1배 대비 손익과 변동성 손실 계산"]],
    thumb: "assets/img/portfit-ad.jpg",
    video: "assets/video/portfit-ad.mp4",
    links: []
  }
];

/**
 * projects.js - 프로젝트 데이터 정의 파일
 * 새로운 프로젝트를 추가할 때는 아래 배열에 새로운 객체를 추가하기만 하면
 * 웹사이트에 자동으로 카드와 상세 모달이 렌더링됩니다.
 */

const projectsData = [
  {
    id: "semiconductor-supercycle",
    title: "이번엔 다를까? — 메모리 반도체 투자 전망",
    subtitle: "사상 최대 이익, PER 4배의 역설을 분석한 AI 멀티에이전트 금융 리서치",
    period: "2026.10",
    featured: true,
    category: "AI Smart Work & Finance",
    role: "단독 진행 (기여도 100%)",
    tags: ["Claude Opus 5.5", "Google Gemini", "Google Veo", "Antigravity Skill", "Python & Node.js", "Financial Valuation"],
    coverImage: "assets/images/semiconductor-cover.png",
    videoTeaser: "assets/videos/semiconductor-teaser.mp4",
    docxFile: "assets/docs/hallym-investment-report.docx",
    pptxFile: "assets/docs/hallym-investment-deck.pptx",
    summary: "삼성전자와 SK하이닉스가 분기 사상 최대 실적을 경신함에도 PER 3~4배에 머무는 시장의 고점 의혹에 대해 2018년 슈퍼사이클과 비교 분석하고, 작성자와 분리된 독립 QA 에이전트를 가동해 신뢰성을 검증한 10쪽 분량의 심층 리포트 및 자동화 슬라이드 덱 프로젝트입니다.",
    
    // 4단계 파이프라인
    pipeline: [
      {
        step: "01",
        title: "산업 리서치 & 밸류에이션 리포트",
        desc: "2018 vs 2026 구조 비교(8대 항목), HBM 웨이퍼 잠식 효과 및 장기계약 구조 규명, 낙관·기본·비관 시나리오별 목표주가 및 확률가중 밸류에이션 모델링 (A4 10쪽 docx)"
      },
      {
        step: "02",
        title: "독립 검토 Multi-Agent QA",
        desc: "작성 과정에 참여하지 않은 별도 QA 책임자 에이전트를 구동하여 사실 검증, 산식 오류 재계산(치명 3건, 중요 12건 수정), 2019년 재현 스트레스 테스트 추가"
      },
      {
        step: "03",
        title: "슬라이드 자동 생성 스킬 개발",
        desc: "Antigravity 커스텀 스킬(hallym-investment-deck) 및 Node.js(hallym_deck.js), Python(qa_check.py) 검증 스크립트를 직접 개발하여 리포트 기반의 일관된 슬라이드 자동 생성"
      },
      {
        step: "04",
        title: "멀티모달 시네마틱 미디어 제작",
        desc: "Gemini 기반 3D 표지 이미지 프롬프트 엔지니어링 및 Google Veo(Flow) 모델을 활용한 8초 시네마틱 홍보 티저 영상(MP4) 제작"
      }
    ],

    // 모달 상세 정보 (탭 형태 지원)
    details: {
      background: "삼성전자와 SK하이닉스가 AI 메모리 수요로 연일 분기 사상 최대 실적을 경신하고 있음에도 불구하고, 2027년 예상 이익 기준 주가수익비율(PER)은 3~4배 수준에 머물러 있었습니다. 시장은 '2018년의 급격한 다운사이클이 반복되는 것이 아닌가?'라는 고점 우려를 제기하고 있었습니다.",
      coreQuestion: "“이번 메모리 슈퍼사이클은 2018년처럼 끝날 것인가, 아니면 구조적으로 다른가?”",
      findings: [
        "HBM 시장 점유율 50%의 독점적 지위와 일반 D램 대비 3배 이상의 웨이퍼 잠식 효과로 인한 실질 공급 제약 확인",
        "과거 분기 단위 현물 계약 중심에서 1년 이상 장기계약 및 선수금 구조로 변화되어 하방 경직성 확보",
        "2019년 다운사이클 재현 시의 보수적 스트레스 테스트(SK하이닉스 -78%, 삼성전자 -53%)를 거친 확률가중 목표주가 산출 (SK하이닉스 265만원, 삼성전자 40만원)"
      ],
      multiAgentQA: [
        { item: "수치 정밀 대조", before: "HBM '매출 비중 50%'", after: "HBM '시장 점유율 50%'로 사실 관계 정정" },
        { item: "선행 지표 타임라인", before: "D램 가격 하락 시점 일치", after: "주가가 D램 가격 하락보다 5개월 선행했던 역사적 타임라인 반영" },
        { item: "스트레스 테스트 추가", before: "단순 3개 시나리오", after: "2019년 수준의 혹독한 비관 시나리오 스트레스 테스트 별도 신설" },
        { item: "컴플라이언스 준수", before: "투자 확정적 어조", after: "'학업 및 리서치 목적의 가상 보고서' 고지 및 규정 준수 표현 보강" }
      ],
      keyTakeaway: "생성형 AI를 단순히 '글을 써주는 도구'로 쓰는 것을 넘어, 도메인 지식(재무제표, 밸류에이션, 반도체 공학)을 바탕으로 <role>, <context>, <constraints>를 엄격히 정의하고, 작성 에이전트와 독립 QA 에이전트가 교차 검증하는 시스템을 구축할 때 비로소 금융 실무 수준의 신뢰성을 달성할 수 있음을 입증했습니다."
    }
  },
  {
    id: "financial-time-series-ml",
    title: "금융 시계열 데이터 기반 변동성 예측 모델",
    subtitle: "KOSPI 200 지수 및 거시경제 지표를 활용한 머신러닝 변동성 분석",
    period: "준비 중 (2026 2학기)",
    featured: false,
    category: "Data Analytics & ML",
    role: "데이터 전처리 및 모델링",
    tags: ["Python", "Pandas", "Scikit-Learn", "Time-Series", "EDA"],
    coverImage: "",
    videoTeaser: "",
    summary: "금융 시장의 일별 변동성 군집 현상을 포착하기 위해 거시 경제 지표(금리, 환율, 유가)와 KOSPI 시계열 데이터를 결합한 예측 모델링 프로젝트입니다.",
    details: {
      background: "금융 리스크 관리의 핵심인 변동성 군집(Volatility Clustering) 현상을 예측하기 위한 프로젝트입니다.",
      findings: [
        "거시 경제 변수와의 상관관계 분석 및 특성 공학(Feature Engineering) 적용",
        "Rolling-window 기법을 활용한 백테스팅 파이프라인 구축"
      ]
    }
  },
  {
    id: "esg-disclosure-nlp",
    title: "기업 공시 데이터 기반 ESG 리스크 텍스트 마이닝",
    subtitle: "DART 전자공시 사업보고서 내 잠재적 재무·비재무 리스크 자동 추출",
    period: "준비 중 (2026 공모전)",
    featured: false,
    category: "NLP & Business Analytics",
    role: "데이터 크롤링 및 텍스트 마이닝",
    tags: ["Python", "DART API", "NLP", "Text Mining", "KoNLPy"],
    coverImage: "",
    videoTeaser: "",
    summary: "금융감독원 DART API를 활용하여 상장기업의 사업보고서 내 기재된 '이사의 경영진단 및 분석의견' 텍스트 데이터를 분석하고 이상 신호를 감지하는 툴입니다.",
    details: {
      background: "정형화된 재무제표에 잡히지 않는 비재무적 리스크를 자연어 처리를 통해 조기 발견합니다.",
      findings: [
        "KoNLPy 기반 한국어 금융 형태소 분석 및 불용어 사전 구축",
        "TF-IDF 및 감성 점수 산출을 통한 리스크 지표 스코어링"
      ]
    }
  }
];

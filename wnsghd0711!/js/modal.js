/**
 * modal.js - 프로젝트 상세 모달 및 탭 제어 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  const modalBackdrop = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
  const modalTabPanes = document.querySelectorAll('.tab-pane');

  if (!modalBackdrop) return;

  // 모달 열기 함수
  window.openProjectModal = function(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    modalTitle.textContent = project.title;
    if (modalSubtitle) modalSubtitle.textContent = project.subtitle;

    // 탭 1: 개요 및 연구 배경 채우기
    const tabOverview = document.getElementById('tab-overview');
    if (tabOverview && project.details) {
      tabOverview.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.1rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 0.5rem;">🔍 핵심 연구 질문</h4>
          <blockquote style="font-size: 1.05rem; font-weight: 600; padding: 0.85rem 1.25rem; background: var(--bg-card-alt); border-left: 4px solid var(--accent-cyan); border-radius: 4px; margin-bottom: 1rem;">
            ${project.details.coreQuestion || ''}
          </blockquote>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1rem;">
            ${project.details.background || ''}
          </p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.1rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 0.5rem;">📊 주요 분석 결과 및 수치 발견</h4>
          <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.8;">
            ${(project.details.findings || []).map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <div style="padding: 1rem 1.25rem; background: linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%); border-radius: 8px; border: 1px solid var(--border-color);">
          <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">💡 핵심 인사이트 (Hallym's View)</h5>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
            ${project.details.keyTakeaway || ''}
          </p>
        </div>
      `;
    }

    // 탭 2: 멀티에이전트 QA 및 검증 내역 채우기
    const tabQA = document.getElementById('tab-qa');
    if (tabQA && project.details && project.details.multiAgentQA) {
      tabQA.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 1.1rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 0.5rem;">🤖 독립 검토 QA 에이전트 (Multi-Agent Audit Loop)</h4>
          <p style="font-size: 0.925rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            작성 에이전트와 분리된 <strong>별도의 Claude 품질 검토 에이전트</strong>를 가동하여, 
            총 26건(치명 3, 중요 12, 사소 11)의 지적 사항을 팩트체크하고 수정한 내역입니다.
          </p>
        </div>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: var(--bg-card-alt); border-bottom: 2px solid var(--border-color); text-align: left;">
                <th style="padding: 0.75rem 1rem; color: var(--text-primary); font-weight: 700;">검증 항목</th>
                <th style="padding: 0.75rem 1rem; color: #EF4444; font-weight: 700;">초안 지적 사항</th>
                <th style="padding: 0.75rem 1rem; color: #10B981; font-weight: 700;">수정 및 반영 결과</th>
              </tr>
            </thead>
            <tbody>
              ${project.details.multiAgentQA.map(qa => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--text-primary);">${qa.item}</td>
                  <td style="padding: 0.75rem 1rem; color: var(--text-muted); text-decoration: line-through;">${qa.before}</td>
                  <td style="padding: 0.75rem 1rem; color: var(--accent-cyan); font-weight: 600;">${qa.after}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // 탭 3: 산출물 및 다운로드 링크
    const tabDownloads = document.getElementById('tab-downloads');
    if (tabDownloads) {
      tabDownloads.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.1rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 0.75rem;">📥 프로젝트 산출물 다운로드</h4>
          <p style="font-size: 0.925rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            과제 수행 과정에서 생성된 실제 결과물 파일들을 다운로드하여 원본 구성을 확인하실 수 있습니다.
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${project.docxFile ? `
              <a href="${project.docxFile}" download class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: 1rem 1.25rem;">
                <span style="font-size: 1.5rem;">📄</span>
                <div>
                  <div style="font-weight: 700; color: var(--text-primary);">A4 10쪽 심층 분석 보고서 (.docx)</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">삼성전자·SK하이닉스 비교 리서치 및 밸류에이션 리포트</div>
                </div>
              </a>
            ` : ''}
            ${project.pptxFile ? `
              <a href="${project.pptxFile}" download class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: 1rem 1.25rem;">
                <span style="font-size: 1.5rem;">📊</span>
                <div>
                  <div style="font-weight: 700; color: var(--text-primary);">자동 생성 슬라이드 덱 (.pptx)</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Antigravity hallym-investment-deck 스킬 기반 자동 제작 발표자료</div>
                </div>
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }

    // 탭 기본 활성화 (첫 번째 탭)
    modalTabBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === 0);
    });
    modalTabPanes.forEach((pane, idx) => {
      pane.classList.toggle('active', idx === 0);
    });

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // 모달 닫기 함수
  window.closeProjectModal = function() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // 탭 클릭 전환
  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      modalTabBtns.forEach(b => b.classList.remove('active'));
      modalTabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) targetPane.classList.add('active');
    });
  });
});

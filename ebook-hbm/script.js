// PDF.js 워커 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// 내장 전자책의 장 바로가기 (PDF 쪽 번호 기준)
const CHAPTERS = [
    ['00', '머리말과 안전수칙', 2], ['01', '반도체 한눈에 보기', 4], ['02', 'AI는 왜 메모리를 부르는가', 5],
    ['03', 'HBM의 구조와 세대', 6], ['04', '밸류체인과 한국의 위치', 8], ['05', '공급사와 고객사', 9],
    ['06', '메모리 사이클', 10], ['07', '내가 매달 보는 지표', 11], ['08', '투자 수단 고르기', 13],
    ['09', '나의 매매 규칙과 루틴', 15], ['10', '위험요인', 16], ['11', '포트폴리오 고장 진단표', 17],
    ['A', '용어 사전', 18], ['B', '투자 점검표', 19]
];

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('pdf-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const loadingContainer = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    const progressBar = document.getElementById('progress');
    const bookArea = document.getElementById('book-area');
    const bookContainer = document.getElementById('book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    const openBtn = document.getElementById('open-book');
    const downloadLink = document.getElementById('download');
    const tocNav = document.getElementById('toc');

    let pageFlip = null;
    let embeddedOpen = false;
    const book = window.EMBEDDED_BOOK;

    // Base64 → Uint8Array
    function base64ToBytes(b64) {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    async function renderBook(bytes, title, isEmbedded) {
        if (pageFlip) { pageFlip.destroy(); pageFlip = null; }
        // destroy()가 #book 요소를 지우므로 다시 만든다
        let container = document.getElementById('book');
        if (!container) {
            container = document.createElement('div');
            container.id = 'book';
            document.querySelector('.book-wrapper').appendChild(container);
        }
        container.innerHTML = '';
        bookArea.style.display = 'none';
        loadingContainer.style.display = 'flex';
        progressBar.style.width = '0%';
        loadingText.textContent = 'PDF를 여는 중...';

        try {
            const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
            const totalPages = pdf.numPages;
            loadingText.textContent = `${totalPages}쪽을 책으로 만드는 중...`;

            const page1 = await pdf.getPage(1);
            const viewport1 = page1.getViewport({ scale: 1.5 });
            const bookWidth = viewport1.width;
            const bookHeight = viewport1.height;
            const scale = Math.min(2, window.devicePixelRatio || 1) * 1.3;

            const htmlPages = [];
            const safeTitle = escapeHtml(title);

            // 앞 하드커버
            htmlPages.push(`
                <div class="page hard" data-density="hard">
                    <div class="page-content" style="background:linear-gradient(160deg,#16234A,#0B1530); display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; padding:2rem; text-align:center;">
                        <div style="font-size:.75rem; letter-spacing:.4em; color:#E86A5A; border:1px solid #E86A5A; padding:.25rem .6rem; margin-bottom:1.4rem;">E-BOOK</div>
                        <h2 style="font-family:'Pretendard','Outfit'; font-size:1.7rem; line-height:1.35; margin-bottom:1rem; background:linear-gradient(135deg,#2FD6C6,#F2B544); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:transparent; word-break:keep-all;">${safeTitle}</h2>
                        <p style="opacity:.7; font-weight:300; font-size:.9rem;">모서리를 끌거나 가장자리를 클릭해 펼치세요</p>
                    </div>
                </div>
                <div class="page hard" data-density="hard">
                    <div class="page-content" style="background-color:#16234A;"></div>
                </div>`);

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
                const imgData = canvas.toDataURL('image/jpeg', 0.88);
                htmlPages.push(`
                    <div class="page">
                        <div class="page-content" style="background-image: url('${imgData}');"></div>
                    </div>`);
                progressBar.style.width = `${(pageNum / totalPages) * 100}%`;
            }

            if (totalPages % 2 !== 0) {
                htmlPages.push(`<div class="page"><div class="page-content" style="background-color:#ffffff;"></div></div>`);
            }

            // 뒤 하드커버
            htmlPages.push(`
                <div class="page hard" data-density="hard">
                    <div class="page-content" style="background-color:#16234A;"></div>
                </div>
                <div class="page hard" data-density="hard">
                    <div class="page-content" style="background:linear-gradient(160deg,#16234A,#0B1530); display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; text-align:center; padding:2rem;">
                        <h2 style="font-family:'Pretendard','Outfit'; color:#F2B544; margin-bottom:.8rem;">끝</h2>
                        <p style="opacity:.6; font-size:.85rem;">성장성을 보되, 사이클과 나 자신을 함께 점검할 것</p>
                    </div>
                </div>`);

            container.innerHTML = htmlPages.join('');
            loadingContainer.style.display = 'none';
            bookArea.style.display = 'flex';

            let finalWidth = Math.min(bookWidth, 450);
            let finalHeight = Math.round((finalWidth / bookWidth) * bookHeight);
            finalWidth = Math.round(finalWidth);

            pageFlip = new St.PageFlip(container, {
                width: finalWidth,
                height: finalHeight,
                size: 'stretch',
                minWidth: 280,
                maxWidth: 1600,
                minHeight: 400,
                maxHeight: 2000,
                maxShadowOpacity: 0.5,
                showCover: true,
                mobileScrollSupport: false,
                usePortrait: window.innerWidth < 800
            });
            pageFlip.loadFromHTML(container.querySelectorAll('.page'));
            pageFlip.on('flip', (e) => updatePageInfo(e.data, totalPages));
            prevBtn.onclick = () => pageFlip && pageFlip.flipPrev();
            nextBtn.onclick = () => pageFlip && pageFlip.flipNext();
            updatePageInfo(0, totalPages);

            embeddedOpen = isEmbedded;
            tocNav.style.visibility = isEmbedded ? 'visible' : 'hidden';
        } catch (error) {
            console.error(error);
            loadingContainer.style.display = 'none';
            fileNameDisplay.textContent = 'PDF를 여는 중 오류가 났습니다: ' + error.message;
        }
    }

    // 쪽 번호 표시: 0 앞표지, 1 속표지, 2~ PDF 쪽
    function updatePageInfo(idx, total) {
        if (idx === 0) pageInfo.textContent = '표지';
        else if (idx === 1) pageInfo.textContent = '속표지';
        else if (idx >= 2 && idx < 2 + total) {
            const n = idx - 1;
            const right = (pageFlip && pageFlip.getOrientation() === 'landscape' && n + 1 <= total) ? `–${n + 1}` : '';
            pageInfo.textContent = `${n}${right} / ${total}쪽`;
        } else pageInfo.textContent = '뒤표지';
    }

    // PDF n쪽으로 이동 (PDF n쪽 = 책 인덱스 n+1)
    function goToPdfPage(n) {
        if (!pageFlip || !embeddedOpen) return;
        pageFlip.flip(n + 1);
    }

    // 내장 전자책 열기
    function openEmbedded() {
        if (!book) { fileNameDisplay.textContent = '내장 전자책을 찾을 수 없습니다.'; return; }
        fileNameDisplay.textContent = book.file;
        renderBook(base64ToBytes(book.data), book.title, true);
    }

    if (book) {
        downloadLink.href = 'data:application/pdf;base64,' + book.data;
        downloadLink.setAttribute('download', book.file);
        tocNav.innerHTML = CHAPTERS.map(([no, name, pg]) =>
            `<button type="button" data-page="${pg}"><span>${no}</span>${name}</button>`).join('');
        tocNav.addEventListener('click', (e) => {
            const b = e.target.closest('button[data-page]');
            if (b) goToPdfPage(Number(b.dataset.page));
        });
    } else {
        openBtn.style.display = 'none';
        downloadLink.style.display = 'none';
    }

    openBtn.addEventListener('click', openEmbedded);

    // 다른 PDF 불러오기 (원래 수업 리더 기능 유지)
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            fileNameDisplay.textContent = 'PDF 파일을 선택해 주세요.';
            return;
        }
        fileNameDisplay.textContent = file.name;
        const bytes = new Uint8Array(await file.arrayBuffer());
        renderBook(bytes, file.name.replace(/\.pdf$/i, ''), false);
    });

    // 키보드 넘기기
    document.addEventListener('keydown', (e) => {
        if (!pageFlip) return;
        if (e.key === 'ArrowLeft') pageFlip.flipPrev();
        if (e.key === 'ArrowRight') pageFlip.flipNext();
    });

    // 페이지를 열면 바로 전자책 표시
    openEmbedded();
});

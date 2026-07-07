/**
 * 결혼 전시 웹 페이지 템플릿 - 구동 스크립트 (script.js)
 * 
 * config.js에서 설정한 데이터를 읽어와 화면을 구성하고,
 * 방문자 카운팅, 방명록 등록/삭제, 사진 확대 기능 등을 제어합니다.
 */

let lightboxImages = [];
let lightboxCurrentIndex = 0;

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCFScZfCVMZf87JqPWufzo0u8a5oc6kBOY",
  authDomain: "hanjieun-abcaa.firebaseapp.com",
  projectId: "hanjieun-abcaa",
  storageBucket: "hanjieun-abcaa.firebasestorage.app",
  messagingSenderId: "1055761893137",
  appId: "1:1055761893137:web:4377a69721f81036cc2eb0",
  measurementId: "G-EQB9062C86",
  databaseURL: "https://hanjieun-abcaa-default-rtdb.asia-southeast1.firebasedatabase.app" // 싱가포르 리전 우선 매핑
};

let database;
let guestbookRef;

function initFirebase() {
  if (typeof firebase !== 'undefined') {
    try {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
      guestbookRef = database.ref("guestbook");
    } catch (e) {
      console.warn("Firebase initialization failed with Singapore Region. Trying US Region...", e);
      // 싱가포르가 아니면 미국 주소로 fallback 시도
      firebaseConfig.databaseURL = "https://hanjieun-abcaa-default-rtdb.firebaseio.com";
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
      guestbookRef = database.ref("guestbook");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 0. 파이어베이스 초기화
  initFirebase();

  // config.js 불러오기 검증
  if (typeof weddingConfig === 'undefined') {
    console.error("config.js 파일이 올바르게 로드되지 않았습니다. 파일 경로를 확인해 주세요.");
    return;
  }

  // 1. 데이터 초기 바인딩 및 렌더링 시작
  initTemplateData();
  
  // 2. 방문자 카운팅 기능 실행
  initVisitorCounter();

  // 3. 이벤트 리스너 등록
  registerEventListeners();
});

/**
 * 템플릿 데이터 초기 바인딩
 */
function initTemplateData() {
  const config = weddingConfig;

  // 웹 브라우저 타이틀 및 메타 태그 설정
  document.title = config.meta.title;
  
  // 배경음악(BGM) 소스 연결
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic && config.bgm && config.bgm.src) {
    bgMusic.src = config.bgm.src;
  }
  
  // 메인 페이지 손글씨 타이틀 설정
  const handwrittenTitle = document.getElementById("handwrittenTitle");
  if (handwrittenTitle) {
    const line1 = config.main.titleLine1 || "";
    const line2 = config.main.titleLine2 || "";
    handwrittenTitle.innerHTML = `${line1}<br><span class="heart-newline">${line2}</span>`;
  }

  // 메인 커버 이미지 및 설명글 바인딩
  const coverImg = document.getElementById("coverImg");
  if (coverImg) coverImg.src = config.main.coverImage;

  const mainSubtitle = document.getElementById("mainSubtitle");
  if (mainSubtitle) mainSubtitle.textContent = config.main.subtitle;

  const mainDesc = document.getElementById("mainDesc");
  if (mainDesc) mainDesc.textContent = config.main.description;

  const startBtnText = document.querySelector("#startExhibitionBtn .btn-text");
  if (startBtnText && config.main.buttonText) {
    startBtnText.textContent = config.main.buttonText;
  }

  // 목차 모달 타이틀 및 서브타이틀 바인딩
  const tocModalTitle = document.getElementById("tocModalTitle");
  if (tocModalTitle) tocModalTitle.textContent = config.meta.title;
  const tocModalSubtitle = document.getElementById("tocModalSubtitle");
  if (tocModalSubtitle) tocModalSubtitle.textContent = config.main.subtitle;

  // 개별 룸 렌더링
  renderIntroRoom(config.rooms.intro);
  renderOathRoom(config.rooms.oath);
  renderPathRoom(config.rooms.path);
  renderStarRoom(config.rooms.star);
  renderPromiseRoom(config.rooms.promise);
  renderGuestbookRoom(config.rooms.guestbook);
  renderCongratsRoom(config.rooms.congrats);
  renderInfoRoom(config.rooms.info);
  renderOfflineRoom(config.rooms.offline);
}

/**
 * Room 1: 함께 걷는 시간 렌더링
 */
function renderIntroRoom(introConfig) {
  const title = document.getElementById("introTitle");
  if (title) title.textContent = introConfig.title;

  const subtitle = document.getElementById("introSubtitle");
  if (subtitle) subtitle.textContent = introConfig.subtitle;

  const desc = document.getElementById("introDesc");
  if (desc) desc.textContent = introConfig.description;

  const essayBox = document.getElementById("introEssay");
  if (essayBox) essayBox.textContent = introConfig.essay;
}

/**
 * Room 1-2: 증인 선서 렌더링 및 인터랙션 정의
 */
const WITNESS_STORAGE_KEY = "wedding_witness_name";

function renderOathRoom(oathConfig) {
  if (!oathConfig) return;

  const title = document.getElementById("oathTitle");
  if (title) title.textContent = oathConfig.title;

  const desc = document.getElementById("oathDesc");
  if (desc) desc.textContent = oathConfig.description || "두 사람의 마음을 확인하는 시간";

  const oathImg = document.getElementById("oathImg");
  if (oathImg) oathImg.src = oathConfig.image;

  const cardTitle = document.getElementById("oathCardTitle");
  if (cardTitle) cardTitle.textContent = oathConfig.titleText || "증인 선서문";

  const essayBox = document.getElementById("oathEssay");
  if (essayBox) essayBox.textContent = oathConfig.essay;

  const signForm = document.getElementById("oathSignForm");
  const signedNameSpan = document.getElementById("oathSignedName");
  const nameInput = document.getElementById("witnessNameInput");
  const signBtn = document.getElementById("oathSignBtn");
  const resetBtn = document.getElementById("oathResetBtn");

  // UI 상태 갱신 함수
  function updateOathUI() {
    const savedName = localStorage.getItem(WITNESS_STORAGE_KEY);
    if (savedName) {
      if (signForm) signForm.classList.add("hidden");
      if (signedNameSpan) {
        signedNameSpan.textContent = savedName;
        signedNameSpan.classList.remove("hidden");
      }
      if (resetBtn) resetBtn.classList.remove("hidden");
    } else {
      if (signForm) signForm.classList.remove("hidden");
      if (signedNameSpan) {
        signedNameSpan.textContent = "";
        signedNameSpan.classList.add("hidden");
      }
      if (resetBtn) resetBtn.classList.add("hidden");
      if (nameInput) {
        nameInput.value = "";
      }
    }
  }

  // 초기 상태 적용
  updateOathUI();

  // 선서하기 버튼 이벤트 바인딩
  if (signBtn && nameInput) {
    signBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (!name) {
        alert("이름을 입력해 주세요.");
        nameInput.focus();
        return;
      }

      // 스토리지 저장 및 UI 업데이트
      localStorage.setItem(WITNESS_STORAGE_KEY, name);
      updateOathUI();
      showToast("선서가 완료되었습니다. 소중한 증인이 되어주셔서 감사합니다.");
    });
  }

  // 다시 선서하기 버튼 이벤트 바인딩
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(WITNESS_STORAGE_KEY);
      updateOathUI();
      if (nameInput) nameInput.focus();
    });
  }
}

/**
 * Room 2: 두 사람이 걸어온 길 렌더링
 */
function renderPathRoom(pathConfig) {
  const title = document.getElementById("pathTitle");
  if (title) title.textContent = pathConfig.title;

  const subtitle = document.getElementById("pathSubtitle");
  if (subtitle) subtitle.textContent = pathConfig.subtitle;

  const desc = document.getElementById("pathDesc");
  if (desc) desc.textContent = pathConfig.description;

  // 비디오 그리드 렌더링
  const videoGrid = document.getElementById("pathVideoGrid");
  if (videoGrid && pathConfig.videos) {
    videoGrid.innerHTML = "";
    pathConfig.videos.forEach(v => {
      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        <div class="video-wrapper">
          ${createVideoMarkup(v)}
        </div>
        <div class="video-label">${escapeHtml(v.label)}</div>
      `;
      videoGrid.appendChild(card);
    });
  }

  // 에세이 렌더링
  const essayBox = document.getElementById("pathEssay");
  if (essayBox) essayBox.textContent = pathConfig.essay;

  // 소중한 참고인들 렌더링
  const refGrid = document.getElementById("pathReferences");
  if (refGrid && pathConfig.references) {
    refGrid.innerHTML = "";
    pathConfig.references.forEach(ref => {
      const item = document.createElement("div");
      item.className = "reference-name";
      item.textContent = ref;
      refGrid.appendChild(item);
    });
  }
}

/**
 * Room 3: 북두칠성이 쩜이라도 렌더링
 */
function renderStarRoom(starConfig) {
  const title = document.getElementById("starTitle");
  if (title) title.textContent = starConfig.title;

  const subtitle = document.getElementById("starSubtitle");
  if (subtitle) subtitle.textContent = starConfig.subtitle;

  const desc = document.getElementById("starDesc");
  if (desc) desc.textContent = starConfig.description;

  // 메인 비디오 렌더링
  const wrapper = document.getElementById("starVideoWrapper");
  if (wrapper && starConfig.video) {
    wrapper.innerHTML = `
      <div class="video-wrapper">
        ${createVideoMarkup(starConfig.video)}
      </div>
    `;
  }

  // 시놉시스 렌더링
  const synopsisBox = document.getElementById("starSynopsis");
  if (synopsisBox) synopsisBox.textContent = starConfig.synopsis;

  // 크레딧 렌더링
  const creditList = document.getElementById("starCredits");
  if (creditList && starConfig.credits) {
    creditList.innerHTML = "";
    starConfig.credits.forEach(c => {
      const row = document.createElement("div");
      row.className = "credit-row";
      row.innerHTML = `
        <span class="credit-key">${escapeHtml(c.key)}</span>
        <span class="credit-value">${escapeHtml(c.value)}</span>
      `;
      creditList.appendChild(row);
    });
  }
}

/**
 * Room 4: 약속의 길 렌더링
 */
function renderPromiseRoom(promiseConfig) {
  const title = document.getElementById("promiseTitle");
  if (title) title.textContent = promiseConfig.title;

  const subtitle = document.getElementById("promiseSubtitle");
  if (subtitle) subtitle.textContent = promiseConfig.subtitle;

  const desc = document.getElementById("promiseDesc");
  if (desc) desc.textContent = promiseConfig.description;

  // 에세이 렌더링
  const essayBox = document.getElementById("promiseEssay");
  if (essayBox) essayBox.textContent = promiseConfig.essay;

  // 아코디언 렌더링
  const accordionContainer = document.getElementById("promiseAccordionContainer");
  if (accordionContainer && promiseConfig.questionItems) {
    accordionContainer.innerHTML = "";
    
    promiseConfig.questionItems.forEach(item => {
      // 아코디언 아이템 래퍼
      const accordionItem = document.createElement("div");
      accordionItem.className = "accordion-item";
      
      // 아코디언 버튼
      const button = document.createElement("button");
      button.className = "accordion-btn";
      button.innerHTML = `
        <span class="accordion-btn-text">${escapeHtml(item.buttonText)}</span>
        <i class="fas fa-chevron-down accordion-icon"></i>
      `;
      
      // 아코디언 콘텐츠 패널
      const panel = document.createElement("div");
      panel.className = "accordion-panel";
      
      // 패널 내용물 HTML 조립
      let imagesHtml = "";
      if (item.images && item.images.length > 0) {
        imagesHtml = `
          <div class="accordion-gallery">
            ${item.images.map(img => `
              <div class="accordion-gallery-item">
                <img src="${img.src}" alt="${escapeHtml(img.caption || '')}" loading="lazy">
                <div class="gallery-info">${escapeHtml(img.caption || '')}</div>
              </div>
            `).join("")}
          </div>
        `;
      }
      
      // 답변 HTML 조립
      let answerHtml = "";
      if (item.id === 5) {
        // 5번째 질문은 방명록으로 유도하는 경우
        answerHtml = `
          <div class="accordion-answer-box">
            <p class="accordion-question-text">${escapeHtml(item.question)}</p>
            <p class="accordion-prompt-text">${escapeHtml(promiseConfig.lastPrompt)}</p>
            <button type="button" class="btn-primary-small go-to-guestbook-btn" style="margin-top: 1rem; width: 100%;">질문 남기러 가기 <i class="fas fa-arrow-right"></i></button>
          </div>
        `;
      } else {
        answerHtml = `
          <div class="accordion-answer-box">
            <p class="accordion-question-text">${escapeHtml(item.question)}</p>
            <div class="accordion-answer-text">${escapeHtml(item.answer)}</div>
          </div>
        `;
      }
      
      panel.innerHTML = `
        <div class="accordion-panel-content">
          ${imagesHtml}
          ${answerHtml}
        </div>
      `;
      
      // 5번째 질문의 '방명록 가기' 버튼 클릭 이벤트 리스너 바인딩
      if (item.id === 5) {
        const btn = panel.querySelector(".go-to-guestbook-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            switchRoom("guestbook");
          });
        }
      }
      
      // 갤러리 이미지 클릭 시 라이트박스 이벤트 바인딩
      if (item.images && item.images.length > 0) {
        const imgEls = panel.querySelectorAll(".accordion-gallery-item");
        imgEls.forEach((el, index) => {
          el.addEventListener("click", () => {
            openLightbox(item.images, index);
          });
        });
      }
      
      // 버튼 클릭 시 패널 열고 닫는 토글 동작 바인딩
      button.addEventListener("click", () => {
        const isActive = button.classList.contains("active");
        
        // (선택사항) 다른 열려있는 아코디언 닫기
        accordionContainer.querySelectorAll(".accordion-btn").forEach(btn => {
          if (btn !== button && btn.classList.contains("active")) {
            btn.classList.remove("active");
            const closingPanel = btn.nextElementSibling;
            if (closingPanel) {
              // transition을 해제하여 타 아코디언은 화면 덜컹거림 없이 즉시 0px로 접히도록 조치
              closingPanel.style.transition = "none";
              closingPanel.style.maxHeight = null;
              // 리플로우를 일으켜 transition 속성을 다음 열림을 위해 복구
              closingPanel.offsetHeight;
              closingPanel.style.transition = "";

              const gallery = closingPanel.querySelector(".accordion-gallery");
              if (gallery) {
                gallery.scrollLeft = 0;
              }
            }
          }
        });
        
        button.classList.toggle("active");
        if (isActive) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
          // 아코디언이 열릴 때 가로 스크롤 갤러리를 맨 처음 위치(0)로 리셋
          const gallery = panel.querySelector(".accordion-gallery");
          if (gallery) {
            gallery.scrollLeft = 0;
          }

          // 바닥 한계선(Scroll Boundary Limit)에 막혀 스크롤이 도중에 락 걸리는 현상을 해결하기 위해 
          // 아코디언 컨테이너 하단에 임시로 가상의 스크롤 가용 공간(60vh)을 즉시 부여
          accordionContainer.style.paddingBottom = "60vh";
          accordionContainer.style.transition = "padding-bottom 0.3s ease";

          // 아코디언 질문이 열릴 때 화면 스크롤이 해당 질문의 상단으로 부드럽게 자동 이동 (상단 고정 내비게이션 바 높이 고려)
          // 타 아코디언이 즉시 닫혔으므로, 50ms 만에 오차 없는 절대 좌표로 신속하고 부드럽게 스크롤을 시동
          setTimeout(() => {
            const headerOffset = 80;
            const absoluteTop = getAbsoluteTop(accordionItem);
            const offsetPosition = absoluteTop - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
            
            // 스크롤이 부드럽게 완료되는 시점(600ms 뒤)에 추가했던 가상 하단 여백 공간을 서서히 원상복구
            setTimeout(() => {
              accordionContainer.style.paddingBottom = "0px";
            }, 600);
          }, 50);
        }
      });
      
      accordionItem.appendChild(button);
      accordionItem.appendChild(panel);
      accordionContainer.appendChild(accordionItem);
    });
  }

  // 순례길 비디오 렌더링
  const wrapper = document.getElementById("promiseVideoWrapper");
  if (wrapper && promiseConfig.video) {
    wrapper.innerHTML = `
      <div class="video-wrapper">
        ${createVideoMarkup(promiseConfig.video)}
      </div>
    `;
  }
}

/**
 * Room 5: 방명록 설명 렌더링
 */
function renderGuestbookRoom(guestbookConfig) {
  const desc = document.getElementById("guestbookDesc");
  if (desc) desc.textContent = guestbookConfig.description;

  // 방명록 목록 불러오기
  renderGuestbook();
}

/**
 * Room 6: 축사 렌더링
 */
function renderCongratsRoom(congratsConfig) {
  if (!congratsConfig) return;

  const title = document.getElementById("congratsTitle");
  if (title) title.textContent = congratsConfig.title;

  const desc = document.getElementById("congratsDesc");
  if (desc) desc.textContent = congratsConfig.description;

  const container = document.getElementById("congratsImages");
  if (container && congratsConfig.images) {
    container.innerHTML = "";
    congratsConfig.images.forEach((img, index) => {
      const item = document.createElement("div");
      item.className = "congrats-image-item";
      item.innerHTML = `
        <img src="${img.src}" alt="${escapeHtml(img.caption || '')}" loading="lazy">
        <div class="gallery-info">${escapeHtml(img.caption || '')}</div>
      `;

      // 이미지 클릭 시 확대(라이트박스) 이벤트 바인딩
      item.addEventListener("click", () => {
        openLightbox(congratsConfig.images, index);
      });

      container.appendChild(item);
    });
  }
}

/**
 * Room 7: 관람 안내 렌더링
 */
function renderInfoRoom(infoConfig) {
  const desc = document.getElementById("infoDesc");
  if (desc) desc.textContent = infoConfig.description;

  // 연락처 및 계좌번호 렌더링
  renderContacts(infoConfig.contacts);
  renderAccounts(infoConfig.accounts);

  // 신랑 신부 프로필 아래 가로 나열 비디오 그리드 렌더링
  const videoGrid = document.getElementById("infoVideoGrid");
  if (videoGrid) {
    videoGrid.innerHTML = "";
    if (infoConfig.videos && infoConfig.videos.length > 0) {
      infoConfig.videos.forEach(v => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
          <div class="video-wrapper">
            ${createVideoMarkup(v)}
          </div>
          ${v.label ? `<div class="video-label">${escapeHtml(v.label)}</div>` : ''}
        `;
        videoGrid.appendChild(card);
      });
    }
  }
}

/**
 * Room 8: 오프라인 전시 모습 렌더링
 */
function renderOfflineRoom(offlineConfig) {
  if (!offlineConfig) return;

  const title = document.getElementById("offlineTitle");
  if (title) title.textContent = offlineConfig.title;

  const subtitle = document.getElementById("offlineSubtitle");
  if (subtitle) subtitle.textContent = offlineConfig.subtitle;

  const desc = document.getElementById("offlineDesc");
  if (desc) desc.textContent = offlineConfig.description;

  const container = document.getElementById("offlineGallery");
  if (container && offlineConfig.images) {
    container.innerHTML = "";
    offlineConfig.images.forEach((img, index) => {
      const item = document.createElement("div");
      item.className = "offline-gallery-item";
      item.innerHTML = `
        <img src="${img.src}" alt="${escapeHtml(img.caption || '')}" loading="lazy">
        <div class="gallery-info">${escapeHtml(img.caption || '')}</div>
      `;

      item.addEventListener("click", () => {
        openLightbox(offlineConfig.images, index);
      });

      container.appendChild(item);
    });
  }
}

/**
 * 방문자 카운팅 기능 (localStorage 시뮬레이션)
 */
function initVisitorCounter() {
  const todayKey = "wedding_visit_today_date";
  const todayCountKey = "wedding_visit_today_count";
  const totalCountKey = "wedding_visit_total_count";

  // 현재 날짜 구하기 (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  
  let savedDate = localStorage.getItem(todayKey);
  let todayCount = parseInt(localStorage.getItem(todayCountKey)) || 0;
  let totalCount = parseInt(localStorage.getItem(totalCountKey)) || 0;

  // 초기 방문이거나 날짜가 바뀐 경우
  if (!savedDate || savedDate !== todayStr) {
    localStorage.setItem(todayKey, todayStr);
    
    // 신규 방문 시 정직하게 1부터 시작
    if (totalCount === 0) {
      todayCount = 1;
      totalCount = 1;
    } else {
      totalCount = totalCount + 1;
      todayCount = 1;
    }
  } else {
    todayCount += 1;
    totalCount += 1;
  }

  // 스토리지에 업데이트
  localStorage.setItem(todayCountKey, todayCount);
  localStorage.setItem(totalCountKey, totalCount);

  // UI 엘리먼트에 업데이트
  const todayCountEl = document.getElementById("todayCount");
  if (todayCountEl) todayCountEl.textContent = todayCount;

  const totalCountEl = document.getElementById("totalCount");
  if (totalCountEl) totalCountEl.textContent = totalCount;
}

/**
 * Room 6: Info - 연락처 목록 렌더링
 */
function renderContacts(contacts) {
  const container = document.getElementById("contactContainer");
  if (!container || !contacts) return;

  container.innerHTML = "";
  contacts.forEach(contact => {
    const card = document.createElement("div");
    card.className = "contact-card";
    
    // 프로필 이미지가 없을 때를 대비한 기본값 처리
    const avatarImg = contact.image || "images/default-avatar.png";
    // instagram 값이 http로 시작하는 전체 URL이면 그대로 사용, 아니면 조립
    let instagramUrl = "#";
    if (contact.instagram) {
      if (contact.instagram.startsWith("http://") || contact.instagram.startsWith("https://")) {
        instagramUrl = contact.instagram;
      } else {
        instagramUrl = `https://instagram.com/${contact.instagram}`;
      }
    }
    
    card.innerHTML = `
      <div class="contact-profile">
        <div class="contact-avatar">
          <img src="${avatarImg}" alt="${contact.name} 프로필 이미지">
        </div>
        <div class="contact-info-text">
          <div class="contact-role">${contact.role}</div>
          <div class="contact-name">${contact.name}</div>
        </div>
      </div>
      <div class="contact-actions">
        <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="contact-btn" title="인스타그램 방문">
          <i class="fab fa-instagram"></i>
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * Room 6: Info - 계좌번호 목록 렌더링
 */
function renderAccounts(accounts) {
  const container = document.getElementById("accountContainer");
  if (!container || !accounts) return;

  container.innerHTML = "";
  accounts.forEach(acc => {
    const card = document.createElement("div");
    card.className = "account-card";
    
    card.innerHTML = `
      <div class="account-details">
        <div class="account-role-label">${acc.role}</div>
        <div class="account-number-text">${acc.bank} ${acc.number} (${acc.holder})</div>
      </div>
      <button class="btn-copy" data-account="${acc.bank} ${acc.number}">
        <i class="far fa-copy"></i> 복사
      </button>
    `;
    
    // 복사 버튼 기능 연결
    card.querySelector(".btn-copy").addEventListener("click", (e) => {
      const accNumber = e.currentTarget.getAttribute("data-account");
      copyToClipboard(accNumber);
    });

    container.appendChild(card);
  });
}

/**
 * 클립보드 복사 유틸 함수
 */
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("계좌번호가 복사되었습니다.");
    }).catch(err => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";  // 화면 밖 배치
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast("계좌번호가 복사되었습니다.");
  } catch (err) {
    showToast("복사에 실패했습니다. 직접 복사해 주세요.");
  }
  document.body.removeChild(textArea);
}

/**
 * 커스텀 토스트 알림 노출
 */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

/**
 * 갤러리 이미지 라이트박스 열기 (배열과 시작 인덱스를 인자로 가짐)
 */
function openLightbox(imagesArray, startIndex) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox || !imagesArray || imagesArray.length === 0) return;

  // 단일 이미지 문자열 경로가 들어왔을 때의 예외 처리(하이브리드 호환성)
  if (typeof imagesArray === "string") {
    lightboxImages = [{ src: imagesArray, caption: startIndex || "" }];
    lightboxCurrentIndex = 0;
  } else {
    lightboxImages = imagesArray;
    lightboxCurrentIndex = startIndex || 0;
  }

  updateLightboxImage();
  lightbox.classList.add("active-lightbox");
}

/**
 * 라이트박스 내부의 이미지 소스 및 캡션, 이동 화살표 상태 동적 업데이트
 */
function updateLightboxImage() {
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const prevBtn = document.getElementById("lightboxPrevBtn");
  const nextBtn = document.getElementById("lightboxNextBtn");

  if (!lightboxImg || !lightboxCaption) return;

  const current = lightboxImages[lightboxCurrentIndex];
  if (!current) return;

  lightboxImg.src = current.src;
  lightboxCaption.textContent = current.caption || "";

  // 첫 장이거나 마지막 장일 때 화살표 가시성(display: none) 제어
  if (prevBtn) prevBtn.style.display = lightboxCurrentIndex > 0 ? "flex" : "none";
  if (nextBtn) nextBtn.style.display = lightboxCurrentIndex < lightboxImages.length - 1 ? "flex" : "none";
}

/**
 * 갤러리 이미지 라이트박스 닫기
 */
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.classList.remove("active-lightbox");
  }
}

/**
 * Room 5: Guestbook - 방명록 목록 렌더링 및 로컬스토리지 제어
 */
const GUESTBOOK_STORAGE_KEY = "wedding_guestbook_messages";

function getGuestbookData() {
  return JSON.parse(localStorage.getItem(GUESTBOOK_STORAGE_KEY)) || [];
}

function renderGuestbook() {
  const listContainer = document.getElementById("guestbookList");
  if (!listContainer) return;

  // 파이어베이스가 비활성화되어 있는 경우 구형 로컬 스토리지로 복구
  if (typeof firebase === 'undefined' || !guestbookRef) {
    const data = getGuestbookData();
    listContainer.innerHTML = "";
    if (data.length === 0) {
      listContainer.innerHTML = `<p style="text-align:center; color:#999; font-size:0.85rem; padding: 2rem 0;">첫 번째 따뜻한 축하 메시지를 남겨보세요.</p>`;
      return;
    }
    renderDataList(data, listContainer, false);
    return;
  }

  // 파이어베이스 연동 실시간 데이터 리스너 등록
  guestbookRef.off();
  guestbookRef.on("value", (snapshot) => {
    const dataObj = snapshot.val();
    listContainer.innerHTML = "";

    if (!dataObj) {
      listContainer.innerHTML = `<p style="text-align:center; color:#999; font-size:0.85rem; padding: 2rem 0;">첫 번째 따뜻한 축하 메시지를 남겨보세요.</p>`;
      return;
    }

    const data = [];
    for (let key in dataObj) {
      data.push({
        id: key, // 파이어베이스 Push Key
        name: dataObj[key].name,
        pw: dataObj[key].pw,
        message: dataObj[key].message,
        date: dataObj[key].date
      });
    }

    // 최신 글이 위로 오도록 정렬
    data.reverse();
    renderDataList(data, listContainer, true);
  });
}

function renderDataList(data, listContainer, isFirebase) {
  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "guestbook-card";
    
    card.innerHTML = `
      <div class="guestbook-card-header">
        <span class="guestbook-writer">${escapeHtml(item.name)}</span>
        <span class="guestbook-date">
          ${item.date} 
          <button class="guestbook-delete-btn" data-id="${item.id}" title="삭제"><i class="fas fa-trash-alt"></i></button>
        </span>
      </div>
      <p class="guestbook-message">${escapeHtml(item.message)}</p>
    `;

    // 삭제 버튼 동작 설정
    card.querySelector(".guestbook-delete-btn").addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      deleteGuestbookMessage(id, isFirebase);
    });

    listContainer.appendChild(card);
  });
}

function addGuestbookMessage(name, pw, message) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

  const newMsg = {
    name: name,
    pw: pw,
    message: message,
    date: dateStr
  };

  if (typeof firebase !== 'undefined' && guestbookRef) {
    guestbookRef.push(newMsg);
  } else {
    const data = getGuestbookData();
    newMsg.id = Date.now();
    data.unshift(newMsg); // 최신 글이 맨 위로
    localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(data));
    renderGuestbook();
  }
}

function deleteGuestbookMessage(id, isFirebase) {
  // 비밀번호 확인 팝업
  const userPw = prompt("등록 시 설정한 비밀번호를 입력해 주세요:");
  if (userPw === null) return; // 취소

  if (isFirebase && typeof firebase !== 'undefined' && guestbookRef) {
    guestbookRef.child(id).once("value", (snapshot) => {
      const val = snapshot.val();
      if (val && val.pw === userPw) {
        guestbookRef.child(id).remove();
        showToast("방명록이 삭제되었습니다.");
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    });
  } else {
    const data = getGuestbookData();
    const numericId = parseInt(id);
    const target = data.find(item => item.id === numericId);
    if (!target) return;

    if (userPw === target.pw) {
      const filtered = data.filter(item => item.id !== numericId);
      localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(filtered));
      renderGuestbook();
      showToast("방명록이 삭제되었습니다.");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  }
}

// XSS 방지용 이스케이프 함수
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// 요소의 문서 기준 절대 Y좌표를 획득하는 함수
function getAbsoluteTop(element) {
  let top = 0;
  while (element) {
    top += element.offsetTop;
    element = element.offsetParent;
  }
  return top;
}

// 유튜브 및 로컬 비디오 마크업 동적 생성 헬퍼 함수
function createVideoMarkup(videoObj) {
  if (!videoObj) return "";
  if (videoObj.youtubeId) {
    const videoTitle = videoObj.label || "YouTube video player";
    return `
      <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoObj.youtubeId}" title="${escapeHtml(videoTitle)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
  } else {
    return `
      <video src="${videoObj.src || ''}" poster="${videoObj.poster || ''}" controls playsinline preload="metadata"></video>
    `;
  }
}

/**
 * 룸 이동 제어 로직
 */
const ROOM_ORDER = ["intro", "oath", "path", "star", "promise", "guestbook", "congrats", "info", "offline"];
let currentRoomIndex = 0;

function switchRoom(roomName) {
  const index = ROOM_ORDER.indexOf(roomName);
  if (index === -1) return;

  currentRoomIndex = index;
  
  // 0. 재생 중인 유튜브(iframe) 및 로컬 비디오 일시정지
  document.querySelectorAll(".room-panel iframe").forEach(iframe => {
    const src = iframe.getAttribute("src");
    if (src) {
      iframe.setAttribute("src", "");
      iframe.setAttribute("src", src);
    }
  });
  document.querySelectorAll(".room-panel video").forEach(video => {
    video.pause();
  });
  
  // 1. 모든 룸 콘텐츠 숨기기 및 타겟 룸 활성화
  document.querySelectorAll(".room-panel").forEach(panel => {
    panel.classList.remove("active-panel");
  });
  const targetPanel = document.getElementById(`room-${roomName}`);
  if (targetPanel) targetPanel.classList.add("active-panel");

  // 2. 내비게이션 바 타이틀 변경
  const titleMap = {
    intro: "전시 소개",
    oath: "증인 선서",
    path: "1. 두 사람이 걸어온 길",
    star: "2. 북두칠성이 쩜이라도",
    promise: "3. 약속의 길",
    guestbook: "4. 다섯 번째 질문",
    congrats: "5. 축사",
    info: "6. 신랑 신부 연락하기",
    offline: "7. 오프라인 전시 모습"
  };
  const currentTitleEl = document.getElementById("currentRoomTitle");
  if (currentTitleEl) {
    currentTitleEl.textContent = titleMap[roomName] || "Our Journey";
  }

  // 3. TOC 항목 활성화 상태 갱신
  document.querySelectorAll(".toc-item").forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("data-room") === roomName) {
      item.classList.add("active");
    }
  });

  // 4. 전시 콘텐츠 영역 및 윈도우 스크롤을 맨 위로 이동
  const contentBox = document.querySelector(".exhibition-content-box");
  if (contentBox) contentBox.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // 5. 이동 시 다른 방의 모든 HTML5 비디오 일시중지
  document.querySelectorAll("video").forEach(v => {
    v.pause();
  });
}

/**
 * 목차 모달 제어 함수
 */
function openTocModal() {
  const tocModal = document.getElementById("tocModal");
  if (tocModal) tocModal.classList.add("active-modal");
}

function closeTocModal() {
  const tocModal = document.getElementById("tocModal");
  if (tocModal) tocModal.classList.remove("active-modal");
}

/**
 * 목차 항목 클릭 시 세부 네비게이션 제어
 */
function handleTocNavigation(room, target) {
  // 1. 대분류 방으로 전환
  switchRoom(room);
  
  // 2. 목차창 닫기
  closeTocModal();

  // 3. 세부 항목 타겟이 존재할 경우 스크롤 및 액션 수행 (트랜지션 텀 고려)
  if (target) {
    setTimeout(() => {
      if (target === "contact") {
        const element = document.getElementById("contactContainer");
        if (element) {
          element.closest(".info-section").scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (target === "account") {
        const element = document.getElementById("accountContainer");
        if (element) {
          element.closest(".info-section").scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 150);
  }
}

/**
 * 이벤트 리스너 통합 등록
 */
function registerEventListeners() {
  
  // [메인 커버 - 전시 보러가기 버튼]
  const startBtn = document.getElementById("startExhibitionBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      document.getElementById("mainCover").classList.add("hidden");
      document.getElementById("exhibitionContainer").classList.remove("hidden");
      switchRoom("intro");
    });
  }

  // [상단바 처음으로 버튼 (홈 돌아가기)]
  const backHomeBtn = document.getElementById("backToHomeBtn");
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      document.querySelectorAll("video").forEach(v => v.pause());
      document.getElementById("exhibitionContainer").classList.add("hidden");
      document.getElementById("mainCover").classList.remove("hidden");
    });
  }

  // [목차 열기 및 닫기 버튼 이벤트]
  const tocToggleBtn = document.getElementById("tocToggleBtn");
  const closeTocModalBtn = document.getElementById("closeTocModalBtn");
  const tocModal = document.getElementById("tocModal");

  if (tocToggleBtn) tocToggleBtn.addEventListener("click", openTocModal);
  if (closeTocModalBtn) closeTocModalBtn.addEventListener("click", closeTocModal);
  if (tocModal) {
    tocModal.addEventListener("click", (e) => {
      if (e.target === tocModal) closeTocModal();
    });
  }

  // [목차 항목 클릭 네비게이션 적용]
  document.querySelectorAll(".toc-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const room = e.currentTarget.getAttribute("data-room");
      const target = e.currentTarget.getAttribute("data-target");
      
      document.querySelectorAll(".toc-item").forEach(el => el.classList.remove("active"));
      e.currentTarget.classList.add("active");

      handleTocNavigation(room, target);
    });
  });

  // [이전 방 / 다음 방 화살표 컨트롤러]
  const prevBtn = document.getElementById("prevRoomBtn");
  const nextBtn = document.getElementById("nextRoomBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentRoomIndex > 0) {
        switchRoom(ROOM_ORDER[currentRoomIndex - 1]);
      } else {
        document.querySelectorAll("video").forEach(v => v.pause());
        document.getElementById("exhibitionContainer").classList.add("hidden");
        document.getElementById("mainCover").classList.remove("hidden");
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentRoomIndex < ROOM_ORDER.length - 1) {
        switchRoom(ROOM_ORDER[currentRoomIndex + 1]);
      } else {
        showToast("마지막 전시 공간입니다. 축하해 주셔서 감사합니다.");
      }
    });
  }

  // [Room 3: Gallery - 라이트박스 닫기]
  // [Room 3: Gallery - 라이트박스 제어 및 슬라이더]
  const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
  const lightbox = document.getElementById("lightbox");
  const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("lightboxNextBtn");

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
  
  if (lightbox) {
    // 배경 클릭 시 닫기
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // 이전 버튼 클릭
    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (lightboxCurrentIndex > 0) {
          lightboxCurrentIndex--;
          updateLightboxImage();
        }
      });
    }

    // 다음 버튼 클릭
    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (lightboxCurrentIndex < lightboxImages.length - 1) {
          lightboxCurrentIndex++;
          updateLightboxImage();
        }
      });
    }

    // 모바일 터치 스와이프 제스처 바인딩
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      
      const threshold = 50; // 스와이프 감지 임계값 (px)
      if (touchStartX - touchEndX > threshold) {
        // 왼쪽 스와이프 (다음 이미지)
        if (lightboxCurrentIndex < lightboxImages.length - 1) {
          lightboxCurrentIndex++;
          updateLightboxImage();
        }
      } else if (touchEndX - touchStartX > threshold) {
        // 오른쪽 스와이프 (이전 이미지)
        if (lightboxCurrentIndex > 0) {
          lightboxCurrentIndex--;
          updateLightboxImage();
        }
      }
    }, { passive: true });

    // 키보드 좌우 화살표/ESC 키 바인딩
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active-lightbox")) return;

      if (e.key === "ArrowLeft") {
        if (lightboxCurrentIndex > 0) {
          lightboxCurrentIndex--;
          updateLightboxImage();
        }
      } else if (e.key === "ArrowRight") {
        if (lightboxCurrentIndex < lightboxImages.length - 1) {
          lightboxCurrentIndex++;
          updateLightboxImage();
        }
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    });
  }

  // [Room 4: Guestbook - 방명록 작성 제출]
  const guestbookForm = document.getElementById("guestbookForm");
  if (guestbookForm) {
    guestbookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("guestName");
      const pwInput = document.getElementById("guestPassword");
      const msgInput = document.getElementById("guestMessage");

      addGuestbookMessage(nameInput.value.trim(), pwInput.value, msgInput.value.trim());

      nameInput.value = "";
      pwInput.value = "";
      msgInput.value = "";

      showToast("축하 메시지가 등록되었습니다.");
    });
  }

  // [배경음악 재생/정지 제어]
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const bgMusic = document.getElementById("bgMusic");

  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicToggleBtn.classList.add("playing");
          musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }).catch(err => {
          alert("음악 파일 로딩 중 오류가 발생했거나, 브라우저가 자동 재생을 차단했습니다. 재생 단추를 다시 눌러주세요.");
        });
      } else {
        bgMusic.pause();
        musicToggleBtn.classList.remove("playing");
        musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>';
      }
    });
  }
}

/**
 * 결혼 전시 웹 페이지 템플릿 - 설정 파일 (config.js)
 * 
 * 이 파일의 값을 변경하면 웹 페이지의 텍스트, 이미지, 동영상 경로 등이 자동으로 변경됩니다.
 * 사용자가 본인의 전시 기획에 맞추어 자유롭게 변경할 수 있는 가장 중요한 공간입니다.
 */

const weddingConfig = {
  // 웹 브라우저 탭에 표시되는 기본 정보 (SEO 및 타이틀)
  meta: {
    title: "허지은&김한 [함께 걷는 시간] 온라인 결혼 전시",
    description: "결혼식 대신 온라인 갤러리에서 결혼 전시를 진행합니다. 우리의 특별한 여정을 함께해 주세요.",
    ogImage: "images/main_cover.png"
  },

  // 배경음악(BGM) 설정
  bgm: {
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },

  // 메인 화면 (커버 페이지) 설정
  main: {
    titleLine1: "",
    titleLine2: "",
    subtitle: "혼인을 증명하기 위해 귀하를 증인으로 채택합니다.",
    description: "",
    coverImage: "images/main_cover.png",
    buttonText: "증인 되기 START"
  },

  // 전시 카테고리 (방) 리스트 설정
  rooms: {
    // 1. 전시 소개: 함께 걷는 시간
    intro: {
      title: "함께 걷는 시간",
      subtitle: "",
      description: "",
      // 이미지 2번 에세이 본문
      essay: `2019년 12월 25일,
처음으로 둘이서 북한산을 함께 오를 때만해도
내가 이 사람보다 너무 빠르거나 늦지는 않은 지 전전긍긍했던 것 같습니다.

가끔 좁은 골목길을 만나면 누가 먼저 갈지 눈치 싸움을 하기도 했고,
평탄하고 고른 길을 걸으며 잡은 손에 설레하다가도,
예기치 못한 자갈길을 만나 뾰족해진 서로의 말에 아파하던 날도 있었지요.

그렇게 6년이라는 시간 동안
부지런히 맞춰온 저희의 걸음은
이제 참 많이 닮아졌습니다.

좁은 길 앞에서 자연스럽게 한 걸음 물러설 줄도 알고,
서로의 발을 보지 않고도 같은 보폭으로 나란히 걷습니다.
이제는 편안한 호흡으로,
눈 앞에 마주하는 풍경을 함께 즐길 수 있게 된 것이지요.

이 시간들을 나침반 삼아,
앞으로는 부부로서 같은 곳을 바라보며 걸어보려 합니다.
어두운 길 앞에서 두려울 때 손 잡아주고
새로운 길 앞에서 외로울 땐 손 끌어주며
그렇게 용기내어 걷겠습니다.

이 곳은 저희가 부부로서 내딛는 첫 발자국입니다.
이 첫 걸음에 증인이 되어주세요.
환영합니다!`
    },

    // 증인 선서
    oath: {
      title: "증인 선서",
      image: "images/증인선서.jpg",
      titleText: "증인 선서문",
      essay: `나는 오늘 이 곳에서 두 사람의 마음을 확인 합니다.
양심에 따라 숨김과 보탬이 없이 부부로 나서는 두 사람의 걸음에
기꺼이 든든한 이정표이자 증인이 되어줄 것을 맹세합니다.`
    },

    // 두 사람이 걸어온 길
    path: {
      title: "두 사람이 걸어온 길",
      subtitle: "1993 ~ 2026 / 1994 ~ 2026",
      description: "오랜 시간 두 사람의 곁을 지켜준 소중한 참고인 분들의 목소리를 빌려,\n우리가 미처 몰랐던 두 사람의 조각들을 소개합니다.",
      // 이미지 3번 에세이 본문
      essay: `진심으로 저희의 결혼을 축하해주시는 분들께
우리를 어떻게 소개하면 좋을까 고민해 보았습니다.

6년이라는 시간을 가장 가까이에서 함께한 저희도
계속해서 변화하는 서로를 온전히 다 알지는 못하기에,
오랜 시간 곁에서 저희를 지켜봐 준 분들의 시선으로 만들어진
두 사람의 다양한 조각들을 모아보기로 했습니다.

소중한 참고인들의 목소리를 빌려,
저희조차 미처 몰랐던 서로의 낯선 조각들을 소개합니다.
이를 통해 조금이나마 저희를 알아가는 시간이 되기를 바랍니다.
그리고 영상 속 조각들을 마주한 여러분이 느낀 저희의 모습을
글과 그림 등 다양한 방법으로 채워 또 다른 조각을 만들어주세요!`,
      // 나의 소중한 참고인들 명단
      references: [
        "허지혜", "심혜선", "이정순", "김태동",
        "윤희선", "김효영", "조영빈", "최종운",
        "이규성", "김지우", "박민수", "박희찬",
        "양유정", "", "이명륜"
      ],
      // 2개의 인터뷰 비디오 리스트 (샘플 비디오 연결, 로컬 파일 교체 가능)
      videos: [
        {
          label: "신부 허지은의 참고인 인터뷰",
          youtubeId: "OGkxRaG4qDw"
        },
        {
          label: "신랑 김한의 참고인 인터뷰",
          youtubeId: "Muz0_NuyjC0"
        }
      ]
    },

    // 북두칠성이 쩜이라도
    star: {
      title: "북두칠성이 쩜이라도",
      subtitle: "우리가 사랑을 시작한 날 2020. 01. 10 ~ / Screening / 8min",
      description: "조금은 더 내밀하고 깊은 두 사람의 세계를 담아낸 영상 에세이를 상영합니다.",
      // 이미지 4번 시놉시스
      synopsis: `바깥세상이 두려워 스스로 교도소에 들어온 견우와
자신의 물음이 세상에 받아들여지지 않아 교도소로 들어온 직녀.

서로의 얼굴은 알지 못하지만,
직녀가 매일같이 보내오는 편지를 통해
서로를 알아가는 둘은 펜팔 연인이다.

어느 날,
이곳에서는 북두칠성이 보이지 않는다며
돌연 교도소를 나선 직녀는
견우와 칠월칠석에 바깥세상에서 만나기로 하는데...

망망대해에서도 길을 찾아주는 북두칠성이 작은 '쩜' 일지라도,
서로의 아픔을 드러내며, 서로를 위해 두려움을 깨고 발을 내딛는
두 사람의 찬란한 용기에 관한 이야기.`,
      // 영화 정보 크레딧
      credits: [
        { key: "연출, 촬영, 목소리", value: "김한" },
        { key: "출연", value: "허지은, 김한, 박희찬" },
        { key: "장소", value: "익산교도소세트장, 망원한강공원, 리움미술관" }
      ],
      // 메인 영상 1개
      video: {
        label: "북두칠성이 쩜이라도 본편",
        youtubeId: "IjSSFUYw4IE"
      }
    },

    // 약속의 길
    promise: {
      title: "약속의 길",
      subtitle: "2025. 10. 02 ~ 06 / Sarria - Santiago de Compostela (117km)",
      description: "같은 곳을 바라보며 걸어갈 앞날을 위해, \n미리 다녀온 신혼여행이자 우리만의 작은 순례.",
      // 이미지 5번 본문
      essay: `신혼여행에 대한 상상을 나눌 때면,
파울로 코엘료의 소설 《연금술사》를 통해 알게 된
스페인의 산티아고 순례길 이야기를 꺼내던 한.
실행력이 강한 지은은 그 때부터 차곡차곡 정보를 모으기 시작합니다.

그렇게 함께 떠나게 된 산티아고 순례길은
미리 다녀온 신혼여행이자 우리만의 작은 순례였습니다.

5일 동안 117km의 길을 나란히 걷는 동안
두 사람은 매일 아침 하나의 질문으로 하루를 시작했고,
종일 길을 걸으며 찾은 대답을 나누며 그 날의 걸음을 끝맺었습니다.`,
      // 각 질문별 상세 정보 (버튼 텍스트, 질문, 사진들, 답변)
      questionItems: [
        {
          id: 1,
          buttonText: "첫 번째 질문 : 죽기 전, 한 번쯤 꼭 해보고 싶은 것은?",
          question: "하루를 함께 걸어낸 후 나눈 질문의 대답들",
          images: [
            { src: "images/1.jpg", caption: "" },
            { src: "images/2.jpg", caption: "" },
            { src: "images/3.jpg", caption: "" },
            { src: "images/4.jpg", caption: "" },
            { src: "images/5.jpg", caption: "" },
            { src: "images/6.jpg", caption: "" },
            { src: "images/7.jpg", caption: "" },
            { src: "images/8.jpg", caption: "" },
            { src: "images/9.jpg", caption: "" },
            { src: "images/10.jpg", caption: "" },
            { src: "images/11.jpg", caption: "" },
            { src: "images/12.jpg", caption: "" },
            { src: "images/13.jpg", caption: "" },
            { src: "images/14.jpg", caption: "" },
            { src: "images/15.jpg", caption: "" },
            { src: "images/16.jpg", caption: "" },
            { src: "images/17.jpg", caption: "" },
            { src: "images/18.jpg", caption: "" },
            { src: "images/19.jpg", caption: "" },
            { src: "images/20.jpg", caption: "" },
            { src: "images/21.jpg", caption: "" },
            { src: "images/22.jpg", caption: "" },
            { src: "images/23.jpg", caption: "" },
            { src: "images/24.jpg", caption: "" },
            { src: "images/25.jpg", caption: "" },
            { src: "images/26.jpg", caption: "" },
            { src: "images/27.jpg", caption: "" },
            { src: "images/28.jpg", caption: "" },
            { src: "images/29.jpg", caption: "" }
          ],
          answer: "지은 : 누군가에게는 도움 or 위로가 될 좋은 작품을 만드는 것! \n한 : 내가 평소 무섭다고 생각하는 걸 하고싶다. 용감하게 죽고싶다."
        },
        {
          id: 2,
          buttonText: "두 번째 질문 : 네가 좋아하는 것들은?",
          question: "하루를 함께 걸어낸 후 나눈 질문의 대답들",
          images: [
            { src: "images/q2/1.jpg", caption: "" },
            { src: "images/q2/2.jpg", caption: "" },
            { src: "images/q2/3.jpg", caption: "" },
            { src: "images/q2/4.jpg", caption: "" },
            { src: "images/q2/5.jpg", caption: "" },
            { src: "images/q2/6.jpg", caption: "" },
            { src: "images/q2/7.jpg", caption: "" },
            { src: "images/q2/8.jpg", caption: "" },
            { src: "images/q2/9.jpg", caption: "" },
            { src: "images/q2/10.jpg", caption: "" },
            { src: "images/q2/11.jpg", caption: "" },
            { src: "images/q2/12.jpg", caption: "" },
            { src: "images/q2/13.jpg", caption: "" },
            { src: "images/q2/15.jpg", caption: "" }
          ],
          answer: "지은 : 파란하늘, 하얀구름, 초록나무, 따뜻한 햇빛, 뽀숑이, 카페에서 책 읽고 글쓰기.\n한 : 복잡할 땐 단순한 일의 반복, 무의미하다고 하는 행동을 가치있게 해보기."
        },
        {
          id: 3,
          buttonText: "세 번째 질문 : 앞으로의 서로에게 바라는 점은?",
          question: "하루를 함께 걸어낸 후 나눈 질문의 대답들",
          images: [
            { src: "images/q3/1.jpg", caption: "" },
            { src: "images/q3/2.jpg", caption: "" },
            { src: "images/q3/3.jpg", caption: "" },
            { src: "images/q3/4.jpg", caption: "" },
            { src: "images/q3/5.jpg", caption: "" },
            { src: "images/q3/6.jpg", caption: "" },
            { src: "images/q3/7.jpg", caption: "" },
            { src: "images/q3/8.jpg", caption: "" },
            { src: "images/q3/9.jpg", caption: "" },
            { src: "images/q3/10.jpg", caption: "" },
            { src: "images/q3/11.jpg", caption: "" },
            { src: "images/q3/12.jpg", caption: "" },
            { src: "images/q3/13.jpg", caption: "" },
            { src: "images/q3/15.jpg", caption: "" },
            { src: "images/q3/16.jpg", caption: "" },
            { src: "images/q3/17.jpg", caption: "" },
            { src: "images/q3/18.jpg", caption: "" },
            { src: "images/q3/19.jpg", caption: "" }
          ],
          answer: "지은 : 오늘처럼 내가 무서울 때 내 손 꼭 잡아줘!.\n한 : 모험심을 잃지 않기."
        },
        {
          id: 4,
          buttonText: "네 번째 질문 : 너의 꿈은?",
          question: "하루를 함께 걸어낸 후 나눈 질문의 대답들",
          images: [
            { src: "images/q4/1.jpg", caption: "" },
            { src: "images/q4/2.jpg", caption: "" },
            { src: "images/q4/3.jpg", caption: "" },
            { src: "images/q4/4.jpg", caption: "" },
            { src: "images/q4/5.jpg", caption: "" },
            { src: "images/q4/6.jpg", caption: "" },
            { src: "images/q4/7.jpg", caption: "" },
            { src: "images/q4/8.jpg", caption: "" },
            { src: "images/q4/9.jpg", caption: "" },
            { src: "images/q4/10.jpg", caption: "" },
            { src: "images/q4/11.jpg", caption: "" },
            { src: "images/q4/12.jpg", caption: "" },
            { src: "images/q4/13.jpg", caption: "" },
            { src: "images/q4/14.jpg", caption: "" },
            { src: "images/q4/15.jpg", caption: "" },
            { src: "images/q4/16.jpg", caption: "" },
            { src: "images/q4/17.jpg", caption: "" },
            { src: "images/q4/18.jpg", caption: "" },
            { src: "images/q4/19.jpg", caption: "" },
            { src: "images/q4/20.jpg", caption: "" },
            { src: "images/q4/21.jpg", caption: "" },
            { src: "images/q4/22.jpg", caption: "" },
            { src: "images/q4/23.jpg", caption: "" },
            { src: "images/q4/24.jpg", caption: "" },
            { src: "images/q4/25.jpg", caption: "" },
            { src: "images/q4/26.jpg", caption: "" }
          ],
          answer: "지은 : 망원동 건물주, 공연장도 하고, 책방도 하고, 무용실도 하고, 옥상정원도 해야징.\n한 : 즐거운 일을 하면서 사는것에서 즐거움을 잃지 않는 것으로."
        },
        {
          id: 5,
          buttonText: "다섯 번째 질문 : _________",
          question: "다섯 번째, ______________________________",
          images: [
            { src: "images/q5/1.jpg", caption: "" },
            { src: "images/q5/2.jpg", caption: "" },
            { src: "images/q5/3.jpg", caption: "" },
            { src: "images/q5/4.jpg", caption: "" },
            { src: "images/q5/5.jpg", caption: "" },
            { src: "images/q5/6.jpg", caption: "" },
            { src: "images/q5/7.jpg", caption: "" },
            { src: "images/q5/8.jpg", caption: "" },
            { src: "images/q5/9.jpg", caption: "" },
            { src: "images/q5/11.jpg", caption: "" },
            { src: "images/q5/12.jpg", caption: "" },
            { src: "images/q5/13.jpg", caption: "" },
            { src: "images/q5/14.jpg", caption: "" },
            { src: "images/q5/15.jpg", caption: "" },
            { src: "images/q5/16.jpg", caption: "" },
            { src: "images/q5/17.jpg", caption: "" },
            { src: "images/q5/18.jpg", caption: "" },
            { src: "images/q5/19.jpg", caption: "" },
            { src: "images/q5/20.jpg", caption: "" },
            { src: "images/q5/21.jpg", caption: "" },
            { src: "images/q5/22.jpg", caption: "" },
            { src: "images/q5/23.jpg", caption: "" }
          ],
          answer: "" // 방명록 연결용 (안내문구 및 방명록 이동은 스크립트에서 자동 처리)
        }
      ],
      // 방명록 연결용 질문 작성 프롬프트
      lastPrompt: "이제 부부가 되어 먼 길을 나설 두 사람을 위해, 매일 아침 함께 나누면 좋을 마지막 다섯 번째 질문들을 남겨주세요!",
      // 영상 1개
      video: {
        label: "산티아고 순례 기록 영상",
        youtubeId: "FcYxuEA8dvk"
      }
    },

    // Room 5: 방명록
    guestbook: {
      title: "4. 다섯 번째 질문",
      description: "두 사람을 위한 마지막 다섯 번째 질문과 따뜻한 축하의 메시지를 적어주세요."
    },

    // Room 6: 축사
    congrats: {
      title: "축사",
      description: "양가 부모님들의 따뜻한 축하의 말씀입니다.",
      images: [
        { src: "images/축사1.jpg", caption: "축사 서신 1" },
        { src: "images/축사2.jpg", caption: "축사 서신 2" },
        { src: "images/축사3.jpg", caption: "축사 서신 3" }
      ]
    },

    // Room 7: 안내 & 마음 전하실 곳
    info: {
      title: "6. 신랑 신부 연락하기",
      description: "",
      contacts: [
        { role: "신랑", name: "김 한", instagram: "https://www.instagram.com/kimhan0912/", image: "images/han_face.jpg" },
        { role: "신부", name: "허지은", instagram: "lavender_heo_", image: "images/jieun_face.jpg" }
      ],
      videos: [
        {
          label: "신랑 영상",
          youtubeId: "lStYGj0tBjQ"
        },
        {
          label: "신부 영상",
          youtubeId: "5PJx1C2xrCk"
        }
      ]
    },

    // Room 8: 오프라인 전시 모습
    offline: {
      title: "오프라인 전시 모습",
      subtitle: "2026.06.05 - 2026.06.08",
      description: "망원한강공원 뉴케이스",
      images: [
        { src: "images/offline/1.jpg", caption: "" },
        { src: "images/offline/2.jpg", caption: "" },
        { src: "images/offline/3.jpg", caption: "" },
        { src: "images/offline/4.jpg", caption: "" },
        { src: "images/offline/5.jpg", caption: "" },
        { src: "images/offline/6.jpg", caption: "" },
        { src: "images/offline/7.jpg", caption: "" },
        { src: "images/offline/8.jpg", caption: "" },
        { src: "images/offline/9.jpg", caption: "" },
        { src: "images/offline/10.jpg", caption: "" },
        { src: "images/offline/11.jpg", caption: "" },
        { src: "images/offline/12.jpg", caption: "" },
        { src: "images/offline/13.jpg", caption: "" },
        { src: "images/offline/14.jpg", caption: "" },
        { src: "images/offline/15.jpg", caption: "" },
        { src: "images/offline/16.jpg", caption: "" },
        { src: "images/offline/17.jpg", caption: "" },
        { src: "images/offline/18.jpg", caption: "" },
        { src: "images/offline/19.jpg", caption: "" },
        { src: "images/offline/20.jpg", caption: "" },
        { src: "images/offline/21.jpg", caption: "" },
        { src: "images/offline/22.jpg", caption: "" },
        { src: "images/offline/23.jpg", caption: "" },
        { src: "images/offline/24.jpg", caption: "" },
        { src: "images/offline/25.jpg", caption: "" },
        { src: "images/offline/26.jpg", caption: "" },
        { src: "images/offline/27.jpg", caption: "" },
        { src: "images/offline/28.jpg", caption: "" }
      ]
    }
  }
};

// 브라우저 및 Node 환경 지원을 위한 내보내기 설정
if (typeof module !== 'undefined' && module.exports) {
  module.exports = weddingConfig;
}

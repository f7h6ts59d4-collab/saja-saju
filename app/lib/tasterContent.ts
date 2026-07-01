/**
 * 맛보기 해석 콘텐츠 — 저승사자(Grim Reaper) 톤. (app/lib/tasterContent.ts)
 *
 * 구조: 일간(DAY_MASTERS) 10개 + 오행 결핍(DEFICIENCIES) 5개 + 균형(BALANCE) 1개.
 * 사용자 명식의 dayMaster.hangul로 일간 문구를, elements에서 없는 오행으로 결핍 문구를
 * 골라 "일간(정체성) → 결핍(약점)" 순으로 조립한다. 50가지 조합이 15개 부품에서 나온다.
 *
 * 톤: 담백한 반말, 시크·차분, 위협적이지 않은 서늘한 권위. 건조한 유머 한 스푼.
 * body=한국어(톤 기준), bodyEn=영어(실제 노출). 변동비 0(LLM 없음, 규칙 조립).
 *
 * 표기: 영어 노출(bodyEn)에는 한자를 쓰지 않는다 — 미국 타깃에 "한국 사주" 정체성을
 * 분명히 하려고 한글 + 한국어 로마자(Gapmok 등) + 영어 칭호만 쓴다. hanja는 참고용 필드.
 *
 * 엔딩 리듬을 일부러 흩었다(반전/단언/여운/관조/장면) — 여러 일간을 나란히 노출해도
 * "템플릿 공식"이 들키지 않도록. em-dash도 절반 이하로 제한.
 *
 * 없는 오행이 여럿이면 DEFICIENCY_PRIORITY 순서로 하나만 짚는다(일관성).
 * 없는 오행이 없으면 BALANCE를 쓴다.
 *
 * TODO(후크 일러스트 단계): AI 웹툰/3D 렌더 + 말풍선이 생기면 그 비주얼에 맞춰
 *   일간·결핍 콘텐츠를 확장/세분 검토(지금은 단순 구조 유지).
 */

export interface TasterPiece {
  body: string;
  bodyEn: string;
}

export interface DayMasterPiece extends TasterPiece {
  element: string;       // 오행 (한글)
  yinYang: '양' | '음';
  romanization: string;  // 한국어 로마자, 예: 'Gapmok'
  hanja: string;         // 참고용(영어 노출에는 쓰지 않음)
  title: string;         // 한국어 칭호
  titleEn: string;       // 영어 칭호
}

export const DAY_MASTERS: Record<string, DayMasterPiece> = {
  갑: {
    element: '목', yinYang: '양', romanization: 'Gapmok', hanja: '甲木',
    title: '아름드리 나무', titleEn: 'The Great Tree',
    // 엔딩: 반전
    body: '너는 갑목(甲木). 하늘로 곧게 뻗는 큰 나무야.\n\n한번 자리를 잡으면 쉽게 흔들리지 않지. 남들이 굽을 때 너는 위로만 자란다. 그 곧음이 너를 높이 세우고 — 가끔, 부러지게도 하고.',
    bodyEn: 'You are 갑목 (Gapmok) — The Great Tree, growing straight for the sky.\n\nOnce you take root, you do not move easily. Where others bend, you only climb. That straightness raises you high — and now and then, it breaks you.',
  },
  을: {
    element: '목', yinYang: '음', romanization: 'Eulmok', hanja: '乙木',
    title: '덩굴', titleEn: 'The Vine',
    // 엔딩: 단언
    body: '너는 을목(乙木). 바위 틈에서도 기어이 사는 덩굴이야.\n\n부드러워 보이지만 끈질기지. 꺾이는 대신 휘고, 막히면 돌아간다. 누구도 너를 쉽게 뽑지 못해. 살아남는 법을 아는 자는 원래 그런 거야.',
    bodyEn: 'You are 을목 (Eulmok) — The Vine that lives even in a crack of stone.\n\nYou look soft, but you are relentless. You bend instead of breaking, and go around what blocks you. No one uproots you easily. Survivors never are.',
  },
  병: {
    element: '화', yinYang: '양', romanization: 'Byeonghwa', hanja: '丙火',
    title: '한낮의 태양', titleEn: 'The Sun at Midday',
    // 엔딩: 반전
    body: '너는 병화(丙火). 한낮의 태양이야.\n\n숨기려 해도 안 돼. 네가 들어서면 방 안의 그림자가 자리를 옮기지. 사람들은 네 빛을 따라와 — 그게 얼마나 뜨거운지는 너만 알고.',
    bodyEn: 'You are 병화 (Byeonghwa) — The Sun at Midday.\n\nYou couldn’t hide if you tried. You walk in, and the shadows in the room rearrange themselves. People follow your light — only you know how much it burns.',
  },
  정: {
    element: '화', yinYang: '음', romanization: 'Jeonghwa', hanja: '丁火',
    title: '밤의 등불', titleEn: 'The Lamp in the Dark',
    // 엔딩: 장면
    body: '너는 정화(丁火). 어둠 속의 등불이야.\n\n태양처럼 사방을 밝히진 않아. 대신 꼭 필요한 한 사람 곁에서 타지. 지금 이 순간에도, 누군가는 네 불빛 하나를 찾아 어둠을 걸어오고 있어.',
    bodyEn: 'You are 정화 (Jeonghwa) — The Lamp in the Dark.\n\nYou do not flood the world with light like the sun. You burn beside the one who needs you. Even now, someone is walking through the dark, looking for that single flame of yours.',
  },
  무: {
    element: '토', yinYang: '양', romanization: 'Muto', hanja: '戊土',
    title: '큰 산', titleEn: 'The Mountain',
    // 엔딩: 단언
    body: '너는 무토(戊土). 움직이지 않는 큰 산이야.\n\n세상이 시끄러워도 너는 거기 그대로 있지. 사람들이 너에게 기대는 건 그래서야. 무겁고, 느리고, 믿음직해. 산을 서두르게 할 수 있는 건 아무것도 없어.',
    bodyEn: 'You are 무토 (Muto) — The Mountain that does not move.\n\nThe world can roar, and you stay exactly where you are. That is why people lean on you. Heavy, slow, certain. Nothing rushes a mountain.',
  },
  기: {
    element: '토', yinYang: '음', romanization: 'Gito', hanja: '己土',
    title: '기름진 땅', titleEn: 'The Fertile Field',
    // 엔딩: 여운(질문)
    body: '너는 기토(己土). 무엇이든 길러내는 기름진 땅이야.\n\n산처럼 우뚝하진 않아도, 네 위에서 모든 게 자라지. 너는 품는 자야. 사람들은 네 곁에서 비로소 뿌리를 내려. 정작 너를 길러주는 건 누구일까.',
    bodyEn: 'You are 기토 (Gito) — The Fertile Field where everything grows.\n\nYou do not tower like the mountain, yet everything takes root on you. You are the one who holds. People finally settle beside you. But who, I wonder, ever tends to you.',
  },
  경: {
    element: '금', yinYang: '양', romanization: 'Gyeonggeum', hanja: '庚金',
    title: '벼려지지 않은 무쇠', titleEn: 'The Raw Iron',
    // 엔딩: 단언
    body: '너는 경금(庚金). 아직 벼려지지 않은 무쇠야.\n\n거칠고, 단단하고, 곧이곧대로지. 둘러 말하는 법을 몰라. 그 무딘 정직함에 누구는 베이고 누구는 기대더라. 무쇠란 본디 그렇게 양쪽으로 쓰이는 거고.',
    bodyEn: 'You are 경금 (Gyeonggeum) — Raw Iron, not yet forged.\n\nRough, hard, blunt. You never learned to soften your words. Some are cut by that dull honesty, and some lean on it. Iron was always meant to be used both ways.',
  },
  신: {
    element: '금', yinYang: '음', romanization: 'Singeum', hanja: '辛金',
    title: '날 선 칼', titleEn: 'The Honed Blade',
    // 엔딩: 반전
    body: '너는 신금(辛金). 갈고 갈아 날을 세운 칼이자 보석이야.\n\n예리하고, 아름답고, 쉽게 닿을 수 없지. 사람들은 네 빛에 끌리지만 — 가까이서 베이는 것도 늘 그들이야.',
    bodyEn: 'You are 신금 (Singeum) — The Honed Blade, a jewel cut fine.\n\nKeen, beautiful, hard to reach. People are drawn to your shine — yet they are the ones who get cut up close.',
  },
  임: {
    element: '수', yinYang: '양', romanization: 'Imsu', hanja: '壬水',
    title: '바다', titleEn: 'The Ocean',
    // 엔딩: 여운(질문)
    body: '너는 임수(壬水). 끝을 알 수 없는 바다야.\n\n잔잔할 땐 한없이 넓고, 뒤집힐 땐 아무도 못 막지. 사람들은 네 깊이를 다 보지 못해. 너는, 네 바닥을 본 적이 있나.',
    bodyEn: 'You are 임수 (Imsu) — The Ocean with no visible end.\n\nCalm, you are endlessly wide. Turning, no one holds you back. People never see all of your depth. And you — have you ever seen your own floor?',
  },
  계: {
    element: '수', yinYang: '음', romanization: 'Gyesu', hanja: '癸水',
    title: '이슬과 시냇물', titleEn: 'The Dew and Stream',
    // 엔딩: 단언(조용한 힘)
    body: '너는 계수(癸水). 새벽 이슬이고 가느다란 시냇물이야.\n\n조용히, 낮은 곳으로 스미지. 요란하지 않아도 닿지 않는 데가 없어. 바위를 가르는 건 큰 물이 아니야. 멈추지 않는 한 방울이지.',
    bodyEn: 'You are 계수 (Gyesu) — The Dew and the Thin Stream.\n\nQuietly, you seep toward the low places. Without a sound, there is nowhere you do not reach. It is not the flood that splits the rock. It is the one drop that never stops.',
  },
};

export const DEFICIENCIES: Record<string, TasterPiece> = {
  목: {
    body: '그런데 — 네겐 나무(木)가 없어.\n\n뻗어 나갈 줄을, 자라날 줄을 잊은 사주야. 시작하는 힘이 약하지. 오래 봐왔지만, 나무 없는 자는 늘 같은 자리를 맴돌더라. ……뭐, 그 얘긴 네가 직접 듣는 게 낫겠어.',
    bodyEn: 'But you have no Wood.\n\nYou forgot how to reach out, how to grow. The force that begins things runs thin in you. I’ve watched a long time — the ones without Wood circle the same spot. ...Though you’d rather hear that part yourself.',
  },
  화: {
    body: '그런데 — 네겐 불(火)이 없어.\n\n타오를 줄을 모르는 사주야. 속은 깊은데, 좀처럼 드러내질 않지. 오래 봐왔지만, 불 없는 자는 제 온기를 늘 남에게 들키지 못하더라. ……그 얘긴 네가 직접 듣는 게 낫겠어.',
    bodyEn: 'But you have no Fire.\n\nYou never learned to blaze. There is depth in you, but you rarely let it show. I’ve watched a long time — the ones without Fire keep their own warmth hidden from everyone. ...Though you’d rather hear that part yourself.',
  },
  토: {
    body: '그런데 — 네겐 흙(土)이 없어.\n\n발 디딜 땅이 없는 사주야. 늘 어딘가로 흐르고, 좀처럼 머물지 못하지. 오래 봐왔지만, 흙 없는 자는 뿌리내릴 자리를 늘 찾아 헤매더라. ……그 얘긴 네가 직접 듣는 게 낫겠어.',
    bodyEn: 'But you have no Earth.\n\nThere is no ground beneath your feet. You are always drifting somewhere, rarely able to stay. I’ve watched a long time — the ones without Earth keep searching for a place to root. ...Though you’d rather hear that part yourself.',
  },
  금: {
    body: '그런데 — 네겐 쇠(金)가 없어.\n\n끊어낼 줄을 모르는 사주야. 무르고, 정에 약하지. 오래 봐왔지만, 쇠 없는 자는 놓아야 할 걸 늘 끝까지 쥐고 있더라. ……그 얘긴 네가 직접 듣는 게 낫겠어.',
    bodyEn: 'But you have no Metal.\n\nYou never learned to cut things off. Soft, undone by attachment. I’ve watched a long time — the ones without Metal keep holding the very thing they should release. ...Though you’d rather hear that part yourself.',
  },
  수: {
    // 수정: '불' 전제 제거. 물의 보편 상징(융통·굽힘·돌아감)으로 — 어떤 일간에도 성립.
    body: '그런데 — 네겐 물(水)이 없어. 한 방울도.\n\n굽힐 줄을, 돌아갈 줄을 모르는 사주야. 한번 정한 길로만 가지. 오래 봐왔지만, 물 없는 자는 늘 부딪히고 나서야 다른 길이 있었다는 걸 알더라. ……그 얘긴 네가 직접 듣는 게 낫겠어.',
    bodyEn: 'But you have no Water. Not a drop.\n\nYou never learned to bend, or to take the way around. You hold to the one road you’ve chosen. I’ve watched a long time — the ones without Water only see the other path after they’ve hit the wall. ...Though you’d rather hear that part yourself.',
  },
};

/** 없는 오행이 여럿일 때 하나만 짚는 우선순위(극적인 결핍 우선). 일관성 위해 고정. */
export const DEFICIENCY_PRIORITY: string[] = ['수', '화', '목', '금', '토'];

/** 결핍이 없는 균형 사주(약 15%)용. */
export const BALANCE: TasterPiece = {
  body: '그런데 — 네 사주엔 빠진 게 없어.\n\n다섯 기운이 고루 흐르는, 드문 균형이야. 어디 한쪽으로도 기울지 않지. 오래 봐왔지만 이런 사주는 흔치 않아. 복인지 짐인지는, 살아 봐야 아는 거고.',
  bodyEn: 'But your chart is missing nothing.\n\nAll five forces flow evenly through you — a rare balance. You tilt to no single side. I’ve watched a long time, and this is uncommon. Whether it is a blessing or a burden, only the living find out.',
};

/** 갈증(결제 유도) — 공통. 관심 항목만 노출하고 본문은 잠근다. */
export const TEASER: TasterPiece = {
  body: '네 명부엔 아직 안 펼친 장이 남았어.\n\n사랑 — 네가 누구에게 타오르고, 누구 앞에서 꺼지는지.\n일 — 네 불꽃이 어디서 빛이 되고, 어디서 재가 되는지.\n\n볼래. 너의 나머지를.',
  bodyEn: 'There are pages in your ledger I haven’t turned.\n\nLove — who you burn for, and who puts you out.\nWork — where your fire becomes light, and where it becomes ash.\n\nWant to see the rest of you?',
};
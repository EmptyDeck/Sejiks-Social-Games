const vocabList = [
  {
    "word": "abash",
    "definition": "[낮추다] 무안하게 하다, 당황케 하다"
  },
  {
    "word": "abate",
    "definition": "[떨어뜨리다] 줄이다, 약화시키다"
  },
  {
    "word": "abet",
    "definition": "[부추기다] 종용하다, 부추기다"
  },
  {
    "word": "abeyance",
    "definition": "[멈추다] 정지, 중단, 보류"
  },
  {
    "word": "abhorrence",
    "definition": "[떨다] 혐오, 싫음"
  },
  {
    "word": "abhorrent",
    "definition": "[떨다] 혐오스러운, 불쾌한"
  },
  {
    "word": "abhorrer",
    "definition": "[떨다] 혐오하는 사람"
  },
  {
    "word": "abject",
    "definition": "[내던지다] 비참한, 비굴한"
  },
  {
    "word": "abjure",
    "definition": "[맹세 버리다] 포기하다, 철회하다"
  },
  {
    "word": "renounce",
    "definition": "[맹세 버리다] 포기하다, 철회하다"
  },
  {
    "word": "abjure",
    "definition": "[맹세 버리다] 부인하다, 버리다"
  },
  {
    "word": "repudiate",
    "definition": "[맹세 버리다] 부인하다, 버리다"
  },
  {
    "word": "abnegate",
    "definition": "[거절하다] 포기하다, 금욕하다"
  },
  {
    "word": "abominate",
    "definition": "[불길하다] 몹시 싫어하다, 혐오하다"
  },
  {
    "word": "abound",
    "definition": "[넘치다] 풍부하다, 넘쳐흐르다"
  },
  {
    "word": "proliferate",
    "definition": "[넘치다] 풍부하다, 넘쳐흐르다"
  },
  {
    "word": "absolve",
    "definition": "[풀다] 책임을 면하다, 용서하다"
  },
  {
    "word": "exonerate",
    "definition": "[풀다] 책임을 면하다, 용서하다"
  },
  {
    "word": "abstemious",
    "definition": "[절제하다] 절제하는, 금욕적인"
  },
  {
    "word": "austere",
    "definition": "[절제하다] 절제하는, 금욕적인"
  },
  {
    "word": "abstracted",
    "definition": "[떼어내다] 정신이 딴 데 있는, 분리된"
  },
  {
    "word": "divorced",
    "definition": "[떼어내다] 정신이 딴 데 있는, 분리된"
  },
  {
    "word": "abstruse",
    "definition": "[밀어넣다] 난해한, 어려운"
  },
  {
    "word": "esoteric",
    "definition": "[밀어넣다] 난해한, 어려운"
  },
  {
    "word": "abuse",
    "definition": "[나쁘게 쓰다] 남용하다, 학대하다"
  },
  {
    "word": "misuse",
    "definition": "[나쁘게 쓰다] 남용하다, 학대하다"
  },
  {
    "word": "abysmal",
    "definition": "[끝없다] 최악의, 지독한, 심연의"
  },
  {
    "word": "accede",
    "definition": "[따르다] 동의하다, 응하다, 승낙하다"
  },
  {
    "word": "accentuate",
    "definition": "[강조하다] 두드러지게 하다"
  },
  {
    "word": "highlight",
    "definition": "[강조하다] 두드러지게 하다"
  },
  {
    "word": "accession",
    "definition": "[다가가다] 취임, 동의, 접근"
  },
  {
    "word": "acquiescence",
    "definition": "[다가가다] 취임, 동의, 접근"
  },
  {
    "word": "accolade",
    "definition": "[목에 걸다] 칭찬, 포상, 영예"
  },
  {
    "word": "accord",
    "definition": "[마음 맞추다] 일치, 조화"
  },
  {
    "word": "consensus",
    "definition": "[마음 맞추다] 일치, 조화"
  },
  {
    "word": "accretion",
    "definition": "[자라다] 축적, 증가"
  },
  {
    "word": "accrue",
    "definition": "[모이다] 쌓이다, 발생하다"
  },
  {
    "word": "acerbic",
    "definition": "[날카롭다] 신랄한, 과격한"
  },
  {
    "word": "mordant",
    "definition": "[날카롭다] 신랄한, 과격한"
  },
  {
    "word": "achieve",
    "definition": "[끝내다] 달성하다, 성취하다"
  },
  {
    "word": "realize",
    "definition": "[끝내다] 달성하다, 성취하다"
  },
  {
    "word": "acknowledge",
    "definition": "[알다] 인정하다, 감사하다"
  },
  {
    "word": "acknowledge",
    "definition": "[알아보다] 승인하다, 시인하다"
  },
  {
    "word": "recognize",
    "definition": "[알아보다] 승인하다, 시인하다"
  },
  {
    "word": "acquiescent",
    "definition": "[가만히 있다] 묵인하는, 순순히 따르는"
  },
  {
    "word": "acquisition",
    "definition": "[얻다] 습득, 획득"
  },
  {
    "word": "acquisitive",
    "definition": "[얻으려 하다] 탐욕스러운"
  },
  {
    "word": "acrimonious",
    "definition": "[날카롭다] 험악한, 신랄한"
  },
  {
    "word": "acrimony",
    "definition": "[쏘다] 통렬함, 악다구니"
  },
  {
    "word": "bitterness",
    "definition": "[쏘다] 통렬함, 악다구니"
  },
  {
    "word": "acumen",
    "definition": "[날카롭다] 통찰력, 감각"
  },
  {
    "word": "acute",
    "definition": "[날카롭다] 예리한, 극심한"
  },
  {
    "word": "severe",
    "definition": "[날카롭다] 예리한, 극심한"
  },
  {
    "word": "ad hoc",
    "definition": "[특별하다] 임시의, 특별한 목적"
  },
  {
    "word": "adamant",
    "definition": "[굳세다] 단호한, 완강한"
  },
  {
    "word": "adaptability",
    "definition": "[맞추다] 적응성, 융통성"
  },
  {
    "word": "flexibility",
    "definition": "[맞추다] 적응성, 융통성"
  },
  {
    "word": "adduce",
    "definition": "[이끌다] 제시하다, 인용하다"
  },
  {
    "word": "adept",
    "definition": "[얻다] 숙련된, 능숙한"
  },
  {
    "word": "adopt",
    "definition": "[취하다] 채택하다, 입양하다"
  },
  {
    "word": "adroit",
    "definition": "[손재주] 능숙한"
  },
  {
    "word": "dexterous",
    "definition": "[손재주] 능숙한"
  },
  {
    "word": "adulterate",
    "definition": "[섞다] 불순하게 하다, 섞다"
  },
  {
    "word": "adversarial",
    "definition": "[맞서다] 적대적인, 대립적인"
  },
  {
    "word": "antagonistic",
    "definition": "[맞서다] 적대적인, 대립적인"
  },
  {
    "word": "aesthetic",
    "definition": "[느끼다] 미적인, 예술적인"
  },
  {
    "word": "affable",
    "definition": "[말하다] 상냥한, 붙임성 있는"
  },
  {
    "word": "easygoing",
    "definition": "[말하다] 상냥한, 붙임성 있는"
  },
  {
    "word": "affable",
    "definition": "[말하다] 다정한, 친절한"
  },
  {
    "word": "cordial",
    "definition": "[말하다] 다정한, 친절한"
  },
  {
    "word": "affected",
    "definition": "[만들다] 꾸민, 가장된"
  },
  {
    "word": "affiliated",
    "definition": "[가족/연결] 제휴된, 연관 있는"
  },
  {
    "word": "kindred",
    "definition": "[가족/연결] 제휴된, 연관 있는"
  },
  {
    "word": "affinity",
    "definition": "[가까움] 친밀감, 유사성"
  },
  {
    "word": "affluent",
    "definition": "[흐르다] 풍부한, 부유한"
  },
  {
    "word": "abundant",
    "definition": "[흐르다] 풍부한, 부유한"
  },
  {
    "word": "aggrandize",
    "definition": "[크게 하다] 확대하다, 강화하다"
  },
  {
    "word": "agile",
    "definition": "[빠르다] 민첩한, 재빠른"
  },
  {
    "word": "nimble",
    "definition": "[빠르다] 민첩한, 재빠른"
  },
  {
    "word": "airtight",
    "definition": "[닫다] 밀폐된, 빈틈없는"
  },
  {
    "word": "alacrity",
    "definition": "[기꺼이] 민첩함, 선뜻 나서기"
  },
  {
    "word": "alarm",
    "definition": "[놀라게 하다] 불안, 두려움"
  },
  {
    "word": "unsettle",
    "definition": "[놀라게 하다] 불안, 두려움"
  },
  {
    "word": "albeit",
    "definition": "[비록] ~이긴 하지만"
  },
  {
    "word": "allegiance",
    "definition": "[충성] 충성, 충실"
  },
  {
    "word": "allegorical",
    "definition": "[상징] 비유적인, 우화적인"
  },
  {
    "word": "alleviate",
    "definition": "[가볍게 하다] 완화하다, 줄이다"
  },
  {
    "word": "alleviate",
    "definition": "[가볍게 하다] 덜다, 경감하다"
  },
  {
    "word": "mitigate",
    "definition": "[가볍게 하다] 덜다, 경감하다"
  },
  {
    "word": "allure",
    "definition": "[이끌다] 매혹하다, 유혹하다"
  },
  {
    "word": "allusive",
    "definition": "[암시하다] 암시적인, 간접적인"
  },
  {
    "word": "aloof",
    "definition": "[떨어지다] 냉담한, 무관심한"
  },
  {
    "word": "alter",
    "definition": "[바꾸다] 바꾸다, 변경하다"
  },
  {
    "word": "modify",
    "definition": "[바꾸다] 바꾸다, 변경하다"
  },
  {
    "word": "altruism",
    "definition": "[남] 이타심, 이타적 행위"
  },
  {
    "word": "beneficence",
    "definition": "[남] 이타심, 이타적 행위"
  },
  {
    "word": "altruistic",
    "definition": "[남] 이타적인, 타인을 위한"
  },
  {
    "word": "amalgam",
    "definition": "[섞다] 혼합물, 결합"
  },
  {
    "word": "amalgamate",
    "definition": "[섞다] 합치다, 융합하다"
  },
  {
    "word": "ambient",
    "definition": "[둘러싸다] 주변의, 환경의"
  },
  {
    "word": "ambiguous",
    "definition": "[두 가지] 모호한, 애매한"
  },
  {
    "word": "equivocal",
    "definition": "[두 가지] 모호한, 애매한"
  },
  {
    "word": "ambivalent",
    "definition": "[양쪽] 상반된 감정, 애증이 엇갈린"
  },
  {
    "word": "ameliorate",
    "definition": "[좋게 하다] 개선하다, 개량하다"
  },
  {
    "word": "amorphous",
    "definition": "[형태 없다] 무정형의, 불분명한"
  },
  {
    "word": "ample",
    "definition": "[넓다] 충분한, 풍부한"
  },
  {
    "word": "amusing",
    "definition": "[즐겁다] 재미있는, 즐거운"
  },
  {
    "word": "anachronistic",
    "definition": "[시간 어긋나다] 시대착오적인"
  },
  {
    "word": "analogous",
    "definition": "[같다] 유사한, 비슷한"
  },
  {
    "word": "anathema",
    "definition": "[저주하다] 아주 싫은 것, 금기"
  },
  {
    "word": "ancillary",
    "definition": "[부차적] 보조의, 부수적인"
  },
  {
    "word": "anecdote",
    "definition": "[이야기] 일화, 짧은 이야기"
  },
  {
    "word": "anemic",
    "definition": "[피 없다] 무기력한, 빈혈의"
  },
  {
    "word": "animadversion",
    "definition": "[비난하다] 비난, 혹평"
  },
  {
    "word": "animate",
    "definition": "[생기 주다] 생기를 불어넣다"
  },
  {
    "word": "animus",
    "definition": "[마음] 적의, 악의"
  },
  {
    "word": "anneal",
    "definition": "[불로 달구다] 강화하다, 담금질하다"
  },
  {
    "word": "annihilate",
    "definition": "[없애다] 전멸시키다, 무효화하다"
  },
  {
    "word": "destroy",
    "definition": "[없애다] 전멸시키다, 무효화하다"
  },
  {
    "word": "annoying",
    "definition": "[성가시다] 짜증나는, 성가신"
  },
  {
    "word": "unwelcome",
    "definition": "[성가시다] 짜증나는, 성가신"
  },
  {
    "word": "annul",
    "definition": "[없애다] 무효로 하다, 취소하다"
  },
  {
    "word": "anodyne",
    "definition": "[위로하다] 진통제, 위안, 무해한 것"
  },
  {
    "word": "anomaly",
    "definition": "[다르다] 변칙, 이례, 특이"
  },
  {
    "word": "aberration",
    "definition": "[다르다] 변칙, 이례, 특이"
  },
  {
    "word": "anonymous",
    "definition": "[이름 없다] 익명의, 무명의"
  },
  {
    "word": "obscure",
    "definition": "[이름 없다] 익명의, 무명의"
  },
  {
    "word": "antagonism",
    "definition": "[대립하다] 적대, 반대"
  },
  {
    "word": "antagonistic",
    "definition": "[맞서다] 적대적인, 대립하는"
  },
  {
    "word": "adversarial",
    "definition": "[맞서다] 적대적인, 대립하는"
  },
  {
    "word": "antecedent",
    "definition": "[앞서다] 선행된 것, 전례"
  },
  {
    "word": "precursor",
    "definition": "[앞서다] 선행된 것, 전례"
  },
  {
    "word": "antecedent to",
    "definition": "[앞서다] ~보다 선행하는"
  },
  {
    "word": "antediluvian",
    "definition": "[아주 옛] 태고의, 구식의"
  },
  {
    "word": "archaic",
    "definition": "[아주 옛] 태고의, 구식의"
  },
  {
    "word": "anthropogenic",
    "definition": "[사람] 인위적인, 인간이 만든"
  },
  {
    "word": "anthropomorphism",
    "definition": "[사람 형태] 의인화, 인격화"
  },
  {
    "word": "anticipate",
    "definition": "[앞보다] 예상하다, 예견하다"
  },
  {
    "word": "prefigure",
    "definition": "[앞보다] 예상하다, 예견하다"
  },
  {
    "word": "antidote",
    "definition": "[해독하다] 해독제, 해결책"
  },
  {
    "word": "antiquity",
    "definition": "[옛] 고대, 고대 유물"
  },
  {
    "word": "antithetical",
    "definition": "[정반대] 정반대의, 대립하는"
  },
  {
    "word": "attenuate",
    "definition": "[얇게 하다] 약화시키다, 줄이다"
  },
  {
    "word": "attest to",
    "definition": "[증명하다] 입증하다, 증언하다"
  },
  {
    "word": "attributed to",
    "definition": "[돌리다] ~의 탓으로 하다, 기인하다"
  },
  {
    "word": "atypical",
    "definition": "[특이하다] 전형적이지 않은, 이례적인"
  },
  {
    "word": "audacious audacity",
    "definition": "[대담하다] 대담한, 뻔뻔한"
  },
  {
    "word": "augment",
    "definition": "[늘리다] 확대하다, 증가시키다"
  },
  {
    "word": "extend",
    "definition": "[늘리다] 확대하다, 증가시키다"
  },
  {
    "word": "august",
    "definition": "[위엄] 위엄 있는, 장엄한"
  },
  {
    "word": "auspicious",
    "definition": "[길조] 길조의, 유리한"
  },
  {
    "word": "propitious",
    "definition": "[길조] 길조의, 유리한"
  },
  {
    "word": "austere",
    "definition": "[검소하다] 엄격한, 절제된, 꾸밈없는"
  },
  {
    "word": "authenticated",
    "definition": "[진짜임] 인증된, 증명된"
  },
  {
    "word": "authoritative",
    "definition": "[권위] 권위 있는, 믿을 만한"
  },
  {
    "word": "definitive",
    "definition": "[권위] 권위 있는, 믿을 만한"
  },
  {
    "word": "autocratic",
    "definition": "[혼자 지배] 독재적인"
  },
  {
    "word": "autumnal",
    "definition": "[가을] 가을의, 늦은 시기의"
  },
  {
    "word": "avant-garde",
    "definition": "[앞서다] 전위적인, 아방가르드"
  },
  {
    "word": "avaricious",
    "definition": "[탐하다] 탐욕스러운"
  },
  {
    "word": "rapacious",
    "definition": "[탐하다] 탐욕스러운"
  },
  {
    "word": "avatar",
    "definition": "[화신] 구현, 상징"
  },
  {
    "word": "aver",
    "definition": "[확언하다] 단언하다"
  },
  {
    "word": "assert",
    "definition": "[확언하다] 단언하다"
  },
  {
    "word": "aversion",
    "definition": "[돌리다] 혐오, 싫음"
  },
  {
    "word": "avert",
    "definition": "[돌리다] 피하다, 막다"
  },
  {
    "word": "forestall",
    "definition": "[돌리다] 피하다, 막다"
  },
  {
    "word": "avian",
    "definition": "[새] 새의, 조류의"
  },
  {
    "word": "avidity",
    "definition": "[갈망] 욕망, 열망"
  },
  {
    "word": "avow",
    "definition": "[말하다] 공언하다, 맹세하다"
  },
  {
    "word": "awkwardness",
    "definition": "[서투르다] 어색함, 서투름"
  },
  {
    "word": "clumsiness",
    "definition": "[서투르다] 어색함, 서투름"
  },
  {
    "word": "awry",
    "definition": "[비뚤다] 삐뚤어진, 잘못된"
  },
  {
    "word": "backbiter",
    "definition": "[뒷말하다] 중상하는 사람, 험담꾼"
  },
  {
    "word": "backwater",
    "definition": "[정체] 벽지, 침체된 곳"
  },
  {
    "word": "balkanize",
    "definition": "[쪼개다] 분열시키다"
  },
  {
    "word": "ballyhoo",
    "definition": "[시끄럽다] 떠들썩한 선전, 과대광고"
  },
  {
    "word": "banal",
    "definition": "[진부하다] 진부한"
  },
  {
    "word": "stale",
    "definition": "[진부하다] 진부한"
  },
  {
    "word": "banish",
    "definition": "[쫓아내다] 추방하다"
  },
  {
    "word": "expel",
    "definition": "[쫓아내다] 추방하다"
  },
  {
    "word": "banter",
    "definition": "[희롱하다] 농담, 익살"
  },
  {
    "word": "raillery",
    "definition": "[희롱하다] 농담, 익살"
  },
  {
    "word": "barren",
    "definition": "[비다] 불모의, 불임의"
  },
  {
    "word": "barring",
    "definition": "[제외하다] ~을 제외하고"
  },
  {
    "word": "baseless",
    "definition": "[근거 없다] 근거 없는"
  },
  {
    "word": "untenable",
    "definition": "[근거 없다] 근거 없는"
  },
  {
    "word": "bedrock",
    "definition": "[기초] 근본, 기반"
  },
  {
    "word": "foundation",
    "definition": "[기초] 근본, 기반"
  },
  {
    "word": "befuddled",
    "definition": "[혼란] 혼란스러운, 어리둥절한"
  },
  {
    "word": "beguile",
    "definition": "[속이다] 속이다, 현혹하다"
  },
  {
    "word": "belle",
    "definition": "[아름다운 여성] 미인"
  },
  {
    "word": "mask",
    "definition": "[아름다운 여성] 미인"
  },
  {
    "word": "belie",
    "definition": "[거짓 나타내다] 속이다, 모순되다"
  },
  {
    "word": "contradict",
    "definition": "[거짓 나타내다] 속이다, 모순되다"
  },
  {
    "word": "belittle",
    "definition": "[작게보다] 얕보다, 경시하다"
  },
  {
    "word": "bellicose",
    "definition": "[싸우다] 호전적인"
  },
  {
    "word": "belligerent",
    "definition": "[싸우다] 교전 중인, 호전적인"
  },
  {
    "word": "pugnacious",
    "definition": "[싸우다] 교전 중인, 호전적인"
  },
  {
    "word": "bemoaned",
    "definition": "[슬퍼하다] 탄식하다, 한탄하다"
  },
  {
    "word": "bemused",
    "definition": "[멍하다] 어리둥절한, 당황한"
  },
  {
    "word": "beneficial",
    "definition": "[이롭다] 유익한, 이로운"
  },
  {
    "word": "benevolence",
    "definition": "[좋아하다] 자비, 선의"
  },
  {
    "word": "benighted",
    "definition": "[어둡다] 무지한, 미개한"
  },
  {
    "word": "berate",
    "definition": "[꾸짖다] 호되게 꾸짖다"
  },
  {
    "word": "bereft of",
    "definition": "[빼앗다] ~이 없는, 상실한"
  },
  {
    "word": "betoken",
    "definition": "[나타내다] ~의 징조이다, 의미하다"
  },
  {
    "word": "betoken",
    "definition": "[알리다] 나타내다, 보여주다"
  },
  {
    "word": "indicate",
    "definition": "[알리다] 나타내다, 보여주다"
  },
  {
    "word": "betoken",
    "definition": "[예시하다] 전조가 되다"
  },
  {
    "word": "portend",
    "definition": "[예시하다] 전조가 되다"
  },
  {
    "word": "betray",
    "definition": "[드러내다] 배신하다, 무심코 드러내다"
  },
  {
    "word": "bland",
    "definition": "[싱겁다] 자극 없는, 김빠진"
  },
  {
    "word": "insipid",
    "definition": "[싱겁다] 자극 없는, 김빠진"
  },
  {
    "word": "blasé",
    "definition": "[흥미 없다] 심드렁한, 무관심한"
  },
  {
    "word": "blatant",
    "definition": "[시끄럽다] 뻔뻔스러운, 노골적인"
  },
  {
    "word": "bleak",
    "definition": "[황량하다] 암울한, 황량한"
  },
  {
    "word": "blemish",
    "definition": "[흠] 흠, 결점, 오점"
  },
  {
    "word": "defect",
    "definition": "[흠] 흠, 결점, 오점"
  },
  {
    "word": "blemish",
    "definition": "[더럽히다] 손상하다, 더럽히다"
  },
  {
    "word": "bludgeon",
    "definition": "[몽둥이] 몽둥이로 치다, 위협하다"
  },
  {
    "word": "bogus",
    "definition": "[가짜] 가짜의, 허위의"
  },
  {
    "word": "bolstering",
    "definition": "[받치다] 지지하다, 강화하다"
  },
  {
    "word": "supporting",
    "definition": "[받치다] 지지하다, 강화하다"
  },
  {
    "word": "boon",
    "definition": "[혜택] 혜택, 이익"
  },
  {
    "word": "benefit",
    "definition": "[혜택] 혜택, 이익"
  },
  {
    "word": "boorish",
    "definition": "[거칠다] 천박한, 무례한"
  },
  {
    "word": "bracing",
    "definition": "[기운 북돋다] 상쾌한, 원기회복의"
  },
  {
    "word": "braggart",
    "definition": "[자랑하다] 허풍쟁이"
  },
  {
    "word": "bravado",
    "definition": "[허세] 허세, 허풍"
  },
  {
    "word": "brazen",
    "definition": "[놋쇠] 뻔뻔스러운, 대담한"
  },
  {
    "word": "brevity",
    "definition": "[짧다] 간결함"
  },
  {
    "word": "bridle",
    "definition": "[고삐] 억제하다, 굴레 씌우다"
  },
  {
    "word": "bristle",
    "definition": "[털 서다] 발끈하다, 곤두서다"
  },
  {
    "word": "brook",
    "definition": "[견디다] 참다, 용납하다"
  },
  {
    "word": "tolerate",
    "definition": "[견디다] 참다, 용납하다"
  },
  {
    "word": "bucolic",
    "definition": "[들] 전원적인, 목가적인"
  },
  {
    "word": "pastoral",
    "definition": "[들] 전원적인, 목가적인"
  },
  {
    "word": "bumbling",
    "definition": "[서투르다] 실수투성이의, 어설픈"
  },
  {
    "word": "buoy",
    "definition": "[뜨다] 기운 나게 하다, 부양하다"
  },
  {
    "word": "buoyant",
    "definition": "[뜰다] 부력이 있는, 낙천적인"
  },
  {
    "word": "burdensome",
    "definition": "[짐] 부담스러운, 무거운"
  },
  {
    "word": "burgeoning",
    "definition": "[꽃피다] 급성장하는, 급증하는"
  },
  {
    "word": "expansion",
    "definition": "[꽃피다] 급성장하는, 급증하는"
  },
  {
    "word": "buttress",
    "definition": "[받치다] 지지하다, 강화하다"
  },
  {
    "word": "bolster",
    "definition": "[받치다] 지지하다, 강화하다"
  },
  {
    "word": "buttress",
    "definition": "[지지대] 지지하다, 보강하다"
  },
  {
    "word": "by no means",
    "definition": "[전혀 아니다] 결코 ~아니다"
  },
  {
    "word": "bypass",
    "definition": "[우회하다] 피하다, 돌아가다"
  },
  {
    "word": "circumvent",
    "definition": "[우회하다] 피하다, 돌아가다"
  },
  {
    "word": "byzantine",
    "definition": "[복잡하다] 복잡한, 뒤얽힌"
  },
  {
    "word": "cache",
    "definition": "[숨기다] 은닉처, 저장소"
  },
  {
    "word": "cajole",
    "definition": "[달래다] 감언으로 속이다"
  },
  {
    "word": "calamity",
    "definition": "[재앙] 재앙, 불행"
  },
  {
    "word": "callous",
    "definition": "[굳다] 냉혹한, 무정한"
  },
  {
    "word": "callow",
    "definition": "[미숙] 미숙한, 경험 없는"
  },
  {
    "word": "calm",
    "definition": "[고요] 고요, 평온"
  },
  {
    "word": "quiescence",
    "definition": "[고요] 고요, 평온"
  },
  {
    "word": "camaraderie",
    "definition": "[동료애] 우정, 동료애"
  },
  {
    "word": "camouflage",
    "definition": "[숨다] 위장하다, 위장"
  },
  {
    "word": "candor",
    "definition": "[솔직하다] 솔직함, 정직함"
  },
  {
    "word": "canned",
    "definition": "[틀] 판에 박힌, 진부한"
  },
  {
    "word": "formulaic",
    "definition": "[틀] 판에 박힌, 진부한"
  },
  {
    "word": "canny",
    "definition": "[영리하다] 영리한, 약삭빠른"
  },
  {
    "word": "canonize",
    "definition": "[성인화] 칭송하다, 성인으로 공표하다"
  },
  {
    "word": "cantankerous",
    "definition": "[성내다] 성미 고약한, 불평 많은"
  },
  {
    "word": "canvass",
    "definition": "[호소하다] 권유하다, 선거운동하다"
  },
  {
    "word": "capitulate",
    "definition": "[항복하다] 항복하다, 굴복하다"
  },
  {
    "word": "capricious",
    "definition": "[변덕] 변덕스러운, 충동적인"
  },
  {
    "word": "impulsive",
    "definition": "[변덕] 변덕스러운, 충동적인"
  },
  {
    "word": "captivate",
    "definition": "[사로잡다] 매혹시키다"
  },
  {
    "word": "capture",
    "definition": "[붙잡다] 붙잡다, 확보하다"
  },
  {
    "word": "secure",
    "definition": "[붙잡다] 붙잡다, 확보하다"
  },
  {
    "word": "carping",
    "definition": "[흠잡다] 트집잡는, 잔소리하는"
  },
  {
    "word": "castigating",
    "definition": "[벌하다] 징계하다, 꾸짖다"
  },
  {
    "word": "chastising",
    "definition": "[벌하다] 징계하다, 꾸짖다"
  },
  {
    "word": "castigating",
    "definition": "[꾸짖다] 질책하다, 나무라다"
  },
  {
    "word": "reprimanding",
    "definition": "[꾸짖다] 질책하다, 나무라다"
  },
  {
    "word": "casual",
    "definition": "[가볍다] 대충하는, 우연한"
  },
  {
    "word": "cursory",
    "definition": "[가볍다] 대충하는, 우연한"
  },
  {
    "word": "cataclysmic",
    "definition": "[큰 변화] 격변의, 대재앙의"
  },
  {
    "word": "catchall",
    "definition": "[포괄하다] 포괄적인 것, 잡동사니"
  },
  {
    "word": "caterwaul",
    "definition": "[울부짖다] 새된 소리로 울다, 항의하다"
  },
  {
    "word": "shriek",
    "definition": "[울부짖다] 새된 소리로 울다, 항의하다"
  },
  {
    "word": "cease",
    "definition": "[멈추다] 멈추다, 중단하다"
  },
  {
    "word": "cede",
    "definition": "[양도하다] 양보하다, 할양하다"
  },
  {
    "word": "celebrated",
    "definition": "[유명하다] 유명한, 저명한"
  },
  {
    "word": "renowned",
    "definition": "[유명하다] 유명한, 저명한"
  },
  {
    "word": "censorious",
    "definition": "[비난하다] 비판적인, 까다로운"
  },
  {
    "word": "censure",
    "definition": "[비난하다] 비난하다, 책망하다"
  },
  {
    "word": "reprehend",
    "definition": "[비난하다] 비난하다, 책망하다"
  },
  {
    "word": "censure",
    "definition": "[꾸짖다] 질책하다, 꾸짖다"
  },
  {
    "word": "reprimand",
    "definition": "[꾸짖다] 질책하다, 꾸짖다"
  },
  {
    "word": "centrifugal",
    "definition": "[멀어지다] 원심의"
  },
  {
    "word": "challenge",
    "definition": "[도전하다] 도전, 문제 제기"
  },
  {
    "word": "champion",
    "definition": "[지지하다] 옹호하다, 지지자"
  },
  {
    "word": "advocate",
    "definition": "[지지하다] 옹호하다, 지지자"
  },
  {
    "word": "chariness",
    "definition": "[조심] 신중, 꺼림"
  },
  {
    "word": "chary",
    "definition": "[신중하다] 신중한, 조심스러운"
  },
  {
    "word": "prudent",
    "definition": "[신중하다] 신중한, 조심스러운"
  },
  {
    "word": "chastening",
    "definition": "[벌하다] 징계하다, 단련하다"
  },
  {
    "word": "chastising",
    "definition": "[꾸짖다] 심하게 꾸짖다"
  },
  {
    "word": "checking",
    "definition": "[막다] 억제하다, 저지하다"
  },
  {
    "word": "stemming",
    "definition": "[막다] 억제하다, 저지하다"
  },
  {
    "word": "chimera",
    "definition": "[환상] 환상, 허구"
  },
  {
    "word": "illusion",
    "definition": "[환상] 환상, 허구"
  },
  {
    "word": "chivalrous",
    "definition": "[기사] 기사도적인, 정중한"
  },
  {
    "word": "choleric",
    "definition": "[성나다] 화 잘 내는, 성급한"
  },
  {
    "word": "chronology",
    "definition": "[시간] 연대기, 연대순 배열"
  },
  {
    "word": "cipher",
    "definition": "[암호] 암호, 하찮은 것"
  },
  {
    "word": "circuitous",
    "definition": "[빙돌다] 우회하는, 간접적인"
  },
  {
    "word": "indirect",
    "definition": "[빙돌다] 우회하는, 간접적인"
  },
  {
    "word": "circumlocution",
    "definition": "[돌려 말하다] 완곡한 표현"
  },
  {
    "word": "circumscribe",
    "definition": "[경계치다] 제한하다, 한정하다"
  },
  {
    "word": "confine",
    "definition": "[경계치다] 제한하다, 한정하다"
  },
  {
    "word": "circumvent",
    "definition": "[피하다] 우회하다, 빠져나가다"
  },
  {
    "word": "cite",
    "definition": "[불러내다] 인용하다, 소환하다"
  },
  {
    "word": "clamorous",
    "definition": "[시끄럽다] 떠들썩한, 시끄러운"
  },
  {
    "word": "clandestine",
    "definition": "[숨다] 은밀한, 비밀의"
  },
  {
    "word": "clannish",
    "definition": "[파벌] 배타적인, 당파적인"
  },
  {
    "word": "clear out",
    "definition": "[비우다] 치우다, 비우다"
  },
  {
    "word": "clement=lenient",
    "definition": "[관대하다] 관대한, 온화한"
  },
  {
    "word": "clumsy",
    "definition": "[서투르다] 어색한, 서투른"
  },
  {
    "word": "coddle",
    "definition": "[응석받다] 응석받이로 기르다, 과잉보호하다"
  },
  {
    "word": "coercion",
    "definition": "[강제하다] 강압, 강요"
  },
  {
    "word": "cogent",
    "definition": "[설득하다] 설득력 있는"
  },
  {
    "word": "coherence",
    "definition": "[일관] 일관성, 응집력"
  },
  {
    "word": "collaborate",
    "definition": "[함께하다] 협력하다"
  },
  {
    "word": "collapse",
    "definition": "[무너지다] 붕괴하다, 실패하다"
  },
  {
    "word": "collegiality",
    "definition": "[동료] 동료애, 협력"
  },
  {
    "word": "colossal",
    "definition": "[거대하다] 거대한, 엄청난"
  },
  {
    "word": "immense",
    "definition": "[거대하다] 거대한, 엄청난"
  },
  {
    "word": "combine",
    "definition": "[합치다] 결합하다, 합치다"
  },
  {
    "word": "meld",
    "definition": "[합치다] 결합하다, 합치다"
  },
  {
    "word": "comity",
    "definition": "[예의] 정중함, 예절"
  },
  {
    "word": "civility",
    "definition": "[예의] 정중함, 예절"
  },
  {
    "word": "commence",
    "definition": "[시작하다] 시작하다, 개시하다"
  },
  {
    "word": "commend",
    "definition": "[칭찬하다] 칭찬하다, 추천하다"
  },
  {
    "word": "commensurate",
    "definition": "[비례하다] 비례하는, 상응하는"
  },
  {
    "word": "commiserate",
    "definition": "[함께 슬퍼하다] 동정하다, 위로하다"
  },
  {
    "word": "commonplace",
    "definition": "[흔하다] 흔한 일, 평범한 것"
  },
  {
    "word": "compelling",
    "definition": "[끌다] 강렬한, 설득력 있는"
  },
  {
    "word": "complexion",
    "definition": "[바탕] 안색, 기질, 성격"
  },
  {
    "word": "complicated",
    "definition": "[얽히다] 복잡한, 난해한"
  },
  {
    "word": "knotty",
    "definition": "[얽히다] 복잡한, 난해한"
  },
  {
    "word": "complimentary",
    "definition": "[칭찬] 칭찬의, 무료의"
  },
  {
    "word": "composure",
    "definition": "[가라앉다] 침착, 평정"
  },
  {
    "word": "compound",
    "definition": "[합하다] 합성하다, 합성물"
  },
  {
    "word": "comprehensive",
    "definition": "[포괄하다] 포괄적인, 광범위한"
  },
  {
    "word": "sweeping",
    "definition": "[포괄하다] 포괄적인, 광범위한"
  },
  {
    "word": "comprehensive",
    "definition": "[철저하다] 철저한, 종합적인"
  },
  {
    "word": "exhaustive",
    "definition": "[철저하다] 철저한, 종합적인"
  },
  {
    "word": "compromise",
    "definition": "[타협하다] 약화시키다, 손상하다"
  },
  {
    "word": "impair",
    "definition": "[타협하다] 약화시키다, 손상하다"
  },
  {
    "word": "compulsory",
    "definition": "[강제하다] 강제적인, 의무적인"
  },
  {
    "word": "compunction",
    "definition": "[찔리다] 양심의 가책, 거리낌"
  },
  {
    "word": "concede",
    "definition": "[인정하다] 인정하다, 양보하다"
  },
  {
    "word": "acknowledge",
    "definition": "[인정하다] 인정하다, 양보하다"
  },
  {
    "word": "conceivable",
    "definition": "[생각하다] 상상할 수 있는, 가능한"
  },
  {
    "word": "conciliatory",
    "definition": "[화해하다] 회유적인, 달래는"
  },
  {
    "word": "concomitant",
    "definition": "[함께] 동시에 일어나는, 수반되는"
  },
  {
    "word": "concurrent",
    "definition": "[함께 달리다] 동시에 존재하는, 공존하는"
  },
  {
    "word": "condone",
    "definition": "[용서하다] 묵과하다, 용서하다"
  },
  {
    "word": "conducive to~",
    "definition": "[도움] 도움이 되는"
  },
  {
    "word": "conflate",
    "definition": "[합치다] 융합하다, 혼합하다"
  },
  {
    "word": "confound",
    "definition": "[혼란] 당황하게 하다, 뒤섞다"
  },
  {
    "word": "confused",
    "definition": "[뒤섞다] 혼란스러운, 어지러운"
  },
  {
    "word": "muddled",
    "definition": "[뒤섞다] 혼란스러운, 어지러운"
  },
  {
    "word": "congeniality",
    "definition": "[마음 맞다] 친화성, 서로 잘 맞음"
  },
  {
    "word": "conjectural",
    "definition": "[추측하다] 추측의, 억측의"
  },
  {
    "word": "speculative",
    "definition": "[추측하다] 추측의, 억측의"
  },
  {
    "word": "connotation",
    "definition": "[암시] 함축, 내포"
  },
  {
    "word": "conscientiousness",
    "definition": "[양심] 성실함, 양심성"
  },
  {
    "word": "considerate",
    "definition": "[배려하다] 사려 깊은, 자상한"
  },
  {
    "word": "consign",
    "definition": "[맡기다] 위탁하다, 부치다"
  },
  {
    "word": "consistent",
    "definition": "[일치하다] 일관된, 일치하는"
  },
  {
    "word": "consolidate",
    "definition": "[튼튼히 하다] 강화하다, 통합하다"
  },
  {
    "word": "constrain",
    "definition": "[묶다] 강요하다, 제한하다"
  },
  {
    "word": "constrict",
    "definition": "[묶다] 강요하다, 제한하다"
  },
  {
    "word": "constrain",
    "definition": "[제한하다] 구속하다, 제한하다"
  },
  {
    "word": "construe",
    "definition": "[해석하다] 해석하다, 파악하다"
  },
  {
    "word": "interpret",
    "definition": "[해석하다] 해석하다, 파악하다"
  },
  {
    "word": "consummate",
    "definition": "[완성하다] 완벽한, 완전한"
  },
  {
    "word": "contagious",
    "definition": "[옮기다] 전염성 있는"
  },
  {
    "word": "contemplate",
    "definition": "[생각하다] 숙고하다"
  },
  {
    "word": "ponder",
    "definition": "[생각하다] 숙고하다"
  },
  {
    "word": "contemptuous",
    "definition": "[경멸하다] 경멸적인, 업신여기는"
  },
  {
    "word": "contend",
    "definition": "[싸우다] 다투다, 주장하다"
  },
  {
    "word": "contentious",
    "definition": "[다투다] 논쟁적인, 다툼을 일으키는"
  },
  {
    "word": "controversial",
    "definition": "[다투다] 논쟁적인, 다툼을 일으키는"
  },
  {
    "word": "contentious",
    "definition": "[다투다] 논쟁을 일삼는, 편향적인"
  },
  {
    "word": "tendentious",
    "definition": "[다투다] 논쟁을 일삼는, 편향적인"
  },
  {
    "word": "contingent upon",
    "definition": "[조건] ~에 달려 있는"
  },
  {
    "word": "contour",
    "definition": "[윤곽] 윤곽, 외형"
  },
  {
    "word": "contradiction",
    "definition": "[모순] 모순, 반박"
  },
  {
    "word": "contravene",
    "definition": "[위반하다] 위반하다, 침해하다"
  },
  {
    "word": "infringe",
    "definition": "[위반하다] 위반하다, 침해하다"
  },
  {
    "word": "contravene",
    "definition": "[위배하다] 위배하다, 어기다"
  },
  {
    "word": "violate",
    "definition": "[위배하다] 위배하다, 어기다"
  },
  {
    "word": "contrived",
    "definition": "[꾸며내다] 인위적인, 부자연스러운"
  },
  {
    "word": "contumacious",
    "definition": "[고집세다] 반항적인, 완강한"
  },
  {
    "word": "conundrum",
    "definition": "[수수께끼] 난제, 수수께끼"
  },
  {
    "word": "enigma",
    "definition": "[수수께끼] 난제, 수수께끼"
  },
  {
    "word": "convection",
    "definition": "[흐르다] 대류, 전달"
  },
  {
    "word": "conventional",
    "definition": "[관습] 관습적인, 전통적인"
  },
  {
    "word": "conversant",
    "definition": "[알다] 정통한, 잘 아는"
  },
  {
    "word": "convey (ideas)",
    "definition": "[전달하다] 전달하다, 알리다"
  },
  {
    "word": "impart",
    "definition": "[전달하다] 전달하다, 알리다"
  },
  {
    "word": "convictive",
    "definition": "[설득] 설득력 있는"
  },
  {
    "word": "persuasive",
    "definition": "[설득] 설득력 있는"
  },
  {
    "word": "convoluted",
    "definition": "[뒤엉키다] 복잡한, 난해한"
  },
  {
    "word": "convoluted",
    "definition": "[뒤엉키다] 복잡한, 구불구불한"
  },
  {
    "word": "tortuous",
    "definition": "[뒤엉키다] 복잡한, 구불구불한"
  },
  {
    "word": "copious",
    "definition": "[많다] 풍부한, 다수의"
  },
  {
    "word": "corroborate",
    "definition": "[확증하다] 입증하다, 확실히 하다"
  },
  {
    "word": "corrosive",
    "definition": "[갉아먹다] 부식성의, 신랄한"
  },
  {
    "word": "countenance",
    "definition": "[얼굴/지지] 얼굴, 찬성하다"
  },
  {
    "word": "countermand",
    "definition": "[취소하다] 철회하다, 취소하다"
  },
  {
    "word": "counterproductive",
    "definition": "[역효과] 역효과의"
  },
  {
    "word": "coveted",
    "definition": "[탐내다] 탐내는, 선망의 대상인"
  },
  {
    "word": "enviable",
    "definition": "[탐내다] 탐내는, 선망의 대상인"
  },
  {
    "word": "covetous",
    "definition": "[탐하다] 탐욕스러운"
  },
  {
    "word": "cower",
    "definition": "[웅크리다] 겁먹고 움츠리다"
  },
  {
    "word": "crassness",
    "definition": "[둔하다] 둔함, 어리석음"
  },
  {
    "word": "craven",
    "definition": "[겁쟁이] 비겁한, 소심한"
  },
  {
    "word": "credulous",
    "definition": "[쉽게 믿다] 잘 믿는, 속기 쉬운"
  },
  {
    "word": "trusting",
    "definition": "[쉽게 믿다] 잘 믿는, 속기 쉬운"
  },
  {
    "word": "croon",
    "definition": "[중얼거리다] 흥얼거리다"
  },
  {
    "word": "crucial",
    "definition": "[결정적] 결정적인, 중대한"
  },
  {
    "word": "critical",
    "definition": "[결정적] 결정적인, 중대한"
  },
  {
    "word": "cue",
    "definition": "[신호] 신호, 단서"
  },
  {
    "word": "culmination",
    "definition": "[정점] 절정, 최고조"
  },
  {
    "word": "culpability",
    "definition": "[죄] 과실, 책임"
  },
  {
    "word": "culprit",
    "definition": "[죄인] 범인, 주범"
  },
  {
    "word": "cultivate",
    "definition": "[경작하다] 경작하다, 함양하다"
  },
  {
    "word": "cumbersome",
    "definition": "[무겁다] 번거로운, 다루기 힘든"
  },
  {
    "word": "unwieldy",
    "definition": "[무겁다] 번거로운, 다루기 힘든"
  },
  {
    "word": "cursory",
    "definition": "[대충] 피상적인, 형식적인"
  },
  {
    "word": "perfunctory",
    "definition": "[대충] 피상적인, 형식적인"
  },
  {
    "word": "curt",
    "definition": "[짧다] 간결한, 무뚝뚝한"
  },
  {
    "word": "curtail",
    "definition": "[짧게 하다] 줄이다, 삭감하다"
  },
  {
    "word": "cynical",
    "definition": "[냉소] 냉소적인, 부정적인"
  },
  {
    "word": "dampen",
    "definition": "[약하게 하다] 약화시키다, 꺾다"
  },
  {
    "word": "deaden",
    "definition": "[약하게 하다] 약화시키다, 꺾다"
  },
  {
    "word": "dangerous",
    "definition": "[위험] 위험한"
  },
  {
    "word": "perilous",
    "definition": "[위험] 위험한"
  },
  {
    "word": "daunt",
    "definition": "[겁주다] 위협하다, 기 죽이다"
  },
  {
    "word": "dead",
    "definition": "[죽다] 죽은, 활동하지 않는"
  },
  {
    "word": "inactive",
    "definition": "[죽다] 죽은, 활동하지 않는"
  },
  {
    "word": "dead",
    "definition": "[죽다] 죽은, 비활성의"
  },
  {
    "word": "inert",
    "definition": "[죽다] 죽은, 비활성의"
  },
  {
    "word": "dearth",
    "definition": "[부족] 부족, 결핍"
  },
  {
    "word": "debacle",
    "definition": "[무너짐] 붕괴, 큰 실패"
  },
  {
    "word": "debilitate",
    "definition": "[약하게 하다] 쇠약하게 하다"
  },
  {
    "word": "debunk",
    "definition": "[폭로하다] 정체를 밝히다, 허구를 폭로하다"
  },
  {
    "word": "decay",
    "definition": "[썩다] 쇠퇴, 부패"
  },
  {
    "word": "deterioration",
    "definition": "[썩다] 쇠퇴, 부패"
  },
  {
    "word": "deceitful",
    "definition": "[속이다] 기만적인, 사기의"
  },
  {
    "word": "deceleration",
    "definition": "[느리게 하다] 감속, 둔화"
  },
  {
    "word": "decisive",
    "definition": "[결정하다] 결정적인, 명백한"
  },
  {
    "word": "unmistakable",
    "definition": "[결정하다] 결정적인, 명백한"
  },
  {
    "word": "decorum",
    "definition": "[예절] 예절, 단정함"
  },
  {
    "word": "decrepit",
    "definition": "[낡다] 노쇠한, 노후한"
  },
  {
    "word": "decrepitude",
    "definition": "[쇠퇴] 노후, 노쇠"
  },
  {
    "word": "decry",
    "definition": "[헐뜯다] 비난하다, 깎아내리다"
  },
  {
    "word": "defender",
    "definition": "[지지자] 옹호자, 지지자"
  },
  {
    "word": "proponent",
    "definition": "[지지자] 옹호자, 지지자"
  },
  {
    "word": "defer",
    "definition": "[미루다/따르다] 연기하다, 경의를 표하다"
  },
  {
    "word": "deference",
    "definition": "[존중] 존경, 경의"
  },
  {
    "word": "deferential",
    "definition": "[존경] 공손한, 경의를 표하는"
  },
  {
    "word": "defied",
    "definition": "[거역하다] 무시하다, 반항하다"
  },
  {
    "word": "disregarded",
    "definition": "[거역하다] 무시하다, 반항하다"
  },
  {
    "word": "definitive",
    "definition": "[결정적] 권위있는, 최종적인"
  },
  {
    "word": "authoritative",
    "definition": "[결정적] 권위있는, 최종적인"
  },
  {
    "word": "deflate",
    "definition": "[바람 빼다] 축소하다, 기를 꺾다"
  },
  {
    "word": "deflect",
    "definition": "[비끼다] 방향을 바꾸다, 비껴가다"
  },
  {
    "word": "shrug off",
    "definition": "[비끼다] 방향을 바꾸다, 비껴가다"
  },
  {
    "word": "deft",
    "definition": "[솜씨] 능숙한, 날렵한"
  },
  {
    "word": "defy",
    "definition": "[거역하다] 거부하다, 반항하다"
  },
  {
    "word": "disregard",
    "definition": "[거역하다] 거부하다, 반항하다"
  },
  {
    "word": "defied",
    "definition": "[무시하다] 무시되다, 거역하다"
  },
  {
    "word": "deign",
    "definition": "[값내리다] 자존심을 버리고 ~하다"
  },
  {
    "word": "deject",
    "definition": "[기 떨어지다] 낙담시키다"
  },
  {
    "word": "delegate",
    "definition": "[보내다] 위임하다, 대표"
  },
  {
    "word": "deleterious",
    "definition": "[해롭다] 해로운"
  },
  {
    "word": "delirious",
    "definition": "[정신없다] 의식 혼미한, 열광적인"
  },
  {
    "word": "delude",
    "definition": "[속이다] 속이다, 착각하게 하다"
  },
  {
    "word": "demanding",
    "definition": "[요구하다] 요구가 많은, 힘든"
  },
  {
    "word": "demarcation",
    "definition": "[경계] 경계, 구분"
  },
  {
    "word": "demise",
    "definition": "[죽다] 사망, 소멸"
  },
  {
    "word": "demolished",
    "definition": "[무너지다] 파괴된"
  },
  {
    "word": "demonstrate",
    "definition": "[보여주다] 시연하다, 증명하다"
  },
  {
    "word": "demur",
    "definition": "[반대하다] 이의를 제기하다"
  },
  {
    "word": "denigrate",
    "definition": "[헐뜯다] 비방하다, 폄하하다"
  },
  {
    "word": "denounce",
    "definition": "[비난하다] 비난하다, 규탄하다"
  },
  {
    "word": "lambaste",
    "definition": "[비난하다] 비난하다, 규탄하다"
  },
  {
    "word": "denude",
    "definition": "[벗기다] 발가벗기다, 없애다"
  },
  {
    "word": "denude",
    "definition": "[없애다] 제거하다"
  },
  {
    "word": "denunciation",
    "definition": "[비난] 공개 비난"
  },
  {
    "word": "deplete",
    "definition": "[비우다] 고갈시키다"
  },
  {
    "word": "deploy",
    "definition": "[펼치다] 배치하다"
  },
  {
    "word": "depraved",
    "definition": "[타락하다] 타락한, 부패한"
  },
  {
    "word": "deprecate",
    "definition": "[비난하다] 반대하다, 비난하다"
  },
  {
    "word": "derelict",
    "definition": "[버리다] 방치된, 버려진"
  },
  {
    "word": "deride",
    "definition": "[비웃다] 비웃다, 조롱하다"
  },
  {
    "word": "derisive",
    "definition": "[비웃다] 조롱하는, 비웃는"
  },
  {
    "word": "derivative",
    "definition": "[파생하다] 파생된, 모방한"
  },
  {
    "word": "design",
    "definition": "[목적] 디자인, 설계, 의도"
  },
  {
    "word": "purposefulness",
    "definition": "[목적] 디자인, 설계, 의도"
  },
  {
    "word": "despondent",
    "definition": "[낙심] 낙담한, 풀이 죽은"
  },
  {
    "word": "deteriorate",
    "definition": "[나빠지다] 악화되다, 쇠퇴하다"
  },
  {
    "word": "detest",
    "definition": "[싫어하다] 극도로 싫어하다"
  },
  {
    "word": "detract",
    "definition": "[가치 깎다] 손상시키다, 줄이다"
  },
  {
    "word": "deprecate",
    "definition": "[가치 깎다] 손상시키다, 줄이다"
  },
  {
    "word": "detractor",
    "definition": "[헐뜯는 자] 비방자, 반대자"
  },
  {
    "word": "detrimental",
    "definition": "[해롭다] 해로운"
  },
  {
    "word": "deviate",
    "definition": "[빗나가다] 벗어나다, 일탈하다"
  },
  {
    "word": "mislead",
    "definition": "[빗나가다] 벗어나다, 일탈하다"
  },
  {
    "word": "devious",
    "definition": "[우회하다] 기만적인, 교활한"
  },
  {
    "word": "devolve",
    "definition": "[넘기다] 양도하다, 위임하다"
  },
  {
    "word": "dexterous",
    "definition": "[손재주] 능숙한, 솜씨 좋은"
  },
  {
    "word": "nimble",
    "definition": "[손재주] 능숙한, 솜씨 좋은"
  },
  {
    "word": "diagnose",
    "definition": "[알아채다] 진단하다"
  },
  {
    "word": "dialect",
    "definition": "[말하다] 방언, 사투리"
  },
  {
    "word": "diatribe",
    "definition": "[꾸짖다] 통렬한 비난"
  },
  {
    "word": "criticism",
    "definition": "[꾸짖다] 통렬한 비난"
  },
  {
    "word": "diatribe",
    "definition": "[꾸짖다] 격렬한 비난, 길게 말함"
  },
  {
    "word": "rant",
    "definition": "[꾸짖다] 격렬한 비난, 길게 말함"
  },
  {
    "word": "dichotomous",
    "definition": "[둘로 나누다] 이분법적인, 모순적인"
  },
  {
    "word": "contradictory",
    "definition": "[둘로 나누다] 이분법적인, 모순적인"
  },
  {
    "word": "dichotomy",
    "definition": "[둘로 나누다] 이분법, 분할"
  },
  {
    "word": "dictatorial",
    "definition": "[말하다/명령] 독재적인, 전제적인"
  },
  {
    "word": "didactic",
    "definition": "[가르치다] 교훈적인, 가르치려 드는"
  },
  {
    "word": "diffident",
    "definition": "[믿음 부족] 소심한, 자신 없는"
  },
  {
    "word": "diffident",
    "definition": "[두려움] 소심한, 수줍은"
  },
  {
    "word": "timid",
    "definition": "[두려움] 소심한, 수줍은"
  },
  {
    "word": "diffuse",
    "definition": "[퍼뜨리다] 흩뿌리다, 확산시키다"
  },
  {
    "word": "spread",
    "definition": "[퍼뜨리다] 흩뿌리다, 확산시키다"
  },
  {
    "word": "diffusive",
    "definition": "[퍼지다] 확산성 있는, 산만한"
  },
  {
    "word": "digress",
    "definition": "[옆길] 탈선하다, 주제에서 벗어나다"
  },
  {
    "word": "digressional",
    "definition": "[옆길] 주제 벗어난, 탈선하는"
  },
  {
    "word": "dilatory",
    "definition": "[늦추다] 지연하는, 꾸물거리는"
  },
  {
    "word": "dilettante",
    "definition": "[취미로] 아마추어 애호가, 취미로 하는 사람"
  },
  {
    "word": "dim",
    "definition": "[어둡다] 어둑한, 희미한"
  },
  {
    "word": "dim",
    "definition": "[어두워지다] 흐리게 하다, 어둡게 만들다"
  },
  {
    "word": "darken",
    "definition": "[어두워지다] 흐리게 하다, 어둡게 만들다"
  },
  {
    "word": "diminutive",
    "definition": "[작다] 매우 작은"
  },
  {
    "word": "minuscule",
    "definition": "[작다] 매우 작은"
  },
  {
    "word": "disabuse",
    "definition": "[잘못 풀다] 오해를 풀다, 바로잡다"
  },
  {
    "word": "disallow",
    "definition": "[허락X] 금지하다, 인정하지 않다"
  },
  {
    "word": "disarmed",
    "definition": "[무장 해제] 무장 해제된, 방심한"
  },
  {
    "word": "disarray",
    "definition": "[혼란] 무질서, 혼란"
  },
  {
    "word": "disavow",
    "definition": "[부정하다] 부인하다, 거부하다"
  },
  {
    "word": "disavow",
    "definition": "[부정하다] 책임 회피하다, 부인하다"
  },
  {
    "word": "disband",
    "definition": "[흩어지다] 해산하다"
  },
  {
    "word": "discard",
    "definition": "[버리다] 버리다, 폐기하다"
  },
  {
    "word": "discern",
    "definition": "[구별하다] 알아보다, 식별하다"
  },
  {
    "word": "detect",
    "definition": "[구별하다] 알아보다, 식별하다"
  },
  {
    "word": "discerned",
    "definition": "[알아차리다] 알아챈, 발견한"
  },
  {
    "word": "discovered",
    "definition": "[알아차리다] 알아챈, 발견한"
  },
  {
    "word": "discernible",
    "definition": "[보이다] 인식할 수 있는, 뚜렷한"
  },
  {
    "word": "discerning",
    "definition": "[분별하다] 통찰력 있는, 안목 있는"
  },
  {
    "word": "discernment",
    "definition": "[분별] 분별력, 판단력"
  },
  {
    "word": "disconcerting",
    "definition": "[난처] 당황하게 하는, 불안하게 하는"
  },
  {
    "word": "discredit",
    "definition": "[불신] 불신케 하다, 평판을 떨어뜨리다"
  },
  {
    "word": "discreet",
    "definition": "[조심하다] 신중한, 분별 있는"
  },
  {
    "word": "discrepancy",
    "definition": "[어긋남] 불일치, 차이"
  },
  {
    "word": "incongruity",
    "definition": "[어긋남] 불일치, 차이"
  },
  {
    "word": "discrete",
    "definition": "[떨어지다] 분리된, 별개의"
  },
  {
    "word": "discretion",
    "definition": "[판단하다] 분별, 재량"
  },
  {
    "word": "discretionary",
    "definition": "[자유] 임의의, 자유 재량의"
  },
  {
    "word": "discursion",
    "definition": "[둘러 말하다] 산만한 말, 장황함"
  },
  {
    "word": "discursive",
    "definition": "[이리저리 생각] 논증적인, 분석적인, 산만한"
  },
  {
    "word": "analytical",
    "definition": "[이리저리 생각] 논증적인, 분석적인, 산만한"
  },
  {
    "word": "disdain",
    "definition": "[멸시하다] 경멸, 무시"
  },
  {
    "word": "disequilibrium",
    "definition": "[불균형] 불균형, 불안정"
  },
  {
    "word": "disgorge",
    "definition": "[토하다] 토하다, 쏟아내다"
  },
  {
    "word": "disinclined to",
    "definition": "[마음X] 내키지 않는, 꺼리는"
  },
  {
    "word": "disinformation",
    "definition": "[거짓정보] 허위정보"
  },
  {
    "word": "mendacity",
    "definition": "[거짓정보] 허위정보"
  },
  {
    "word": "disingenuous",
    "definition": "[솔직X] 솔직하지 못한, 부정직한"
  },
  {
    "word": "disinterested",
    "definition": "[관심없음] 공정한, 사심 없는"
  },
  {
    "word": "impartial",
    "definition": "[관심없음] 공정한, 사심 없는"
  },
  {
    "word": "disjunctive",
    "definition": "[떨어지다] 분리하는, 분리적인"
  },
  {
    "word": "dividing",
    "definition": "[떨어지다] 분리하는, 분리적인"
  },
  {
    "word": "dismal",
    "definition": "[암울] 우울한, 음침한"
  },
  {
    "word": "dismantle",
    "definition": "[해체] 분해하다, 해체하다"
  },
  {
    "word": "dismiss",
    "definition": "[내쫓다] 해고하다, 묵살하다"
  },
  {
    "word": "dismissive",
    "definition": "[경멸] 무시하는, 경시하는"
  },
  {
    "word": "disparage",
    "definition": "[깎아내리다] 비하하다, 얕보다"
  },
  {
    "word": "slight",
    "definition": "[깎아내리다] 비하하다, 얕보다"
  },
  {
    "word": "disparaging",
    "definition": "[비난] 경멸적인, 얕보는"
  },
  {
    "word": "disparate",
    "definition": "[떨어지다] 이질적인, 전혀 다른"
  },
  {
    "word": "disparity",
    "definition": "[차이] 불균형, 격차"
  },
  {
    "word": "variance",
    "definition": "[차이] 불균형, 격차"
  },
  {
    "word": "dispassionate",
    "definition": "[감정X] 냉정한, 공정한"
  },
  {
    "word": "dispatch",
    "definition": "[빠르다] 신속, 특파하다"
  },
  {
    "word": "celerity",
    "definition": "[빠르다] 신속, 특파하다"
  },
  {
    "word": "dispatch",
    "definition": "[보내다] 급파하다, 파견"
  },
  {
    "word": "expedition",
    "definition": "[보내다] 급파하다, 파견"
  },
  {
    "word": "dispel",
    "definition": "[쫓다] 쫓아버리다, 없애다"
  },
  {
    "word": "dispense with",
    "definition": "[없애다] ~없이 지내다, 무시하다"
  },
  {
    "word": "dispirited",
    "definition": "[기운 없다] 낙담한, 풀이 죽은"
  },
  {
    "word": "displeased",
    "definition": "[불만] 불쾌한, 기분 상한"
  },
  {
    "word": "disregard",
    "definition": "[무시하다] 무시하다, 소홀히 하다"
  },
  {
    "word": "defy",
    "definition": "[무시하다] 무시하다, 소홀히 하다"
  },
  {
    "word": "disrupt",
    "definition": "[깨뜨리다] 방해하다, 혼란시키다"
  },
  {
    "word": "disseminate",
    "definition": "[퍼뜨리다] 보급하다, 유포하다"
  },
  {
    "word": "transmit",
    "definition": "[퍼뜨리다] 보급하다, 유포하다"
  },
  {
    "word": "dissent",
    "definition": "[반대] 반대하다, 이의제기하다"
  },
  {
    "word": "dissident",
    "definition": "[의견 다른] 반체제 인사, 반대자"
  },
  {
    "word": "distasteful",
    "definition": "[싫다] 불쾌한, 안 맞는"
  },
  {
    "word": "distend",
    "definition": "[부풀리다] 팽창하다, 부풀다"
  },
  {
    "word": "distinct",
    "definition": "[구분되다] 뚜렷한, 별개의"
  },
  {
    "word": "discrete",
    "definition": "[구분되다] 뚜렷한, 별개의"
  },
  {
    "word": "distort",
    "definition": "[비틀다] 왜곡하다"
  },
  {
    "word": "diverge",
    "definition": "[갈라지다] 갈라지다, 빗나가다"
  },
  {
    "word": "divergent",
    "definition": "[달라지다] 갈라지는, 다른"
  },
  {
    "word": "disparate",
    "definition": "[달라지다] 갈라지는, 다른"
  },
  {
    "word": "divisive",
    "definition": "[나누다] 분열을 일으키는"
  },
  {
    "word": "dogmatic",
    "definition": "[주장하다] 독단적인"
  },
  {
    "word": "dormant",
    "definition": "[잠들다] 휴면 중의, 활동하지 않는"
  },
  {
    "word": "doubted",
    "definition": "[의심하다] 의심되는, 의문시된"
  },
  {
    "word": "questioned",
    "definition": "[의심하다] 의심되는, 의문시된"
  },
  {
    "word": "dour",
    "definition": "[엄한] 시무룩한, 엄한"
  },
  {
    "word": "douse",
    "definition": "[물 끼얹다] 끄다, 적시다"
  },
  {
    "word": "extinguish",
    "definition": "[물 끼얹다] 끄다, 적시다"
  },
  {
    "word": "dovish",
    "definition": "[평화] 비둘기파의, 평화적인"
  },
  {
    "word": "peaceful",
    "definition": "[평화] 비둘기파의, 평화적인"
  },
  {
    "word": "downplay",
    "definition": "[축소] 경시하다, 폄하하다"
  },
  {
    "word": "draconian",
    "definition": "[가혹] 가혹한"
  },
  {
    "word": "drawback",
    "definition": "[뒤로 끌다] 결점, 약점"
  },
  {
    "word": "dreary",
    "definition": "[지루하다] 음울한, 지루한"
  },
  {
    "word": "tedious",
    "definition": "[지루하다] 음울한, 지루한"
  },
  {
    "word": "drollness",
    "definition": "[우스꽝] 익살, 우스꽝스러움"
  },
  {
    "word": "dubious",
    "definition": "[의심] 의심스러운"
  },
  {
    "word": "dumbfounded",
    "definition": "[놀라 벙벙] 어안이 벙벙한"
  },
  {
    "word": "dwindling",
    "definition": "[줄다] 줄어드는, 감소하는"
  },
  {
    "word": "contracting",
    "definition": "[줄다] 줄어드는, 감소하는"
  },
  {
    "word": "easygoing",
    "definition": "[느긋하다] 태평한, 느긋한"
  },
  {
    "word": "ebb",
    "definition": "[빠지다] (물·힘·상태가) 빠지다, 쇠퇴하다"
  },
  {
    "word": "ebullient",
    "definition": "[끓다] 열광적인, 패기만만한"
  },
  {
    "word": "eccentric",
    "definition": "[밖으로 벗어나다] 별난, 괴짜의"
  },
  {
    "word": "eclectic",
    "definition": "[골라모으다] 절충적인, 다양한"
  },
  {
    "word": "ecstasy",
    "definition": "[벅차다] 황홀, 무아지경"
  },
  {
    "word": "euphoria",
    "definition": "[벅차다] 황홀, 무아지경"
  },
  {
    "word": "ecumenical",
    "definition": "[보편] 전세계적인, 보편적인"
  },
  {
    "word": "edible",
    "definition": "[먹을 수 있음] 먹을 수 있는"
  },
  {
    "word": "edifying",
    "definition": "[가르치다] 교훈적인, 유익한"
  },
  {
    "word": "efface",
    "definition": "[지우다] 지우다, 없애다"
  },
  {
    "word": "efficacy",
    "definition": "[효과] 효능, 효과"
  },
  {
    "word": "effrontery",
    "definition": "[뻔뻔] 뻔뻔스러움, 무례"
  },
  {
    "word": "effusive",
    "definition": "[쏟다] 감정적인, 과장된"
  },
  {
    "word": "emotional",
    "definition": "[쏟다] 감정적인, 과장된"
  },
  {
    "word": "effusive",
    "definition": "[넘쳐흐르다] (감정) 과장된, 넘치는"
  },
  {
    "word": "egalitarian",
    "definition": "[평등] 평등주의의"
  },
  {
    "word": "egregious",
    "definition": "[튀다] 지독한, 엄청난"
  },
  {
    "word": "flagrant",
    "definition": "[튀다] 지독한, 엄청난"
  },
  {
    "word": "elaborate",
    "definition": "[정성들이다] 정교한, 상세한"
  },
  {
    "word": "elementary",
    "definition": "[기본] 기초적인, 초보의"
  },
  {
    "word": "rudimentary",
    "definition": "[기본] 기초적인, 초보의"
  },
  {
    "word": "elicit",
    "definition": "[이끌어내다] 이끌어내다, 끌어내다"
  },
  {
    "word": "draw",
    "definition": "[이끌어내다] 이끌어내다, 끌어내다"
  },
  {
    "word": "elicit",
    "definition": "[불러내다] (감정) 불러일으키다"
  },
  {
    "word": "evoke",
    "definition": "[불러내다] (감정) 불러일으키다"
  },
  {
    "word": "elucidate",
    "definition": "[밝히다] 해명하다, 설명하다"
  },
  {
    "word": "elusive",
    "definition": "[잡히지 않다] 찾기 힘든, 이해하기 힘든"
  },
  {
    "word": "slippery",
    "definition": "[잡히지 않다] 찾기 힘든, 이해하기 힘든"
  },
  {
    "word": "emblematic",
    "definition": "[상징] 상징적인, 전형적인"
  },
  {
    "word": "totemic",
    "definition": "[상징] 상징적인, 전형적인"
  },
  {
    "word": "emblematic",
    "definition": "[상징] 상징적인"
  },
  {
    "word": "symbolic",
    "definition": "[상징] 상징적인"
  },
  {
    "word": "emendation",
    "definition": "[고치다] 수정, 교정"
  },
  {
    "word": "revision",
    "definition": "[고치다] 수정, 교정"
  },
  {
    "word": "empathy",
    "definition": "[같이 느끼다] 공감, 감정이입"
  },
  {
    "word": "empirical",
    "definition": "[경험] 경험적인, 실증적인"
  },
  {
    "word": "empiricist",
    "definition": "[경험] 경험주의자"
  },
  {
    "word": "emulate",
    "definition": "[본받다] 모방하다, 따라가다"
  },
  {
    "word": "enamor",
    "definition": "[사로잡다] 반하게 하다"
  },
  {
    "word": "favor",
    "definition": "[사로잡다] 반하게 하다"
  },
  {
    "word": "enamored",
    "definition": "[사로잡히다] 매혹된, 홀린"
  },
  {
    "word": "encoded",
    "definition": "[암호화] 부호화된, 암호화된"
  },
  {
    "word": "encomium",
    "definition": "[칭찬] 찬사"
  },
  {
    "word": "tribute",
    "definition": "[칭찬] 찬사"
  },
  {
    "word": "encroachment",
    "definition": "[침범하다] 침해, 잠식"
  },
  {
    "word": "encumber",
    "definition": "[짐] 방해하다, 부담을 지우다"
  },
  {
    "word": "encyclopedic",
    "definition": "[모두 담다] 박식한, 전반적인"
  },
  {
    "word": "exhaustive",
    "definition": "[모두 담다] 박식한, 전반적인"
  },
  {
    "word": "endemic",
    "definition": "[특정 지역] 지역 고유의, 풍토적인"
  },
  {
    "word": "endorse",
    "definition": "[지지하다] 지지하다, 보증하다"
  },
  {
    "word": "endurance",
    "definition": "[버티다] 인내, 끈기"
  },
  {
    "word": "tenacity",
    "definition": "[버티다] 인내, 끈기"
  },
  {
    "word": "enervate",
    "definition": "[약하게] 기력을 약화시키다"
  },
  {
    "word": "enfeeble",
    "definition": "[약하게] 약화시키다"
  },
  {
    "word": "engaging",
    "definition": "[끌다] 매력적인, 호감 가는"
  },
  {
    "word": "winning",
    "definition": "[끌다] 매력적인, 호감 가는"
  },
  {
    "word": "engender",
    "definition": "[낳다] 낳다, 발생시키다"
  },
  {
    "word": "enhance",
    "definition": "[높이다] 향상시키다"
  },
  {
    "word": "enigma",
    "definition": "[수수께끼] 수수께끼, 불가사의"
  },
  {
    "word": "enjoin",
    "definition": "[명령하다] 명하다, 금하다"
  },
  {
    "word": "ennui",
    "definition": "[지루함] 권태, 지루함"
  },
  {
    "word": "entangle",
    "definition": "[얽히다] 얽히게 하다, 말려들다"
  },
  {
    "word": "entice",
    "definition": "[끌다] 유인하다, 유혹하다"
  },
  {
    "word": "entrenched",
    "definition": "[뿌리내리다] 확립된, 견고한"
  },
  {
    "word": "ephemeral",
    "definition": "[짧다] 순식간의, 덧없는"
  },
  {
    "word": "short-lived",
    "definition": "[짧다] 순식간의, 덧없는"
  },
  {
    "word": "epitome",
    "definition": "[요약하다] 전형, 요약"
  },
  {
    "word": "equity",
    "definition": "[공정] 공평, 자산(자본)"
  },
  {
    "word": "equivalent",
    "definition": "[같다] 동등한, 맞먹는"
  },
  {
    "word": "equivocal",
    "definition": "[양쪽] 애매한, 불분명한"
  },
  {
    "word": "erode",
    "definition": "[갉다] 침식하다, 닳아 없어지다"
  },
  {
    "word": "erratic",
    "definition": "[방황] 불규칙한, 변덕스러운"
  },
  {
    "word": "erstwhile",
    "definition": "[이전의] 이전의, 과거의"
  },
  {
    "word": "onetime",
    "definition": "[이전의] 이전의, 과거의"
  },
  {
    "word": "erudite",
    "definition": "[배우다] 박식한"
  },
  {
    "word": "learned",
    "definition": "[배우다] 박식한"
  },
  {
    "word": "erudition",
    "definition": "[학식] 박식, 학문"
  },
  {
    "word": "escapade",
    "definition": "[탈출하다] 무모한 장난, 엉뚱한 짓"
  },
  {
    "word": "eschew",
    "definition": "[피하다] 피하다, 삼가다"
  },
  {
    "word": "esoteric",
    "definition": "[숨다] 소수만 아는, 난해한"
  },
  {
    "word": "recondite",
    "definition": "[숨다] 소수만 아는, 난해한"
  },
  {
    "word": "espouse",
    "definition": "[지지하다] 옹호하다, 지지하다"
  },
  {
    "word": "champion",
    "definition": "[지지하다] 옹호하다, 지지하다"
  },
  {
    "word": "essential",
    "definition": "[본질] 필수적인, 본질적인"
  },
  {
    "word": "indispensable",
    "definition": "[본질] 필수적인, 본질적인"
  },
  {
    "word": "estrange",
    "definition": "[떨어지다] 소원하게 하다"
  },
  {
    "word": "ethos",
    "definition": "[정신] 민족정신, 사회 분위기"
  },
  {
    "word": "eulogize",
    "definition": "[칭송하다] 칭송하다, 찬미하다"
  },
  {
    "word": "euphoria",
    "definition": "[기쁨] 행복감, 희열"
  },
  {
    "word": "ecstasy",
    "definition": "[기쁨] 행복감, 희열"
  },
  {
    "word": "euphoric",
    "definition": "[기쁜] 행복한, 희열의"
  },
  {
    "word": "evanescent",
    "definition": "[사라지다] 덧없는, 순식간에 사라지는"
  },
  {
    "word": "evasive",
    "definition": "[피하다] 회피적인"
  },
  {
    "word": "elusive",
    "definition": "[피하다] 회피적인"
  },
  {
    "word": "evenhanded",
    "definition": "[공정] 공평한, 공정한"
  },
  {
    "word": "exacerbated",
    "definition": "[악화시키다] 악화된"
  },
  {
    "word": "aggravated",
    "definition": "[악화시키다] 악화된"
  },
  {
    "word": "exaction",
    "definition": "[강요] 강탈, 착취"
  },
  {
    "word": "extortion",
    "definition": "[강요] 강탈, 착취"
  },
  {
    "word": "exactitude",
    "definition": "[정확] 철저함, 엄밀"
  },
  {
    "word": "meticulousness",
    "definition": "[정확] 철저함, 엄밀"
  },
  {
    "word": "exaggeration",
    "definition": "[과장] 과장"
  },
  {
    "word": "hyperbole",
    "definition": "[과장] 과장"
  },
  {
    "word": "exalt",
    "definition": "[높이다] 칭송하다, 격상하다"
  },
  {
    "word": "valorize",
    "definition": "[높이다] 칭송하다, 격상하다"
  },
  {
    "word": "exasperate",
    "definition": "[화나게 하다] 화나게 하다"
  },
  {
    "word": "excavation",
    "definition": "[파다] 발굴, 굴착"
  },
  {
    "word": "exclusive",
    "definition": "[배제하다] 독점적인, 배타적인"
  },
  {
    "word": "excoriate",
    "definition": "[혹평하다] 맹비난하다"
  },
  {
    "word": "denounce",
    "definition": "[혹평하다] 맹비난하다"
  },
  {
    "word": "excoriate",
    "definition": "[헐뜯다] 심하게 비난하다"
  },
  {
    "word": "crab",
    "definition": "[헐뜯다] 심하게 비난하다"
  },
  {
    "word": "exculpate",
    "definition": "[죄 벗기다] 무죄로 하다"
  },
  {
    "word": "excuse",
    "definition": "[핑계] 변명하다, 정당화하다"
  },
  {
    "word": "exemplar",
    "definition": "[본보기] 모범, 전형"
  },
  {
    "word": "model",
    "definition": "[본보기] 모범, 전형"
  },
  {
    "word": "exemplary",
    "definition": "[모범] 모범적인, 본보기의"
  },
  {
    "word": "exhaustive",
    "definition": "[철저하다] 철저한, 포괄적인"
  },
  {
    "word": "comprehensive",
    "definition": "[철저하다] 철저한, 포괄적인"
  },
  {
    "word": "exile",
    "definition": "[내쫓다] 망명, 추방"
  },
  {
    "word": "exonerate",
    "definition": "[무죄 입증] 혐의를 벗겨주다"
  },
  {
    "word": "exotic",
    "definition": "[낯선] 이국적인, 색다른"
  },
  {
    "word": "expansion",
    "definition": "[확대하다] 팽창, 확장"
  },
  {
    "word": "augmentation",
    "definition": "[확대하다] 팽창, 확장"
  },
  {
    "word": "expansive",
    "definition": "[넓다] 광활한, 포괄적인"
  },
  {
    "word": "expatriate",
    "definition": "[내쫓다] 국외 거주자, 국외로 추방된 자"
  },
  {
    "word": "expedient",
    "definition": "[편리하다] 편의주의적인, 임시방편의"
  },
  {
    "word": "expedite",
    "definition": "[빠르게] 신속히 처리하다"
  },
  {
    "word": "expel",
    "definition": "[내쫓다] 추방하다, 내쫓다"
  },
  {
    "word": "oust",
    "definition": "[내쫓다] 추방하다, 내쫓다"
  },
  {
    "word": "experimental",
    "definition": "[시험하다] 실험적인, 혁신적인"
  },
  {
    "word": "innovative",
    "definition": "[시험하다] 실험적인, 혁신적인"
  },
  {
    "word": "exploit",
    "definition": "[이용하다] 이용하다, 악용하다"
  },
  {
    "word": "exploitative",
    "definition": "[이용하다] 착취적인"
  },
  {
    "word": "expostulation",
    "definition": "[충고] 훈계, 충언"
  },
  {
    "word": "extemporize",
    "definition": "[즉석] 즉흥적으로 하다"
  },
  {
    "word": "extensive",
    "definition": "[넓다] 광범위한, 넓은"
  },
  {
    "word": "extenuate",
    "definition": "[약화시키다] 정당화하다, 참작하다"
  },
  {
    "word": "extinguish",
    "definition": "[끄다] 끄다, 불을 끄다"
  },
  {
    "word": "extirpate",
    "definition": "[뿌리뽑다] 근절하다, 박멸하다"
  },
  {
    "word": "eradicate",
    "definition": "[뿌리뽑다] 근절하다, 박멸하다"
  },
  {
    "word": "extol",
    "definition": "[칭찬하다] 칭송하다"
  },
  {
    "word": "extraneous",
    "definition": "[밖] 관련 없는, 외부의"
  },
  {
    "word": "irrelevant",
    "definition": "[밖] 관련 없는, 외부의"
  },
  {
    "word": "extravagant",
    "definition": "[넘치다] 낭비하는, 사치스러운"
  },
  {
    "word": "extremist",
    "definition": "[극단] 극단주의자"
  },
  {
    "word": "zealot",
    "definition": "[극단] 극단주의자"
  },
  {
    "word": "extricate",
    "definition": "[풀다] 해방시키다, 구해내다"
  },
  {
    "word": "exuberant",
    "definition": "[넘치다] 활기 넘치는, 원기 왕성한"
  },
  {
    "word": "facetious",
    "definition": "[농담하다] 익살스러운, 진지하지 않은"
  },
  {
    "word": "facile",
    "definition": "[쉽다] 손쉬운, 피상적인"
  },
  {
    "word": "facilitate",
    "definition": "[쉽게 하다] 용이하게 하다, 촉진하다"
  },
  {
    "word": "further",
    "definition": "[쉽게 하다] 용이하게 하다, 촉진하다"
  },
  {
    "word": "factionousness",
    "definition": "[분열] 당파성, 분열"
  },
  {
    "word": "schism",
    "definition": "[분열] 당파성, 분열"
  },
  {
    "word": "factual",
    "definition": "[사실] 사실의, 사실에 근거한"
  },
  {
    "word": "faddish",
    "definition": "[유행] 일시적으로 유행하는"
  },
  {
    "word": "fairness",
    "definition": "[공정] 공정함, 객관성"
  },
  {
    "word": "objectivity",
    "definition": "[공정] 공정함, 객관성"
  },
  {
    "word": "fallacious",
    "definition": "[거짓] 그릇된, 허위의"
  },
  {
    "word": "deceptive",
    "definition": "[거짓] 그릇된, 허위의"
  },
  {
    "word": "fallacy",
    "definition": "[틀림] 오류, 잘못된 믿음"
  },
  {
    "word": "far-reaching",
    "definition": "[광범위] 폭넓은, 중요한"
  },
  {
    "word": "fastidious",
    "definition": "[까다롭다] 까다로운, 세심한"
  },
  {
    "word": "fatuous",
    "definition": "[바보] 어리석은, 얼빠진"
  },
  {
    "word": "faultless",
    "definition": "[흠없다] 완벽한, 흠잡을 데 없는"
  },
  {
    "word": "perfect",
    "definition": "[흠없다] 완벽한, 흠잡을 데 없는"
  },
  {
    "word": "fealty",
    "definition": "[충성] 충성, 충실"
  },
  {
    "word": "feckless",
    "definition": "[무능] 무능한, 무책임한"
  },
  {
    "word": "fecund",
    "definition": "[열매] 다산의, 비옥한"
  },
  {
    "word": "feeble",
    "definition": "[약하다] 연약한, 미약한"
  },
  {
    "word": "feigned",
    "definition": "[가짜] 가장한, 거짓의"
  },
  {
    "word": "false",
    "definition": "[가짜] 가장한, 거짓의"
  },
  {
    "word": "feisty",
    "definition": "[활발하다] 혈기왕성한, 공격적인"
  },
  {
    "word": "feral",
    "definition": "[야생] 야생의, 길들여지지 않은"
  },
  {
    "word": "fervent",
    "definition": "[뜨겁다] 열렬한, 열정적인"
  },
  {
    "word": "fickle",
    "definition": "[변하다] 변덕스러운"
  },
  {
    "word": "fiery",
    "definition": "[불타다] 불같은, 열정적인"
  },
  {
    "word": "impassioned",
    "definition": "[불타다] 불같은, 열정적인"
  },
  {
    "word": "finicky",
    "definition": "[까다롭다] 까다로운"
  },
  {
    "word": "fitting",
    "definition": "[맞다] 적절한, 알맞은"
  },
  {
    "word": "apposite",
    "definition": "[맞다] 적절한, 알맞은"
  },
  {
    "word": "flagging",
    "definition": "[약하다] 쇠약해지는, 시드는"
  },
  {
    "word": "flagrant",
    "definition": "[뚜렷하다] 노골적인, 극악한"
  },
  {
    "word": "flamboyant",
    "definition": "[화려하다] 이색적인, 화려한"
  },
  {
    "word": "flawless",
    "definition": "[흠없다] 완벽한, 흠 없는"
  },
  {
    "word": "flexibility",
    "definition": "[구부리다] 유연성, 융통성"
  },
  {
    "word": "suppleness",
    "definition": "[구부리다] 유연성, 융통성"
  },
  {
    "word": "flippancy",
    "definition": "[가볍다] 경솔, 경박"
  },
  {
    "word": "flippant",
    "definition": "[가볍다] 경박한, 건방진"
  },
  {
    "word": "flourish",
    "definition": "[번성하다] 번창하다, 번성하다"
  },
  {
    "word": "flout",
    "definition": "[얕보다] 무시하다, 어기다"
  },
  {
    "word": "fluctuate",
    "definition": "[흔들다] 변동하다, 오르내리다"
  },
  {
    "word": "flummox",
    "definition": "[혼란] 당황하게 하다"
  },
  {
    "word": "confound",
    "definition": "[혼란] 당황하게 하다"
  },
  {
    "word": "foible",
    "definition": "[약점] 약점, 단점"
  },
  {
    "word": "forage",
    "definition": "[먹을 것 찾다] 먹이를 찾다"
  },
  {
    "word": "forbear",
    "definition": "[참다] 삼가다, 참다"
  },
  {
    "word": "forbidden",
    "definition": "[금하다] 금지된"
  },
  {
    "word": "forebear",
    "definition": "[앞서다] 조상"
  },
  {
    "word": "foreboding",
    "definition": "[예감하다] 불길한 예감"
  },
  {
    "word": "forensic",
    "definition": "[법정] 법의학적인, 법정의"
  },
  {
    "word": "foreordain",
    "definition": "[미리 정하다] 운명짓다, 예정하다"
  },
  {
    "word": "predestine",
    "definition": "[미리 정하다] 운명짓다, 예정하다"
  },
  {
    "word": "forestall",
    "definition": "[미리 막다] 방해하다, 선제적으로 막다"
  },
  {
    "word": "foretell",
    "definition": "[미리 말하다] 예언하다, 예고하다"
  },
  {
    "word": "forge",
    "definition": "[만들다] 위조하다, 구축하다"
  },
  {
    "word": "forgo",
    "definition": "[포기하다] ~없이 지내다, 포기하다"
  },
  {
    "word": "formidable",
    "definition": "[두렵다] 가공할 만한, 만만찮은"
  },
  {
    "word": "formulaic",
    "definition": "[틀] 정형화된, 판에 박힌"
  },
  {
    "word": "fortuitous",
    "definition": "[우연] 우연한, 뜻밖의"
  },
  {
    "word": "accidental",
    "definition": "[우연] 우연한, 뜻밖의"
  },
  {
    "word": "foster",
    "definition": "[기르다] 육성하다, 촉진하다"
  },
  {
    "word": "cultivate",
    "definition": "[기르다] 육성하다, 촉진하다"
  },
  {
    "word": "foster",
    "definition": "[촉진하다] 조장하다, 격려하다"
  },
  {
    "word": "spur",
    "definition": "[촉진하다] 조장하다, 격려하다"
  },
  {
    "word": "fractious",
    "definition": "[다투다] 성마른, 다루기 힘든"
  },
  {
    "word": "restive",
    "definition": "[다투다] 성마른, 다루기 힘든"
  },
  {
    "word": "fractious",
    "definition": "[성마르다] 짜증 잘 내는, 다루기 힘든"
  },
  {
    "word": "fraught",
    "definition": "[가득] 걱정투성이의, (문제로) 가득한"
  },
  {
    "word": "friable",
    "definition": "[부서지다] 잘 부서지는"
  },
  {
    "word": "friendliness",
    "definition": "[친절] 다정함, 친절함"
  },
  {
    "word": "geniality",
    "definition": "[친절] 다정함, 친절함"
  },
  {
    "word": "fringe",
    "definition": "[가] 주변, 비주류"
  },
  {
    "word": "marginal",
    "definition": "[가] 주변, 비주류"
  },
  {
    "word": "frustrating",
    "definition": "[좌절시키다] 답답한, 좌절감을 주는"
  },
  {
    "word": "fungible",
    "definition": "[바꾸다] 대체 가능한"
  },
  {
    "word": "fungible",
    "definition": "[교환하다] 호환 가능한"
  },
  {
    "word": "interchangeable",
    "definition": "[교환하다] 호환 가능한"
  },
  {
    "word": "furtive",
    "definition": "[몰래] 은밀한, 엉큼한"
  },
  {
    "word": "fustian",
    "definition": "[허풍] 과장된, 허풍떠는"
  },
  {
    "word": "pompous",
    "definition": "[허풍] 과장된, 허풍떠는"
  },
  {
    "word": "fusty",
    "definition": "[낡다] 구식의, 케케묵은"
  },
  {
    "word": "outmoded",
    "definition": "[낡다] 구식의, 케케묵은"
  },
  {
    "word": "futility",
    "definition": "[소용없다] 무익, 헛됨"
  },
  {
    "word": "pointlessness",
    "definition": "[소용없다] 무익, 헛됨"
  },
  {
    "word": "gadget",
    "definition": "[도구] 장치, 도구"
  },
  {
    "word": "gainsay",
    "definition": "[부정하다] 반박하다, 부인하다"
  },
  {
    "word": "galling",
    "definition": "[화나다] 짜증나는, 괴로운"
  },
  {
    "word": "galvanize",
    "definition": "[자극하다] 활기를 불어넣다"
  },
  {
    "word": "animate",
    "definition": "[자극하다] 활기를 불어넣다"
  },
  {
    "word": "garble",
    "definition": "[혼란] 왜곡하다, 혼동하다"
  },
  {
    "word": "garner",
    "definition": "[모으다] 얻다, 모으다"
  },
  {
    "word": "garrulous",
    "definition": "[말 많다] 수다스러운"
  },
  {
    "word": "loquacious",
    "definition": "[말 많다] 수다스러운"
  },
  {
    "word": "gauge",
    "definition": "[측정하다] 측정하다, 평가하다"
  },
  {
    "word": "generality",
    "definition": "[일반] 일반론, 개괄"
  },
  {
    "word": "abstraction",
    "definition": "[일반] 일반론, 개괄"
  },
  {
    "word": "generic",
    "definition": "[일반] 일반적인, 포괄적인"
  },
  {
    "word": "inclusive",
    "definition": "[일반] 일반적인, 포괄적인"
  },
  {
    "word": "geniality",
    "definition": "[상냥] 온화함, 친절"
  },
  {
    "word": "genteel",
    "definition": "[고상] 고상한, 품위 있는"
  },
  {
    "word": "germane",
    "definition": "[관련] 적절한, 밀접한"
  },
  {
    "word": "give way to",
    "definition": "[굴복하다] ~에게 양보하다, ~로 대체되다"
  },
  {
    "word": "glean",
    "definition": "[모으다] 모으다, 얻다"
  },
  {
    "word": "collect",
    "definition": "[모으다] 모으다, 얻다"
  },
  {
    "word": "gossamer",
    "definition": "[얇다] 얇은, 섬세한"
  },
  {
    "word": "grandstanding",
    "definition": "[보여주기] 보여주기식 행동"
  },
  {
    "word": "graphically",
    "definition": "[생생하다] 생생하게"
  },
  {
    "word": "vividly",
    "definition": "[생생하다] 생생하게"
  },
  {
    "word": "grateful",
    "definition": "[감사하다] 감사하는"
  },
  {
    "word": "gratify",
    "definition": "[기쁘게 하다] 만족시키다"
  },
  {
    "word": "please",
    "definition": "[기쁘게 하다] 만족시키다"
  },
  {
    "word": "gravitas",
    "definition": "[무게] 진지함, 무게감"
  },
  {
    "word": "gregarious",
    "definition": "[떼 지다] 사교적인, 군거하는"
  },
  {
    "word": "gridlock",
    "definition": "[막힘] 교착 상태"
  },
  {
    "word": "gripping",
    "definition": "[붙잡다] 아주 흥미로운"
  },
  {
    "word": "guarantee",
    "definition": "[보장] 보장하다, 보증"
  },
  {
    "word": "guile",
    "definition": "[속임] 교활, 간계"
  },
  {
    "word": "deviousness",
    "definition": "[속임] 교활, 간계"
  },
  {
    "word": "guzzle",
    "definition": "[벌컥] 마구 들이켜다"
  },
  {
    "word": "hackneyed",
    "definition": "[진부] 진부한, 흔해빠진"
  },
  {
    "word": "haggle",
    "definition": "[값 흥정] 흥정하다, 트집잡다"
  },
  {
    "word": "cavil",
    "definition": "[값 흥정] 흥정하다, 트집잡다"
  },
  {
    "word": "hailed",
    "definition": "[칭송] 칭송받는"
  },
  {
    "word": "acclaimed",
    "definition": "[칭송] 칭송받는"
  },
  {
    "word": "halfhearted",
    "definition": "[열의 부족] 내키지 않는, 성의 없는"
  },
  {
    "word": "hallow",
    "definition": "[거룩히 하다] 신성시하다, 존경하다"
  },
  {
    "word": "respect",
    "definition": "[거룩히 하다] 신성시하다, 존경하다"
  },
  {
    "word": "hallow",
    "definition": "[바치다] 신성하게 하다"
  },
  {
    "word": "consecrate",
    "definition": "[바치다] 신성하게 하다"
  },
  {
    "word": "hamper",
    "definition": "[방해하다] 방해하다, 제한하다"
  },
  {
    "word": "impede",
    "definition": "[방해하다] 방해하다, 제한하다"
  },
  {
    "word": "hamstring",
    "definition": "[절름발이] 손상시키다, 무력화하다"
  },
  {
    "word": "impair",
    "definition": "[절름발이] 손상시키다, 무력화하다"
  },
  {
    "word": "haphazard",
    "definition": "[되는대로] 무계획적인"
  },
  {
    "word": "harbinger",
    "definition": "[앞서다] 전조, 예고"
  },
  {
    "word": "herald",
    "definition": "[앞서다] 전조, 예고"
  },
  {
    "word": "harbor",
    "definition": "[품다] 품다, 피난처 제공하다"
  },
  {
    "word": "hard-pressed",
    "definition": "[곤란] 쪼들리는, 곤란한"
  },
  {
    "word": "hardy",
    "definition": "[강하다] 강건한, 튼튼한"
  },
  {
    "word": "harmless",
    "definition": "[해 없다] 무해한"
  },
  {
    "word": "innocuous",
    "definition": "[해 없다] 무해한"
  },
  {
    "word": "haughty",
    "definition": "[거만] 오만한, 거만한"
  },
  {
    "word": "headway",
    "definition": "[전진] 진전, 진보"
  },
  {
    "word": "heartless",
    "definition": "[냉혹] 무자비한, 매정한"
  },
  {
    "word": "callous",
    "definition": "[냉혹] 무자비한, 매정한"
  },
  {
    "word": "hectic",
    "definition": "[바쁘다] 정신없이 바쁜"
  },
  {
    "word": "hegemony",
    "definition": "[지배] 패권, 주도권"
  },
  {
    "word": "hermetic",
    "definition": "[밀폐] 밀봉된, 난해한"
  },
  {
    "word": "heterogeneous",
    "definition": "[다르다] 이질적인"
  },
  {
    "word": "disparate",
    "definition": "[다르다] 이질적인"
  },
  {
    "word": "heterogeneous",
    "definition": "[다르다] 서로 다른, 이질적인"
  },
  {
    "word": "dissimilar",
    "definition": "[다르다] 서로 다른, 이질적인"
  },
  {
    "word": "hew to=conform",
    "definition": "[따르다] 준수하다, 따르다"
  },
  {
    "word": "hierarchical",
    "definition": "[층] 계층적인"
  },
  {
    "word": "stratified",
    "definition": "[층] 계층적인"
  },
  {
    "word": "high-handed",
    "definition": "[억압] 독단적인, 고-handed한"
  },
  {
    "word": "hinder",
    "definition": "[막다] 방해하다"
  },
  {
    "word": "hindrance",
    "definition": "[방해] 방해, 장애"
  },
  {
    "word": "handicap",
    "definition": "[방해] 방해, 장애"
  },
  {
    "word": "historic",
    "definition": "[역사적] 역사상 중요한"
  },
  {
    "word": "historical",
    "definition": "[역사에 관한] 역사적인"
  },
  {
    "word": "hitch",
    "definition": "[걸림] 문제, 장애"
  },
  {
    "word": "snag",
    "definition": "[걸림] 문제, 장애"
  },
  {
    "word": "hodgepodge",
    "definition": "[뒤섞음] 잡동사니, 뒤범벅"
  },
  {
    "word": "patchwork",
    "definition": "[뒤섞음] 잡동사니, 뒤범벅"
  },
  {
    "word": "homogeneity",
    "definition": "[같음] 동질성"
  },
  {
    "word": "resemblance",
    "definition": "[같음] 동질성"
  },
  {
    "word": "homogenous",
    "definition": "[같다] 동일한, 동질의"
  },
  {
    "word": "hone",
    "definition": "[갈다] 연마하다, 개선하다"
  },
  {
    "word": "enhance",
    "definition": "[갈다] 연마하다, 개선하다"
  },
  {
    "word": "honorific",
    "definition": "[존경] 존칭의, 존경을 나타내는"
  },
  {
    "word": "hortatory",
    "definition": "[권하다] 권고의, 충고하는"
  },
  {
    "word": "hostility",
    "definition": "[적대] 적의, 적대감"
  },
  {
    "word": "hubris",
    "definition": "[오만] 자만심"
  },
  {
    "word": "hubristic",
    "definition": "[오만] 거만한, 자만하는"
  },
  {
    "word": "arrogant",
    "definition": "[오만] 거만한, 자만하는"
  },
  {
    "word": "humble",
    "definition": "[낮추다] 겸손한"
  },
  {
    "word": "humdrum",
    "definition": "[단조] 단조로운, 지루한"
  },
  {
    "word": "hypocrisy",
    "definition": "[가식] 위선"
  },
  {
    "word": "hypothesis",
    "definition": "[가정하다] 가설"
  },
  {
    "word": "iconoclastic",
    "definition": "[우상타파] 인습타파적인"
  },
  {
    "word": "idiosyncratic",
    "definition": "[특이하다] 특이한, 개성 있는"
  },
  {
    "word": "ignore",
    "definition": "[무시하다] 무시하다, 간과하다"
  },
  {
    "word": "overlook",
    "definition": "[무시하다] 무시하다, 간과하다"
  },
  {
    "word": "illegitimate",
    "definition": "[불법] 불법의, 합법적이지 않은"
  },
  {
    "word": "imbibe",
    "definition": "[마시다] 흡수하다, 마시다"
  },
  {
    "word": "quaff",
    "definition": "[마시다] 흡수하다, 마시다"
  },
  {
    "word": "immense",
    "definition": "[큰] 거대한, 막대한"
  },
  {
    "word": "immobilize",
    "definition": "[움직임 X] 움직이지 못하게 하다"
  },
  {
    "word": "impassionate",
    "definition": "[열정적] 감정이 가득한"
  },
  {
    "word": "impassive",
    "definition": "[느낌 X] 무표정한, 무감정의"
  },
  {
    "word": "impeccable",
    "definition": "[흠없다] 결점 없는, 완벽한"
  },
  {
    "word": "impecunious",
    "definition": "[가난] 가난한"
  },
  {
    "word": "indigent",
    "definition": "[가난] 가난한"
  },
  {
    "word": "impediment",
    "definition": "[방해] 장애, 방해물"
  },
  {
    "word": "impenetrable",
    "definition": "[뚫리지 X] 이해할 수 없는, 꿰뚫을 수 없는"
  },
  {
    "word": "imperial",
    "definition": "[제국] 제국의, 황제의"
  },
  {
    "word": "imperil",
    "definition": "[위험] 위태롭게 하다"
  },
  {
    "word": "imperious",
    "definition": "[군림하다] 오만한, 고압적인"
  },
  {
    "word": "dictatorial",
    "definition": "[군림하다] 오만한, 고압적인"
  },
  {
    "word": "impermeable",
    "definition": "[스며들지 X] 불침투성의"
  },
  {
    "word": "impertinence",
    "definition": "[버릇없음] 건방짐, 무례"
  },
  {
    "word": "imperturbability",
    "definition": "[동요X] 침착성, 냉정함"
  },
  {
    "word": "imperturbable",
    "definition": "[흔들리지 않음] 동요하지 않는, 차분한"
  },
  {
    "word": "impervious",
    "definition": "[뚫리지 않다] 영향을 받지 않는"
  },
  {
    "word": "impetuous",
    "definition": "[성급] 성급한, 충동적인"
  },
  {
    "word": "implacable",
    "definition": "[달래지지 않음] 완강한, 달랠 수 없는"
  },
  {
    "word": "unyielding",
    "definition": "[달래지지 않음] 완강한, 달랠 수 없는"
  },
  {
    "word": "implausible",
    "definition": "[그럴듯하지 않음] 믿기 힘든"
  },
  {
    "word": "imprecise",
    "definition": "[정확X] 부정확한"
  },
  {
    "word": "improbable",
    "definition": "[가능성 낮음] 있을 법하지 않은"
  },
  {
    "word": "unlikely",
    "definition": "[가능성 낮음] 있을 법하지 않은"
  },
  {
    "word": "impugn",
    "definition": "[공격하다] 공격하다, 의문을 제기하다"
  },
  {
    "word": "impulsive",
    "definition": "[충동] 충동적인"
  },
  {
    "word": "in retrospect",
    "definition": "[돌아보다] 회상해보면"
  },
  {
    "word": "inaccessible",
    "definition": "[닿기 X] 접근할 수 없는, 난해한"
  },
  {
    "word": "opaque",
    "definition": "[닿기 X] 접근할 수 없는, 난해한"
  },
  {
    "word": "inborn",
    "definition": "[타고나다] 선천적인"
  },
  {
    "word": "innate",
    "definition": "[타고나다] 선천적인"
  },
  {
    "word": "inchoate",
    "definition": "[시작] 초기의, 미발달의"
  },
  {
    "word": "rudimentary",
    "definition": "[시작] 초기의, 미발달의"
  },
  {
    "word": "incipient",
    "definition": "[시작] 초기의, 발단의"
  },
  {
    "word": "incisive",
    "definition": "[날카로운] 예리한, 통렬한"
  },
  {
    "word": "incongruous",
    "definition": "[어울리지 않음] 부조화의, 모순된"
  },
  {
    "word": "inconsequential",
    "definition": "[사소하다] 사소한, 하찮은"
  },
  {
    "word": "trivial",
    "definition": "[사소하다] 사소한, 하찮은"
  },
  {
    "word": "inconsequentially",
    "definition": "[사소하게] 중요치 않게"
  },
  {
    "word": "incorruptibility",
    "definition": "[썩지 않음] 청렴, 부패하지 않음"
  },
  {
    "word": "incremental",
    "definition": "[조금씩] 점진적인"
  },
  {
    "word": "incriminate",
    "definition": "[죄 뒤집어씌움] 죄를 씌우다"
  },
  {
    "word": "indefatigable",
    "definition": "[지치지 않음] 지칠 줄 모르는"
  },
  {
    "word": "indifferent",
    "definition": "[관심 없음] 무관심한"
  },
  {
    "word": "indigenous",
    "definition": "[원산] 토착의, 원시의"
  },
  {
    "word": "indigent",
    "definition": "[가난] 가난한, 궁핍한"
  },
  {
    "word": "indirect",
    "definition": "[빗겨] 간접적인, 우회하는"
  },
  {
    "word": "circuitous",
    "definition": "[빗겨] 간접적인, 우회하는"
  },
  {
    "word": "indispensable",
    "definition": "[없을 수 없음] 필수적인"
  },
  {
    "word": "indolence",
    "definition": "[게으름] 나태, 게으름"
  },
  {
    "word": "indubitable",
    "definition": "[의심X] 의심할 여지 없는"
  },
  {
    "word": "inductive",
    "definition": "[이끌다] 귀납적인"
  },
  {
    "word": "indulge",
    "definition": "[빠져들다] 탐닉하다, 만족시키다"
  },
  {
    "word": "industrious",
    "definition": "[부지런] 근면한, 부지런한"
  },
  {
    "word": "inept",
    "definition": "[서투르다] 서투른, 부적절한"
  },
  {
    "word": "ineptitude",
    "definition": "[부적절] 서투름, 무능"
  },
  {
    "word": "inert",
    "definition": "[움직이지 않음] 기력이 없는, 둔한"
  },
  {
    "word": "inertial",
    "definition": "[관성] 관성의"
  },
  {
    "word": "inexplicable",
    "definition": "[설명X] 설명할 수 없는"
  },
  {
    "word": "incomprehensible",
    "definition": "[설명X] 설명할 수 없는"
  },
  {
    "word": "infatuate",
    "definition": "[반하다] 열중하게 하다"
  },
  {
    "word": "infeasible",
    "definition": "[불가능] 실행 불가능한"
  },
  {
    "word": "infelicitous",
    "definition": "[부적절] 부적절한, 안 맞는"
  },
  {
    "word": "inferable",
    "definition": "[추론 가능한] 추론할 수 있는"
  },
  {
    "word": "entailed",
    "definition": "[추론 가능한] 추론할 수 있는"
  },
  {
    "word": "inflammatory",
    "definition": "[불타다] 선동적인, 격앙시키는"
  },
  {
    "word": "provocative",
    "definition": "[불타다] 선동적인, 격앙시키는"
  },
  {
    "word": "ingenious",
    "definition": "[솜씨] 독창적인, 영리한"
  },
  {
    "word": "ingenuous",
    "definition": "[순수] 순진한, 솔직한"
  },
  {
    "word": "ingrained",
    "definition": "[깊이 뿌리] 뿌리 깊은, 깊이 박힌"
  },
  {
    "word": "inherent",
    "definition": "[내재] 타고난, 내재된"
  },
  {
    "word": "inhibit",
    "definition": "[막다] 억제하다, 억누르다"
  },
  {
    "word": "inimical",
    "definition": "[적대] 해로운, 적대적인"
  },
  {
    "word": "injudicious",
    "definition": "[분별 없음] 경솔한, 무분별한"
  },
  {
    "word": "innocuous",
    "definition": "[해 없다] 무해한, 순한"
  },
  {
    "word": "inscrutable",
    "definition": "[알 수 없음] 불가해한, 이해할 수 없는"
  },
  {
    "word": "insipid",
    "definition": "[맛 없음] 재미없는, 김 빠진"
  },
  {
    "word": "insist",
    "definition": "[주장하다] 주장하다, 고집하다"
  },
  {
    "word": "insolent",
    "definition": "[무례] 무례한, 버릇없는"
  },
  {
    "word": "insolvency",
    "definition": "[파산] 지급 불능"
  },
  {
    "word": "insouciance",
    "definition": "[걱정 없음] 태평스러움, 무관심"
  },
  {
    "word": "instigate",
    "definition": "[촉발하다] 부추기다, 선동하다"
  },
  {
    "word": "insufficient",
    "definition": "[부족] 불충분한"
  },
  {
    "word": "meager",
    "definition": "[부족] 불충분한"
  },
  {
    "word": "insular",
    "definition": "[섬] 섬의, 배타적인"
  },
  {
    "word": "insulate",
    "definition": "[떼어놓다] 격리하다, 보호하다"
  },
  {
    "word": "intangible",
    "definition": "[만질 수 없음] 무형의, 불가해한"
  },
  {
    "word": "integrity",
    "definition": "[전체성] 진실성, 고결함"
  },
  {
    "word": "intelligible",
    "definition": "[이해 가능] 이해할 수 있는"
  },
  {
    "word": "readable",
    "definition": "[이해 가능] 이해할 수 있는"
  },
  {
    "word": "intensify",
    "definition": "[강화하다] 강화하다, 심화하다"
  },
  {
    "word": "interchangeable",
    "definition": "[바꿀 수 있음] 교환 가능한"
  },
  {
    "word": "interminable",
    "definition": "[끝 없음] 끝없이 계속되는"
  },
  {
    "word": "intervene",
    "definition": "[사이 들어감] 개입하다, 끼어들다"
  },
  {
    "word": "intractable",
    "definition": "[다루기 힘든] 고집 센, 난치의"
  },
  {
    "word": "stubborn",
    "definition": "[다루기 힘든] 고집 센, 난치의"
  },
  {
    "word": "intransigence",
    "definition": "[타협 않음] 비타협적인 성질"
  },
  {
    "word": "obduracy",
    "definition": "[타협 않음] 비타협적인 성질"
  },
  {
    "word": "intransigent",
    "definition": "[타협 않음] 비타협적인, 완강한"
  },
  {
    "word": "intricate",
    "definition": "[얽히다] 복잡한, 난해한"
  },
  {
    "word": "convoluted",
    "definition": "[얽히다] 복잡한, 난해한"
  },
  {
    "word": "intriguing",
    "definition": "[흥미] 흥미로운, 매력적인"
  },
  {
    "word": "intrinsically",
    "definition": "[본질] 본질적으로"
  },
  {
    "word": "intuitive",
    "definition": "[직관] 직관적인"
  },
  {
    "word": "inured",
    "definition": "[익숙] 익숙해진, 단련된"
  },
  {
    "word": "inveigle",
    "definition": "[꾀다] 감언이설로 속이다"
  },
  {
    "word": "invigorate",
    "definition": "[활기] 활기를 주다"
  },
  {
    "word": "energize",
    "definition": "[활기] 활기를 주다"
  },
  {
    "word": "invulnerable",
    "definition": "[상처X] 상처 입지 않는, 안전한"
  },
  {
    "word": "irascibility",
    "definition": "[화냄] 성 잘냄, 화"
  },
  {
    "word": "exasperation",
    "definition": "[화냄] 성 잘냄, 화"
  },
  {
    "word": "irascible",
    "definition": "[성내다] 성급한, 화 잘내는"
  },
  {
    "word": "irritable",
    "definition": "[성내다] 성급한, 화 잘내는"
  },
  {
    "word": "irk",
    "definition": "[짜증] 짜증나게 하다, 귀찮게 하다"
  },
  {
    "word": "ironically",
    "definition": "[역설] 역설적으로, 반어적으로"
  },
  {
    "word": "paradoxically",
    "definition": "[역설] 역설적으로, 반어적으로"
  },
  {
    "word": "irrelevant",
    "definition": "[관련X] 무관한"
  },
  {
    "word": "extraneous",
    "definition": "[관련X] 무관한"
  },
  {
    "word": "irresolute",
    "definition": "[결심X] 우유부단한"
  },
  {
    "word": "itinerant",
    "definition": "[돌아다님] 순회하는, 떠돌아다니는"
  },
  {
    "word": "jargon",
    "definition": "[전문용어] 특수 용어, 은어"
  },
  {
    "word": "jarring",
    "definition": "[거슬림] 불쾌한, 부조화의"
  },
  {
    "word": "jaundice",
    "definition": "[편견] 편견, 황달"
  },
  {
    "word": "jejune",
    "definition": "[무미건조] 단조로운, 재미없는"
  },
  {
    "word": "vapid",
    "definition": "[무미건조] 단조로운, 재미없는"
  },
  {
    "word": "jettison",
    "definition": "[버리다] 버리다, 투하하다"
  },
  {
    "word": "jibe with",
    "definition": "[일치하다] 조화되다, 일치하다"
  },
  {
    "word": "agree with",
    "definition": "[일치하다] 조화되다, 일치하다"
  },
  {
    "word": "judicious",
    "definition": "[현명] 현명한, 신중한"
  },
  {
    "word": "juxtaposition",
    "definition": "[나란히 둠] 병치, 병렬"
  },
  {
    "word": "keep ~ at bay",
    "definition": "[저지] ~을 막다, 접근 못하게 하다"
  },
  {
    "word": "kindred",
    "definition": "[혈연] 친척의, 비슷한"
  },
  {
    "word": "knotty",
    "definition": "[얽히다] 복잡한, 어려운"
  },
  {
    "word": "labyrinth",
    "definition": "[미궁] 미로, 복잡한 상황"
  },
  {
    "word": "laconic",
    "definition": "[간결] 간결한, 말이 적은"
  },
  {
    "word": "taciturn",
    "definition": "[간결] 간결한, 말이 적은"
  },
  {
    "word": "laissez faire",
    "definition": "[간섭 않음] 자유방임주의의"
  },
  {
    "word": "lambaste",
    "definition": "[매질/비난] 강하게 비난하다, 매질하다"
  },
  {
    "word": "lament",
    "definition": "[슬퍼하다] 애도하다, 한탄하다"
  },
  {
    "word": "lampoon",
    "definition": "[풍자] 풍자하다, 조롱하다"
  },
  {
    "word": "languish",
    "definition": "[쇠약해지다] 시들다, 활기를 잃다"
  },
  {
    "word": "lapse",
    "definition": "[미끄러지다] (시간) 경과, 잘못, 쇠퇴"
  },
  {
    "word": "largesse",
    "definition": "[아낌없이 줌] 후함, 아량"
  },
  {
    "word": "lascivious",
    "definition": "[음탕] 음탕한, 호색적인"
  },
  {
    "word": "lassitude",
    "definition": "[피곤] 무기력, 나른함"
  },
  {
    "word": "laud",
    "definition": "[칭송] 칭찬하다"
  },
  {
    "word": "extol",
    "definition": "[칭송] 칭찬하다"
  },
  {
    "word": "leeway",
    "definition": "[여유] 여지, 자유"
  },
  {
    "word": "legitimacy",
    "definition": "[합법] 합법성, 정당성"
  },
  {
    "word": "legitimize",
    "definition": "[정당화] 합법화하다, 정당화하다"
  },
  {
    "word": "lenient",
    "definition": "[관대] 관대한, 관용적인"
  },
  {
    "word": "lethargic",
    "definition": "[졸림] 무기력한, 혼수상태의"
  },
  {
    "word": "slumberous",
    "definition": "[졸림] 무기력한, 혼수상태의"
  },
  {
    "word": "leveling",
    "definition": "[평평] 평준화, 평등화"
  },
  {
    "word": "levy",
    "definition": "[징수] 세금 부과, 징수"
  },
  {
    "word": "limited",
    "definition": "[제한] 제한된, 부족한"
  },
  {
    "word": "scant",
    "definition": "[제한] 제한된, 부족한"
  },
  {
    "word": "limiting",
    "definition": "[제한] 제한하는, 억제하는"
  },
  {
    "word": "confining",
    "definition": "[제한] 제한하는, 억제하는"
  },
  {
    "word": "limpid",
    "definition": "[맑다] 투명한, 맑은"
  },
  {
    "word": "pellucid",
    "definition": "[맑다] 투명한, 맑은"
  },
  {
    "word": "list",
    "definition": "[기울다] 기울다, 한쪽으로 치우치다"
  },
  {
    "word": "tilt",
    "definition": "[기울다] 기울다, 한쪽으로 치우치다"
  },
  {
    "word": "listless",
    "definition": "[무기력] 무기력한, 활기 없는"
  },
  {
    "word": "livid",
    "definition": "[격노] 격노한, 창백한"
  },
  {
    "word": "loathe",
    "definition": "[혐오] 몹시 싫어하다"
  },
  {
    "word": "lopsided",
    "definition": "[한쪽] 불균형한, 치우친"
  },
  {
    "word": "loquacious",
    "definition": "[수다] 수다스러운"
  },
  {
    "word": "lucidity",
    "definition": "[명료] 명료함, 투명함"
  },
  {
    "word": "clarity",
    "definition": "[명료] 명료함, 투명함"
  },
  {
    "word": "lucrative",
    "definition": "[이익] 수익성 있는"
  },
  {
    "word": "ludicrous",
    "definition": "[우스꽝] 터무니없는, 웃기는"
  },
  {
    "word": "risible",
    "definition": "[우스꽝] 터무니없는, 웃기는"
  },
  {
    "word": "lugubrious",
    "definition": "[슬픔] 침울한, 우울한"
  },
  {
    "word": "gloomy",
    "definition": "[슬픔] 침울한, 우울한"
  },
  {
    "word": "lull",
    "definition": "[잠잠] 잠잠해지다, 잠시 중단"
  },
  {
    "word": "respite",
    "definition": "[잠잠] 잠잠해지다, 잠시 중단"
  },
  {
    "word": "luminous",
    "definition": "[빛나다] 빛나는, 이해하기 쉬운"
  },
  {
    "word": "lurch",
    "definition": "[휘청] 휘청거리다"
  },
  {
    "word": "lure",
    "definition": "[유혹] 유혹하다, 꾀다"
  },
  {
    "word": "lurid",
    "definition": "[섬뜩] 끔찍한, 선정적인"
  },
  {
    "word": "luxuriant",
    "definition": "[무성] 무성한, 풍부한"
  },
  {
    "word": "rampant",
    "definition": "[무성] 무성한, 풍부한"
  },
  {
    "word": "macabre",
    "definition": "[섬뜩] 괴기스러운, 섬뜩한"
  },
  {
    "word": "magnanimity",
    "definition": "[관대] 아량, 관대함"
  },
  {
    "word": "mainstay",
    "definition": "[버팀목] 주요 의지물, 중심"
  },
  {
    "word": "maintain",
    "definition": "[지속] 유지하다, 주장하다"
  },
  {
    "word": "make known",
    "definition": "[알리다] 공표하다, 알리다"
  },
  {
    "word": "maladroit",
    "definition": "[서투르다] 서투른, 어색한"
  },
  {
    "word": "malady",
    "definition": "[병] 질환, 병폐"
  },
  {
    "word": "malfeasance",
    "definition": "[위법] 불법행위, 비리"
  },
  {
    "word": "fraudulence",
    "definition": "[위법] 불법행위, 비리"
  },
  {
    "word": "malign",
    "definition": "[비방] 비방하다, 해로운"
  },
  {
    "word": "malleable",
    "definition": "[두들기다] 잘 변하는, 유순한"
  },
  {
    "word": "malodorous",
    "definition": "[악취] 악취 나는"
  },
  {
    "word": "noisome",
    "definition": "[악취] 악취 나는"
  },
  {
    "word": "maneuver",
    "definition": "[움직이다] 책략, 조종하다"
  },
  {
    "word": "manifest [v]",
    "definition": "[드러내다] 나타내다, 분명히 하다"
  },
  {
    "word": "reveal",
    "definition": "[드러내다] 나타내다, 분명히 하다"
  },
  {
    "word": "manifest[adj]",
    "definition": "[분명] 뚜렷한, 명백한"
  },
  {
    "word": "self-evident",
    "definition": "[분명] 뚜렷한, 명백한"
  },
  {
    "word": "manifestation",
    "definition": "[나타남] 표현, 징후"
  },
  {
    "word": "manipulation",
    "definition": "[조종] 조작, 조종"
  },
  {
    "word": "marginal",
    "definition": "[가] 주변의, 중요치 않은"
  },
  {
    "word": "peripheral",
    "definition": "[가] 주변의, 중요치 않은"
  },
  {
    "word": "maturity",
    "definition": "[성숙] 성숙, 성숙함"
  },
  {
    "word": "precociousness",
    "definition": "[성숙] 성숙, 성숙함"
  },
  {
    "word": "maverick",
    "definition": "[독불장군] 개성이 강한 사람"
  },
  {
    "word": "nonconformist",
    "definition": "[독불장군] 개성이 강한 사람"
  },
  {
    "word": "meager",
    "definition": "[부족] 빈약한, 불충분한"
  },
  {
    "word": "meddlesome",
    "definition": "[참견] 참견하기 좋아하는"
  },
  {
    "word": "mediocre",
    "definition": "[평범] 보통의, 이류의"
  },
  {
    "word": "melancholy",
    "definition": "[슬픔] 우울한, 우울"
  },
  {
    "word": "meliorate",
    "definition": "[개선] 개선하다"
  },
  {
    "word": "mellow",
    "definition": "[온화] 부드러운, 온화한"
  },
  {
    "word": "mendacious",
    "definition": "[거짓] 거짓의, 허위의"
  },
  {
    "word": "mercenary",
    "definition": "[고용] 용병, 돈만 바라는"
  },
  {
    "word": "meretricious",
    "definition": "[겉치레] 겉만 번지르르한"
  },
  {
    "word": "meticulous",
    "definition": "[세심] 꼼꼼한, 세심한"
  },
  {
    "word": "thorough",
    "definition": "[세심] 꼼꼼한, 세심한"
  },
  {
    "word": "meticulous",
    "definition": "[세심] 정밀한, 꼼꼼한"
  },
  {
    "word": "minimal",
    "definition": "[최소] 최소의, 사소한"
  },
  {
    "word": "trifling",
    "definition": "[최소] 최소의, 사소한"
  },
  {
    "word": "minion",
    "definition": "[부하] 아랫사람, 졸개"
  },
  {
    "word": "miniscule",
    "definition": "[작다] 극소의"
  },
  {
    "word": "miscellaneous",
    "definition": "[섞이다] 잡다한, 여러 가지의"
  },
  {
    "word": "misconstrue",
    "definition": "[오해하다] 오해하다, 잘못 해석하다"
  },
  {
    "word": "misgivings",
    "definition": "[걱정] 불안, 의혹"
  },
  {
    "word": "apprehension,trepidation",
    "definition": "[걱정] 불안, 의혹"
  },
  {
    "word": "misguided",
    "definition": "[그릇되다] 잘못 인도된, 오도된"
  },
  {
    "word": "mishandled",
    "definition": "[잘못 다룸] 잘못 관리된, 처리된"
  },
  {
    "word": "mitigate",
    "definition": "[약화하다] 완화하다, 줄이다"
  },
  {
    "word": "mitigate",
    "definition": "[줄이다] 경감하다, 약화시키다"
  },
  {
    "word": "abate",
    "definition": "[줄이다] 경감하다, 약화시키다"
  },
  {
    "word": "mixed",
    "definition": "[섞이다] 혼합된, 모순된"
  },
  {
    "word": "inconsistent",
    "definition": "[섞이다] 혼합된, 모순된"
  },
  {
    "word": "mnemonic",
    "definition": "[기억] 기억을 돕는, 암기법"
  },
  {
    "word": "mock",
    "definition": "[조롱] 흉내내다, 조롱하다"
  },
  {
    "word": "mockery",
    "definition": "[조롱] 조롱, 흉내"
  },
  {
    "word": "derision",
    "definition": "[조롱] 조롱, 흉내"
  },
  {
    "word": "modern",
    "definition": "[새롭다] 현대의, 최첨단의"
  },
  {
    "word": "advanced",
    "definition": "[새롭다] 현대의, 최첨단의"
  },
  {
    "word": "modest",
    "definition": "[겸손] 겸손한, 적당한"
  },
  {
    "word": "mollified",
    "definition": "[달래다] 누그러진, 완화된"
  },
  {
    "word": "momentary",
    "definition": "[순간] 순간적인, 덧없는"
  },
  {
    "word": "evanescent",
    "definition": "[순간] 순간적인, 덧없는"
  },
  {
    "word": "monolithic",
    "definition": "[하나로] 획일적인, 거대한"
  },
  {
    "word": "monotonous",
    "definition": "[단조] 단조로운, 지루한"
  },
  {
    "word": "moribund",
    "definition": "[죽음] 소멸 직전의, 죽어가는"
  },
  {
    "word": "morose",
    "definition": "[우울] 시무룩한, 뚱한"
  },
  {
    "word": "muffle",
    "definition": "[덮다] 소리를 죽이다, 감싸다"
  },
  {
    "word": "muffled로 줄제",
    "definition": "[덮다] 소리를 죽이다, 감싸다"
  },
  {
    "word": "multidimensional",
    "definition": "[다차원] 다차원의"
  },
  {
    "word": "multifaceted",
    "definition": "[다면] 다면적인, 다양한 측면의"
  },
  {
    "word": "mundane",
    "definition": "[세속] 평범한, 일상적인"
  },
  {
    "word": "murky",
    "definition": "[어둡다] 어두운, 애매한"
  },
  {
    "word": "mutable",
    "definition": "[변화] 변하기 쉬운"
  },
  {
    "word": "nadir",
    "definition": "[밑바닥] 최저점"
  },
  {
    "word": "naïve",
    "definition": "[순진] 순진한, 세상물정 모르는"
  },
  {
    "word": "unsophisticated",
    "definition": "[순진] 순진한, 세상물정 모르는"
  },
  {
    "word": "naivete",
    "definition": "[순수] 순진, 천진함"
  },
  {
    "word": "nascent",
    "definition": "[태어남] 발생기의, 초기의"
  },
  {
    "word": "naysay",
    "definition": "[거부] 반대하다, 부정하다"
  },
  {
    "word": "nebulous",
    "definition": "[흐리다] 흐릿한, 모호한"
  },
  {
    "word": "vague",
    "definition": "[흐리다] 흐릿한, 모호한"
  },
  {
    "word": "nefarious",
    "definition": "[사악] 사악한, 불길한"
  },
  {
    "word": "negligence",
    "definition": "[소홀] 부주의, 태만"
  },
  {
    "word": "negligible",
    "definition": "[무시 가능] 하찮은, 사소한"
  },
  {
    "word": "neophyte",
    "definition": "[새싹] 초심자, 신참"
  },
  {
    "word": "nepotistic",
    "definition": "[족벌] 족벌주의적인, 연줄만 믿는"
  },
  {
    "word": "nitpicking",
    "definition": "[트집] 사소한 것에 집착하는"
  },
  {
    "word": "nobility",
    "definition": "[고귀함] 귀족, 고귀"
  },
  {
    "word": "noisome",
    "definition": "[악취] 불쾌한, 악취나는"
  },
  {
    "word": "nomadic",
    "definition": "[떠돌이] 유목의, 방랑하는"
  },
  {
    "word": "itinerant",
    "definition": "[떠돌이] 유목의, 방랑하는"
  },
  {
    "word": "nonconformist",
    "definition": "[비순응] 비순응자, 독립적인 사람"
  },
  {
    "word": "nondescript",
    "definition": "[특색 없음] 평범한, 특징 없는"
  },
  {
    "word": "not fail to",
    "definition": "[반드시] 반드시 ~하다"
  },
  {
    "word": "notwithstanding",
    "definition": "[그러나] ~에도 불구하고"
  },
  {
    "word": "novel",
    "definition": "[새롭다] 새로운, 참신한"
  },
  {
    "word": "original",
    "definition": "[새롭다] 새로운, 참신한"
  },
  {
    "word": "novelty",
    "definition": "[새로움] 새로움, 신기함"
  },
  {
    "word": "novice",
    "definition": "[초보] 초보자"
  },
  {
    "word": "tyro",
    "definition": "[초보] 초보자"
  },
  {
    "word": "nugatory",
    "definition": "[쓸모없다] 무가치한"
  },
  {
    "word": "numinous",
    "definition": "[신비] 신비한, 영적인"
  },
  {
    "word": "occult",
    "definition": "[신비] 신비한, 영적인"
  },
  {
    "word": "nurture",
    "definition": "[기르다] 양육하다, 육성하다"
  },
  {
    "word": "obedience",
    "definition": "[복종] 복종, 순종"
  },
  {
    "word": "obeisance",
    "definition": "[절하다] 존경, 경의"
  },
  {
    "word": "obfuscate",
    "definition": "[흐리다] 모호하게 하다, 애매하게 하다"
  },
  {
    "word": "obscure",
    "definition": "[흐리다] 모호하게 하다, 애매하게 하다"
  },
  {
    "word": "obfuscatory",
    "definition": "[흐리다] 혼란스럽게 하는"
  },
  {
    "word": "obligate",
    "definition": "[강제하다] 의무 지우다"
  },
  {
    "word": "oblivious",
    "definition": "[잊다] 의식하지 못하는, 잘 잊는"
  },
  {
    "word": "obscuring",
    "definition": "[가리다] 희미하게 하는, 모호하게 하는"
  },
  {
    "word": "obsequious",
    "definition": "[아첨] 아부하는"
  },
  {
    "word": "sycophantic",
    "definition": "[아첨] 아부하는"
  },
  {
    "word": "obsolete",
    "definition": "[낡다] 구식의, 폐물의"
  },
  {
    "word": "outmoded",
    "definition": "[낡다] 구식의, 폐물의"
  },
  {
    "word": "obstreperous",
    "definition": "[시끄럽다] 떠들썩한, 제어하기 힘든"
  },
  {
    "word": "obtain",
    "definition": "[얻다] 얻다, 취득하다"
  },
  {
    "word": "glean",
    "definition": "[얻다] 얻다, 취득하다"
  },
  {
    "word": "obtrusive",
    "definition": "[불쑥 나타나다] 보기 싫게 눈에 띄는"
  },
  {
    "word": "obtuse",
    "definition": "[둔하다] 둔감한, 무딘"
  },
  {
    "word": "obviate",
    "definition": "[제거하다] 제거하다, 미리 막다"
  },
  {
    "word": "occlude",
    "definition": "[닫다] 막다, 차단하다"
  },
  {
    "word": "officious",
    "definition": "[참견] 참견하는, 거들먹거리는"
  },
  {
    "word": "offset",
    "definition": "[상쇄] 상쇄하다, 보상하다"
  },
  {
    "word": "ominous",
    "definition": "[불길하다] 불길한"
  },
  {
    "word": "inauspicious",
    "definition": "[불길하다] 불길한"
  },
  {
    "word": "omnipresent",
    "definition": "[어디든지] 편재하는, 어디에나 있는"
  },
  {
    "word": "universal",
    "definition": "[어디든지] 편재하는, 어디에나 있는"
  },
  {
    "word": "omniscient",
    "definition": "[모든 것을 알다] 전지의"
  },
  {
    "word": "on a par with~",
    "definition": "[동등] ~와 동등한"
  },
  {
    "word": "onerous",
    "definition": "[짐] 부담스러운, 힘든"
  },
  {
    "word": "onset",
    "definition": "[시작] 시작, 발발"
  },
  {
    "word": "opaque",
    "definition": "[불투명] 불투명한, 이해하기 힘든"
  },
  {
    "word": "opportunism",
    "definition": "[기회주의] 기회주의"
  },
  {
    "word": "oppositional",
    "definition": "[반대] 반대하는, 대립하는"
  },
  {
    "word": "opprobrious",
    "definition": "[모욕] 모욕적인, 창피한"
  },
  {
    "word": "opprobrium",
    "definition": "[비난] 불명예, 비난"
  },
  {
    "word": "disdain",
    "definition": "[비난] 불명예, 비난"
  },
  {
    "word": "order",
    "definition": "[질서] 질서, 안정"
  },
  {
    "word": "stability",
    "definition": "[질서] 질서, 안정"
  },
  {
    "word": "original",
    "definition": "[처음] 독창적인, 원래의"
  },
  {
    "word": "ornate",
    "definition": "[장식] 화려하게 장식된"
  },
  {
    "word": "orthodox",
    "definition": "[정통] 정통의, 전통적인"
  },
  {
    "word": "oscillating",
    "definition": "[흔들다] 흔들리는, 진동하는"
  },
  {
    "word": "ostensibly",
    "definition": "[겉보기] 표면적으로는"
  },
  {
    "word": "ostentatious",
    "definition": "[과시] 허세 부리는, 과시적인"
  },
  {
    "word": "oust",
    "definition": "[쫓아내다] 몰아내다, 축출하다"
  },
  {
    "word": "outdated",
    "definition": "[낡다] 구식의, 시대에 뒤떨어진"
  },
  {
    "word": "outlandish",
    "definition": "[이상하다] 기이한, 괴상한"
  },
  {
    "word": "outmoded",
    "definition": "[낡다] 구식의, 폐물 같은"
  },
  {
    "word": "outstanding",
    "definition": "[두드러지다] 뛰어난, 눈에 띄는"
  },
  {
    "word": "overestimate",
    "definition": "[과대평가] 과대평가하다"
  },
  {
    "word": "overhaul",
    "definition": "[점검] 철저히 점검하다, 정비하다"
  },
  {
    "word": "overload",
    "definition": "[짐] 과부하 걸리다, 너무 많이 싣다"
  },
  {
    "word": "overlook",
    "definition": "[놓치다] 간과하다, 무시하다"
  },
  {
    "word": "neglect",
    "definition": "[놓치다] 간과하다, 무시하다"
  },
  {
    "word": "overmodest",
    "definition": "[지나치게 겸손] 과도하게 겸손한"
  },
  {
    "word": "overrate",
    "definition": "[과대평가] 과대평가하다"
  },
  {
    "word": "overstate",
    "definition": "[과장하다] 과장하다"
  },
  {
    "word": "overtly",
    "definition": "[공개적으로] 명백하게, 드러내 놓고"
  },
  {
    "word": "overwrought",
    "definition": "[지나치게 긴장] 지나치게 긴장한, 과민한"
  },
  {
    "word": "pacific",
    "definition": "[평화] 평화적인, 온건한"
  },
  {
    "word": "dovish",
    "definition": "[평화] 평화적인, 온건한"
  },
  {
    "word": "paean",
    "definition": "[찬가] 찬가, 찬미"
  },
  {
    "word": "palatable",
    "definition": "[맛있다] 맛있는, 마음에 드는"
  },
  {
    "word": "palliate",
    "definition": "[덮다] (병) 완화하다, 변명하다"
  },
  {
    "word": "palpable",
    "definition": "[만질 수 있음] 뚜렷한, 명백한"
  },
  {
    "word": "paltry",
    "definition": "[보잘것없음] 하찮은, 부족한"
  },
  {
    "word": "meager",
    "definition": "[보잘것없음] 하찮은, 부족한"
  },
  {
    "word": "panacea",
    "definition": "[만병통치] 만병통치약"
  },
  {
    "word": "cure-all",
    "definition": "[만병통치] 만병통치약"
  },
  {
    "word": "panache",
    "definition": "[당당한 태도] 위풍당당함, 기백"
  },
  {
    "word": "panegyrize",
    "definition": "[칭송] 칭송하다"
  },
  {
    "word": "paradigm",
    "definition": "[본보기] 전형, 모범"
  },
  {
    "word": "model",
    "definition": "[본보기] 전형, 모범"
  },
  {
    "word": "paraphernalia",
    "definition": "[잡동사니] 장비, 잡동사니"
  },
  {
    "word": "parity",
    "definition": "[동등] 동등, 등가"
  },
  {
    "word": "equality",
    "definition": "[동등] 동등, 등가"
  },
  {
    "word": "parochial",
    "definition": "[좁다] 편협한, 시골의"
  },
  {
    "word": "provincial",
    "definition": "[좁다] 편협한, 시골의"
  },
  {
    "word": "parsimonious",
    "definition": "[인색] 인색한"
  },
  {
    "word": "partisan",
    "definition": "[당파] 당파적인, 열렬한 지지자"
  },
  {
    "word": "passe",
    "definition": "[지나감] 구식의, 한물간"
  },
  {
    "word": "pastiche",
    "definition": "[모방] 혼합물, 모방작품"
  },
  {
    "word": "patchwork",
    "definition": "[섞다] 잡동사니, 뒤범벅"
  },
  {
    "word": "hodgepodge",
    "definition": "[섞다] 잡동사니, 뒤범벅"
  },
  {
    "word": "paucity",
    "definition": "[부족] 결핍, 부족"
  },
  {
    "word": "peccadillo",
    "definition": "[작은 죄] 사소한 잘못, 경범죄"
  },
  {
    "word": "pedagogy",
    "definition": "[교육] 교육학, 교수법"
  },
  {
    "word": "pedant",
    "definition": "[현학] 현학자, 규칙만 따지는 사람"
  },
  {
    "word": "pedantic",
    "definition": "[형식] 현학적인, 지나치게 규칙적인"
  },
  {
    "word": "pedestrian",
    "definition": "[보행] 평범한, 진부한"
  },
  {
    "word": "pejorative",
    "definition": "[비난] 비난하는, 경멸적인"
  },
  {
    "word": "pellucid",
    "definition": "[투명] 투명한, 명쾌한"
  },
  {
    "word": "pensive",
    "definition": "[깊이 생각] 수심어린, 곰곰이 생각하는"
  },
  {
    "word": "perceptive",
    "definition": "[지각하다] 통찰력 있는, 민감한"
  },
  {
    "word": "discerning",
    "definition": "[지각하다] 통찰력 있는, 민감한"
  },
  {
    "word": "perennial",
    "definition": "[영원] 지속적인, 다년생의"
  },
  {
    "word": "perennial",
    "definition": "[지속] 오래 지속되는"
  },
  {
    "word": "long-standing",
    "definition": "[지속] 오래 지속되는"
  },
  {
    "word": "perfunctory",
    "definition": "[형식적] 형식적인, 기계적인"
  },
  {
    "word": "peripheral",
    "definition": "[주변] 주변적인, 부차적인"
  },
  {
    "word": "permeable",
    "definition": "[스며들다] 투과성의, 침투할 수 있는"
  },
  {
    "word": "pernicious",
    "definition": "[해롭다] 해로운, 치명적인"
  },
  {
    "word": "perpetrate",
    "definition": "[저지르다] (범죄) 저지르다"
  },
  {
    "word": "perplexity",
    "definition": "[혼란] 당혹, 난처"
  },
  {
    "word": "persevere",
    "definition": "[견디다] 인내하다, 꾸준히 하다"
  },
  {
    "word": "persistence",
    "definition": "[버티다] 지속, 인내"
  },
  {
    "word": "survival",
    "definition": "[버티다] 지속, 인내"
  },
  {
    "word": "personification",
    "definition": "[의인화] 의인화, 전형"
  },
  {
    "word": "pertinent",
    "definition": "[관련] 적절한, 관련 있는"
  },
  {
    "word": "pervasive",
    "definition": "[퍼지다] 만연한, 널리 퍼진"
  },
  {
    "word": "petulant",
    "definition": "[투정] 화 잘 내는, 성마른"
  },
  {
    "word": "phlegmatic",
    "definition": "[침착] 침착한, 무기력한"
  },
  {
    "word": "pigeonhole",
    "definition": "[분류] 분류하다, 밀쳐두다"
  },
  {
    "word": "pilferage",
    "definition": "[좀도둑질] 절도, 도용"
  },
  {
    "word": "appropriation",
    "definition": "[좀도둑질] 절도, 도용"
  },
  {
    "word": "pine for",
    "definition": "[그리워하다] 갈망하다, 그리워하다"
  },
  {
    "word": "pinpoint",
    "definition": "[정확히 가리키다] 정확히 지적하다"
  },
  {
    "word": "pioneering",
    "definition": "[먼저 하다] 선구적인"
  },
  {
    "word": "pitfall",
    "definition": "[함정] 위험, 함정"
  },
  {
    "word": "pithy",
    "definition": "[핵심] 간결하고 의미심장한"
  },
  {
    "word": "placable",
    "definition": "[달래다] 달래기 쉬운"
  },
  {
    "word": "placate",
    "definition": "[달래다] 진정시키다, 달래다"
  },
  {
    "word": "appease",
    "definition": "[달래다] 진정시키다, 달래다"
  },
  {
    "word": "placidity",
    "definition": "[평온] 고요함, 평온"
  },
  {
    "word": "plaintive",
    "definition": "[슬픔] 애처로운, 구슬픈"
  },
  {
    "word": "plangent",
    "definition": "[크게 울리다] 울려 퍼지는, 구슬픈"
  },
  {
    "word": "plastic",
    "definition": "[형태 바뀜] 가소성의, 잘 변하는"
  },
  {
    "word": "platitudinous",
    "definition": "[진부] 진부한, 상투적인"
  },
  {
    "word": "plausible",
    "definition": "[그럴듯] 그럴듯한, 타당해 보이는"
  },
  {
    "word": "plethora",
    "definition": "[과다] 과잉, 과도"
  },
  {
    "word": "surfeit",
    "definition": "[과다] 과잉, 과도"
  },
  {
    "word": "pliable",
    "definition": "[구부리다] 유연한, 융통성 있는"
  },
  {
    "word": "ploy",
    "definition": "[계책] 책략, 전략"
  },
  {
    "word": "plummet",
    "definition": "[똑 떨어지다] 곤두박질치다, 급락하다"
  },
  {
    "word": "plunder",
    "definition": "[약탈] 약탈하다, 훔치다"
  },
  {
    "word": "polarizing",
    "definition": "[양극화] 분열시키는"
  },
  {
    "word": "polemical",
    "definition": "[논쟁] 논쟁적인, 논쟁을 일삼는"
  },
  {
    "word": "polymathic",
    "definition": "[박식] 박식한"
  },
  {
    "word": "encyclopedic",
    "definition": "[박식] 박식한"
  },
  {
    "word": "pomposity",
    "definition": "[거만] 젠체함, 거만함"
  },
  {
    "word": "ponder",
    "definition": "[생각] 숙고하다"
  },
  {
    "word": "portend",
    "definition": "[예고] 전조가 되다, 예고하다"
  },
  {
    "word": "predict",
    "definition": "[예고] 전조가 되다, 예고하다"
  },
  {
    "word": "potent",
    "definition": "[강력] 강력한, 유력한"
  },
  {
    "word": "pragmatic",
    "definition": "[실용] 실용적인, 실제적인"
  },
  {
    "word": "praiseworthy",
    "definition": "[칭찬] 칭찬할 만한"
  },
  {
    "word": "preachy",
    "definition": "[설교하다] 훈계하기 좋아하는"
  },
  {
    "word": "sanctimonious",
    "definition": "[설교하다] 훈계하기 좋아하는"
  },
  {
    "word": "precarious",
    "definition": "[위태] 불안정한, 위험한"
  },
  {
    "word": "precarious",
    "definition": "[위험] 위태로운, 아슬아슬한"
  },
  {
    "word": "perilous",
    "definition": "[위험] 위태로운, 아슬아슬한"
  },
  {
    "word": "precipitate",
    "definition": "[떨어뜨리다] 촉발시키다, 성급한"
  },
  {
    "word": "preclude",
    "definition": "[막다] 막다, 배제하다"
  },
  {
    "word": "preclude",
    "definition": "[제외하다] 배제하다, 불가능하게 하다"
  },
  {
    "word": "rule out",
    "definition": "[제외하다] 배제하다, 불가능하게 하다"
  },
  {
    "word": "preconception",
    "definition": "[선입견] 편견, 선입견"
  },
  {
    "word": "prejudice",
    "definition": "[선입견] 편견, 선입견"
  },
  {
    "word": "precursor",
    "definition": "[앞서다] 선구자, 전조"
  },
  {
    "word": "forerunner",
    "definition": "[앞서다] 선구자, 전조"
  },
  {
    "word": "predator",
    "definition": "[사냥] 포식자"
  },
  {
    "word": "predecessor",
    "definition": "[앞서다] 전임자, 선배"
  },
  {
    "word": "predicament",
    "definition": "[곤경] 곤경, 궁지"
  },
  {
    "word": "predilection",
    "definition": "[좋아하다] 편애, 편향"
  },
  {
    "word": "proclivity",
    "definition": "[좋아하다] 편애, 편향"
  },
  {
    "word": "prepossessing",
    "definition": "[매력] 매혹적인, 매력적인"
  },
  {
    "word": "presage",
    "definition": "[징조] 예시하다, 전조하다"
  },
  {
    "word": "portend",
    "definition": "[징조] 예시하다, 전조하다"
  },
  {
    "word": "prescient",
    "definition": "[앞서 앎] 예지의, 선견지명이 있는"
  },
  {
    "word": "prophetic",
    "definition": "[앞서 앎] 예지의, 선견지명이 있는"
  },
  {
    "word": "preserving",
    "definition": "[보존] 보존하는, 보호하는"
  },
  {
    "word": "safeguarding",
    "definition": "[보존] 보존하는, 보호하는"
  },
  {
    "word": "presumptuous",
    "definition": "[건방] 건방진, 주제넘은"
  },
  {
    "word": "presuppose",
    "definition": "[가정] 가정하다, 전제로 하다"
  },
  {
    "word": "pretentious",
    "definition": "[가식] 과시적인, 허세의"
  },
  {
    "word": "preternatural",
    "definition": "[초자연] 이상한, 초자연적인"
  },
  {
    "word": "pretext for",
    "definition": "[구실] ~의 핑계, 구실"
  },
  {
    "word": "prevailing",
    "definition": "[우세] 지배적인, 널리 퍼진"
  },
  {
    "word": "prevalent",
    "definition": "[널리 퍼지다] 널리 퍼진"
  },
  {
    "word": "extensive",
    "definition": "[널리 퍼지다] 널리 퍼진"
  },
  {
    "word": "prevalent",
    "definition": "[퍼지다] 널리 퍼진"
  },
  {
    "word": "widespread",
    "definition": "[퍼지다] 널리 퍼진"
  },
  {
    "word": "prevent",
    "definition": "[막다] 막다, 예방하다"
  },
  {
    "word": "preclude",
    "definition": "[막다] 막다, 예방하다"
  },
  {
    "word": "pristine",
    "definition": "[깨끗하다] 원래 그대로의, 순수한"
  },
  {
    "word": "private",
    "definition": "[개인] 개인적인, 은둔적인"
  },
  {
    "word": "insular",
    "definition": "[개인] 개인적인, 은둔적인"
  },
  {
    "word": "privation",
    "definition": "[결핍] 결핍, 빈곤"
  },
  {
    "word": "probity",
    "definition": "[정직] 정직, 성실"
  },
  {
    "word": "proclaim",
    "definition": "[공표] 선언하다, 알리다"
  },
  {
    "word": "profess",
    "definition": "[공표] 선언하다, 알리다"
  },
  {
    "word": "proclivity",
    "definition": "[경향] 성향, 기호"
  },
  {
    "word": "procreate",
    "definition": "[생산] 번식하다"
  },
  {
    "word": "prodigious",
    "definition": "[거대] 거대한, 엄청난"
  },
  {
    "word": "profit-mongers",
    "definition": "[이익 추구] 탐욕스런 사람들"
  },
  {
    "word": "profligate",
    "definition": "[낭비] 낭비하는, 방탕한"
  },
  {
    "word": "proliferation",
    "definition": "[번성하다] 확산, 급증"
  },
  {
    "word": "prolong",
    "definition": "[늘이다] 연장하다, 늘이다"
  },
  {
    "word": "prominence",
    "definition": "[두드러지다] 중요성, 탁월함"
  },
  {
    "word": "salience",
    "definition": "[두드러지다] 중요성, 탁월함"
  },
  {
    "word": "promulgate",
    "definition": "[선포] 공포하다, 선포하다"
  },
  {
    "word": "declare",
    "definition": "[선포] 공포하다, 선포하다"
  },
  {
    "word": "prophetic",
    "definition": "[예언] 예언의, 예언적인"
  },
  {
    "word": "prophylactic",
    "definition": "[예방] 예방의, 예방약"
  },
  {
    "word": "preventive",
    "definition": "[예방] 예방의, 예방약"
  },
  {
    "word": "propitious",
    "definition": "[길조] 유리한, 길조의"
  },
  {
    "word": "proponent",
    "definition": "[지지자] 지지자, 옹호자"
  },
  {
    "word": "proportionate",
    "definition": "[비례] 비례하는"
  },
  {
    "word": "proprietary",
    "definition": "[소유] 소유권의, 전매의"
  },
  {
    "word": "prosaic",
    "definition": "[평범] 평범한, 산문적인"
  },
  {
    "word": "proscribe",
    "definition": "[금하다] 금지하다"
  },
  {
    "word": "proscription",
    "definition": "[금지] 금지, 추방"
  },
  {
    "word": "protean",
    "definition": "[변하다] 변화무쌍한, 다재다능한"
  },
  {
    "word": "versatile",
    "definition": "[변하다] 변화무쌍한, 다재다능한"
  },
  {
    "word": "protest",
    "definition": "[항의] 항의하다"
  },
  {
    "word": "prototypical",
    "definition": "[원형] 전형적인, 원형의"
  },
  {
    "word": "protract",
    "definition": "[늘이다] 연장하다, 지연하다"
  },
  {
    "word": "provincial",
    "definition": "[지방] 지방의, 편협한"
  },
  {
    "word": "provocative",
    "definition": "[도발] 도발적인, 자극적인"
  },
  {
    "word": "proxy",
    "definition": "[대신] 대리, 대리인"
  },
  {
    "word": "prudence",
    "definition": "[조심] 신중함"
  },
  {
    "word": "prudent",
    "definition": "[신중] 신중한, 세심한"
  },
  {
    "word": "circumspect",
    "definition": "[신중] 신중한, 세심한"
  },
  {
    "word": "pseudonym",
    "definition": "[가짜 이름] 필명, 가명"
  },
  {
    "word": "puerile",
    "definition": "[어리석다] 유치한, 미숙한"
  },
  {
    "word": "pugnacious",
    "definition": "[싸움] 호전적인"
  },
  {
    "word": "cantankerous",
    "definition": "[싸움] 호전적인"
  },
  {
    "word": "pull no punches",
    "definition": "[직설] 가감 없이 말하다"
  },
  {
    "word": "punctiliousness",
    "definition": "[꼼꼼] 꼼꼼함, 세심함"
  },
  {
    "word": "punctuality",
    "definition": "[시간 엄수] 시간 엄수"
  },
  {
    "word": "pungent",
    "definition": "[자극] 톡 쏘는, 신랄한"
  },
  {
    "word": "purport",
    "definition": "[의도] 주장하다, 요지"
  },
  {
    "word": "purveyor",
    "definition": "[공급] 공급자, 조달자"
  },
  {
    "word": "purview",
    "definition": "[범위] 범위, 권한"
  },
  {
    "word": "pushover",
    "definition": "[만만] 만만한 사람, 쉬운 일"
  },
  {
    "word": "puzzle",
    "definition": "[난제] 수수께끼, 문제"
  },
  {
    "word": "conundrum",
    "definition": "[난제] 수수께끼, 문제"
  },
  {
    "word": "quash",
    "definition": "[억압] 억누르다, 진압하다"
  },
  {
    "word": "quibble",
    "definition": "[트집] 트집잡다, 둘러댐"
  },
  {
    "word": "quiescence",
    "definition": "[고요] 정적, 활동 없음"
  },
  {
    "word": "quip",
    "definition": "[재치] 재치 있는 말"
  },
  {
    "word": "quirky",
    "definition": "[별나다] 기발한, 특이한"
  },
  {
    "word": "unconventional",
    "definition": "[별나다] 기발한, 특이한"
  },
  {
    "word": "quixotic",
    "definition": "[이상] 비현실적인, 공상적인"
  },
  {
    "word": "idealistic",
    "definition": "[이상] 비현실적인, 공상적인"
  },
  {
    "word": "rampant",
    "definition": "[퍼짐] 만연한, 억제할 수 없는"
  },
  {
    "word": "ramshackle",
    "definition": "[허물다] 쓰러져가는, 무너질 듯한"
  },
  {
    "word": "rancor",
    "definition": "[원한] 원한, 증오"
  },
  {
    "word": "rant",
    "definition": "[고함] 고함치다, 비난하다"
  },
  {
    "word": "diatribe",
    "definition": "[고함] 고함치다, 비난하다"
  },
  {
    "word": "rapacious",
    "definition": "[탐욕] 탐욕스러운, 약탈적인"
  },
  {
    "word": "avaricious",
    "definition": "[탐욕] 탐욕스러운, 약탈적인"
  },
  {
    "word": "rapacity",
    "definition": "[탐욕] 탐욕, 강탈"
  },
  {
    "word": "realism",
    "definition": "[현실] 현실주의, 사실성"
  },
  {
    "word": "verisimilitude",
    "definition": "[현실] 현실주의, 사실성"
  },
  {
    "word": "realize",
    "definition": "[이루다] 실현하다, 깨닫다"
  },
  {
    "word": "achieve",
    "definition": "[이루다] 실현하다, 깨닫다"
  },
  {
    "word": "rebellious",
    "definition": "[반항] 반항적인, 저항하는"
  },
  {
    "word": "rebound",
    "definition": "[되돌다] 반등하다, 회복하다"
  },
  {
    "word": "rebuff",
    "definition": "[거절] 거절하다, 퇴짜 놓다"
  },
  {
    "word": "rebuke",
    "definition": "[꾸짖다] 꾸짖다, 비난하다"
  },
  {
    "word": "recalcitrant",
    "definition": "[완강] 완강한, 저항하는"
  },
  {
    "word": "restive",
    "definition": "[완강] 완강한, 저항하는"
  },
  {
    "word": "remuneration",
    "definition": "[보수] 보상, 급료"
  },
  {
    "word": "renounce",
    "definition": "[포기] 포기하다, 단념하다"
  },
  {
    "word": "reject",
    "definition": "[포기] 포기하다, 단념하다"
  },
  {
    "word": "replete",
    "definition": "[가득찬] 가득 찬, 풍만한"
  },
  {
    "word": "reproach",
    "definition": "[비난] 비난하다, 책망하다"
  },
  {
    "word": "reproof",
    "definition": "[질책] 책망, 비난"
  },
  {
    "word": "censuring",
    "definition": "[질책] 책망, 비난"
  },
  {
    "word": "repudiate",
    "definition": "[거부] 부인하다, 철회하다"
  },
  {
    "word": "recant",
    "definition": "[거부] 부인하다, 철회하다"
  },
  {
    "word": "repugnant",
    "definition": "[혐오] 불쾌한, 혐오스러운"
  },
  {
    "word": "rescind",
    "definition": "[철회] 철회하다, 폐지하다"
  },
  {
    "word": "resemble",
    "definition": "[닮다] 닮다, 유사하다"
  },
  {
    "word": "resent",
    "definition": "[화를 품다] 원망하다, 분개하다"
  },
  {
    "word": "reserved",
    "definition": "[내성적] 과묵한, 내성적인"
  },
  {
    "word": "resign to = cede to",
    "definition": "[체념] 체념하다, 받아들이다"
  },
  {
    "word": "resonate",
    "definition": "[울리다] 울리다, 공명하다"
  },
  {
    "word": "resort",
    "definition": "[의지하다] 의지하다, 휴양지"
  },
  {
    "word": "resourcefulness",
    "definition": "[지혜] 지략, 임기응변 능력"
  },
  {
    "word": "respite",
    "definition": "[휴식] 일시적 중단, 휴식"
  },
  {
    "word": "relief",
    "definition": "[휴식] 일시적 중단, 휴식"
  },
  {
    "word": "responsive",
    "definition": "[반응] 반응하는, 민감한"
  },
  {
    "word": "restive",
    "definition": "[가만있지 못함] 다루기 힘든, 반항적인"
  },
  {
    "word": "restorative",
    "definition": "[회복] 회복시키는, 보양의"
  },
  {
    "word": "tonic",
    "definition": "[회복] 회복시키는, 보양의"
  },
  {
    "word": "restrained",
    "definition": "[억제] 절제된, 삼가는"
  },
  {
    "word": "resurgence",
    "definition": "[되살아남] 재기, 부활"
  },
  {
    "word": "revival",
    "definition": "[되살아남] 재기, 부활"
  },
  {
    "word": "resurgent",
    "definition": "[부활] 다시 기승을 부리는"
  },
  {
    "word": "reticent",
    "definition": "[말 적음] 말이 없는, 과묵한"
  },
  {
    "word": "reveal",
    "definition": "[드러내다] 드러내다, 밝히다"
  },
  {
    "word": "manifest",
    "definition": "[드러내다] 드러내다, 밝히다"
  },
  {
    "word": "reverence",
    "definition": "[존경] 존경, 숭배"
  },
  {
    "word": "reverent",
    "definition": "[존경] 경건한, 공경하는"
  },
  {
    "word": "revert to",
    "definition": "[되돌아가다] 원상태로 돌아가다"
  },
  {
    "word": "revival",
    "definition": "[부흥] 부활, 부흥"
  },
  {
    "word": "renaissance",
    "definition": "[부흥] 부활, 부흥"
  },
  {
    "word": "riddle",
    "definition": "[수수께끼] 수수께끼, 난제"
  },
  {
    "word": "conundrum",
    "definition": "[수수께끼] 수수께끼, 난제"
  },
  {
    "word": "ring out",
    "definition": "[울려퍼지다] 크게 울리다"
  },
  {
    "word": "risible",
    "definition": "[웃다] 우스꽝스러운"
  },
  {
    "word": "robust",
    "definition": "[강하다] 튼튼한, 강력한"
  },
  {
    "word": "strong",
    "definition": "[강하다] 튼튼한, 강력한"
  },
  {
    "word": "roil",
    "definition": "[휘젓다] 휘젓다, 어지럽히다"
  },
  {
    "word": "rosy",
    "definition": "[장밋빛] 낙관적인, 희망적인"
  },
  {
    "word": "row",
    "definition": "[다툼] 말다툼, 소동"
  },
  {
    "word": "rudimentary",
    "definition": "[기초] 기초적인, 미완성의"
  },
  {
    "word": "sketchy",
    "definition": "[기초] 기초적인, 미완성의"
  },
  {
    "word": "rusting",
    "definition": "[녹슬다] 녹슬기, 부식"
  },
  {
    "word": "sabotage",
    "definition": "[방해] 파괴행위, 방해하다"
  },
  {
    "word": "saccharine",
    "definition": "[단] 지나치게 달콤한, 역겨운"
  },
  {
    "word": "sacrosanct",
    "definition": "[신성] 신성불가침의"
  },
  {
    "word": "saddle",
    "definition": "[짐 지움] 책임 지우다, 안장 얹다"
  },
  {
    "word": "sagacious",
    "definition": "[현명] 현명한, 영리한"
  },
  {
    "word": "[sagacity-n]",
    "definition": "[현명] 현명한, 영리한"
  },
  {
    "word": "sage",
    "definition": "[현자] 현명한, 현자"
  },
  {
    "word": "salacious",
    "definition": "[음탕] 외설적인, 음탕한"
  },
  {
    "word": "salient",
    "definition": "[두드러짐] 눈에 띄는, 중요한"
  },
  {
    "word": "visible",
    "definition": "[두드러짐] 눈에 띄는, 중요한"
  },
  {
    "word": "salubrious",
    "definition": "[건강] 건강에 좋은, 유익한"
  },
  {
    "word": "salutary",
    "definition": "[유익] 유익한, 건전한"
  },
  {
    "word": "sanctimonious",
    "definition": "[경건 위장] 위선적으로 경건한"
  },
  {
    "word": "sanction",
    "definition": "[승인] 승인하다, 제재하다"
  },
  {
    "word": "endorse",
    "definition": "[승인] 승인하다, 제재하다"
  },
  {
    "word": "sanguine",
    "definition": "[생기] 낙관적인, 쾌활한"
  },
  {
    "word": "scant",
    "definition": "[부족] 부족한, 빈약한"
  },
  {
    "word": "limited",
    "definition": "[부족] 부족한, 빈약한"
  },
  {
    "word": "scanty",
    "definition": "[적음] 얼마 안 되는, 빈약한"
  },
  {
    "word": "scarce",
    "definition": "[드묾] 부족한, 드문"
  },
  {
    "word": "scathing",
    "definition": "[혹독] 통렬한, 신랄한"
  },
  {
    "word": "schism",
    "definition": "[분열] 분열, 분파"
  },
  {
    "word": "factiousness",
    "definition": "[분열] 분열, 분파"
  },
  {
    "word": "scintillating",
    "definition": "[번쩍임] 번득이는, 재치 있는"
  },
  {
    "word": "scratching",
    "definition": "[긁다] 긁힘, 흠"
  },
  {
    "word": "scrutinize",
    "definition": "[자세히] 세밀히 조사하다"
  },
  {
    "word": "sectarian",
    "definition": "[파벌] 종파의, 당파적인"
  },
  {
    "word": "seditious",
    "definition": "[선동] 선동적인, 반란적인"
  },
  {
    "word": "sedulous",
    "definition": "[부지런] 부지런한, 근면한"
  },
  {
    "word": "self-absorption",
    "definition": "[자기 몰두] 자기 도취"
  },
  {
    "word": "self-containing",
    "definition": "[자가 포함] 스스로 포함하는"
  },
  {
    "word": "self-effacing",
    "definition": "[겸손] 나서지 않는, 겸양하는"
  },
  {
    "word": "self-interest",
    "definition": "[이익] 이기심, 기회주의"
  },
  {
    "word": "opportunism",
    "definition": "[이익] 이기심, 기회주의"
  },
  {
    "word": "selfless",
    "definition": "[이타] 이타적인, 헌신적인"
  },
  {
    "word": "altruistic",
    "definition": "[이타] 이타적인, 헌신적인"
  },
  {
    "word": "self-perpetuating",
    "definition": "[자체 지속] 자체적으로 영속하는"
  },
  {
    "word": "self-regard",
    "definition": "[자존심] 자존심, 자기 존중"
  },
  {
    "word": "self-righteous",
    "definition": "[독선] 독선적인"
  },
  {
    "word": "self-serving",
    "definition": "[자기 이익] 자기 본위의"
  },
  {
    "word": "seminal",
    "definition": "[씨앗] 획기적인, 중요한"
  },
  {
    "word": "senescence",
    "definition": "[늙음] 노쇠, 노화"
  },
  {
    "word": "decrepitude",
    "definition": "[늙음] 노쇠, 노화"
  },
  {
    "word": "senile",
    "definition": "[노년] 노망한, 노쇄한"
  },
  {
    "word": "sensible",
    "definition": "[분별] 분별력 있는, 현명한"
  },
  {
    "word": "sententious",
    "definition": "[말 많은] 교훈적인, 훈계조의"
  },
  {
    "word": "sequester",
    "definition": "[격리] 격리하다, 은둔시키다"
  },
  {
    "word": "shackle",
    "definition": "[속박] 족쇄 채우다, 억누르다"
  },
  {
    "word": "stifle",
    "definition": "[속박] 족쇄 채우다, 억누르다"
  },
  {
    "word": "sham",
    "definition": "[가짜] 가짜, 위조"
  },
  {
    "word": "shift",
    "definition": "[옮기다] 변화하다, 옮기다"
  },
  {
    "word": "shortcoming",
    "definition": "[결점] 단점, 결점"
  },
  {
    "word": "fault",
    "definition": "[결점] 단점, 결점"
  },
  {
    "word": "short-lived",
    "definition": "[짧음] 오래 가지 않는"
  },
  {
    "word": "ephemeral",
    "definition": "[짧음] 오래 가지 않는"
  },
  {
    "word": "showy",
    "definition": "[화려] 화려한, 허세 부리는"
  },
  {
    "word": "shriek",
    "definition": "[외치다] 비명을 지르다"
  },
  {
    "word": "shun",
    "definition": "[피하다] 피하다, 멀리하다"
  },
  {
    "word": "sidestep",
    "definition": "[피하다] 회피하다"
  },
  {
    "word": "circumvent",
    "definition": "[피하다] 회피하다"
  },
  {
    "word": "sifted from",
    "definition": "[걸러내다] ~에서 가려내다"
  },
  {
    "word": "simplicity",
    "definition": "[단순] 단순함, 알기 쉬움"
  },
  {
    "word": "intelligibility",
    "definition": "[단순] 단순함, 알기 쉬움"
  },
  {
    "word": "singular",
    "definition": "[하나] 독특한, 비범한"
  },
  {
    "word": "unique",
    "definition": "[하나] 독특한, 비범한"
  },
  {
    "word": "skeptical",
    "definition": "[의심] 회의적인"
  },
  {
    "word": "skew",
    "definition": "[왜곡] 비뚤어지다, 왜곡하다"
  },
  {
    "word": "skirt",
    "definition": "[둘레] 피하다, 가장자리를 돌다"
  },
  {
    "word": "skittish",
    "definition": "[놀람] 변덕스러운, 잘 놀라는"
  },
  {
    "word": "restive",
    "definition": "[놀람] 변덕스러운, 잘 놀라는"
  },
  {
    "word": "skulduggery",
    "definition": "[속임수] 사기, 음모"
  },
  {
    "word": "slapdash",
    "definition": "[엉성] 성급하게 한, 엉성한"
  },
  {
    "word": "sleazy",
    "definition": "[천박] 추잡스러운, 천한"
  },
  {
    "word": "slippery",
    "definition": "[미끄럽다] 미끄러운, 파악하기 힘든"
  },
  {
    "word": "elusive",
    "definition": "[미끄럽다] 미끄러운, 파악하기 힘든"
  },
  {
    "word": "slogan",
    "definition": "[표어] 구호, 표어"
  },
  {
    "word": "slumber",
    "definition": "[잠] 잠, 수면"
  },
  {
    "word": "slurs",
    "definition": "[중상] 비방, 중상"
  },
  {
    "word": "aspersions",
    "definition": "[중상] 비방, 중상"
  },
  {
    "word": "smuggle",
    "definition": "[밀수] 밀수하다, 몰래 들여오다"
  },
  {
    "word": "snub",
    "definition": "[무시] 모욕하다, 냉대하다"
  },
  {
    "word": "sober",
    "definition": "[진지] 술 취하지 않은, 진지한"
  },
  {
    "word": "solemn",
    "definition": "[엄숙] 엄숙한, 근엄한"
  },
  {
    "word": "solemnity",
    "definition": "[장중] 장엄함, 엄숙함"
  },
  {
    "word": "solicitous",
    "definition": "[걱정] 세심히 배려하는, 걱정하는"
  },
  {
    "word": "solidarity",
    "definition": "[결속] 단결, 연대"
  },
  {
    "word": "camaraderie",
    "definition": "[결속] 단결, 연대"
  },
  {
    "word": "solidify",
    "definition": "[굳히다] 굳어지다, 강화하다"
  },
  {
    "word": "somnolent",
    "definition": "[졸림] 졸린, 나른한"
  },
  {
    "word": "lethargic",
    "definition": "[졸림] 졸린, 나른한"
  },
  {
    "word": "sonorous",
    "definition": "[울림] 울려퍼지는, 낭랑한"
  },
  {
    "word": "soothsayer",
    "definition": "[예언자] 점쟁이, 예언자"
  },
  {
    "word": "sophist",
    "definition": "[궤변] 궤변가"
  },
  {
    "word": "sophistication",
    "definition": "[세련] 세련, 교양"
  },
  {
    "word": "soporific",
    "definition": "[졸음] 최면성의, 졸리는"
  },
  {
    "word": "sordid",
    "definition": "[더럽다] 더러운, 비열한"
  },
  {
    "word": "spacious",
    "definition": "[넓다] 넓은, 훤한"
  },
  {
    "word": "sparing",
    "definition": "[아낌] 조금만 쓰는, 절약하는"
  },
  {
    "word": "specious",
    "definition": "[거짓처럼 보임] 겉만 그럴듯한"
  },
  {
    "word": "spurious",
    "definition": "[거짓처럼 보임] 겉만 그럴듯한"
  },
  {
    "word": "speculation",
    "definition": "[추측] 추측, 억측"
  },
  {
    "word": "conjecture",
    "definition": "[추측] 추측, 억측"
  },
  {
    "word": "speculative",
    "definition": "[추측] 추측의, 투기적인"
  },
  {
    "word": "conjectural",
    "definition": "[추측] 추측의, 투기적인"
  },
  {
    "word": "spike",
    "definition": "[급등] 급격히 오르다, 못"
  },
  {
    "word": "spirited",
    "definition": "[기운] 활기찬, 힘찬"
  },
  {
    "word": "vigorous",
    "definition": "[기운] 활기찬, 힘찬"
  },
  {
    "word": "spontaneity",
    "definition": "[자발] 자발성"
  },
  {
    "word": "spontaneous",
    "definition": "[자발] 자발적인, 즉흥적인"
  },
  {
    "word": "sporadic",
    "definition": "[드문] 산발적인, 가끔 있는"
  },
  {
    "word": "spur",
    "definition": "[자극] 박차를 가하다, 자극하다"
  },
  {
    "word": "foster",
    "definition": "[자극] 박차를 가하다, 자극하다"
  },
  {
    "word": "spurious",
    "definition": "[거짓] 가짜의, 허위의"
  },
  {
    "word": "specious,mendacious",
    "definition": "[거짓] 가짜의, 허위의"
  },
  {
    "word": "spurn",
    "definition": "[거절] 퇴짜 놓다, 거절하다"
  },
  {
    "word": "spurring",
    "definition": "[독려] 자극하는, 촉진하는"
  },
  {
    "word": "fostering",
    "definition": "[독려] 자극하는, 촉진하는"
  },
  {
    "word": "square with",
    "definition": "[일치] 일치하다, 부합하다"
  },
  {
    "word": "conform to",
    "definition": "[일치] 일치하다, 부합하다"
  },
  {
    "word": "staggering",
    "definition": "[비틀] 엄청난, 충격적인"
  },
  {
    "word": "stagnate",
    "definition": "[고이다] 침체하다, 정체하다"
  },
  {
    "word": "stale",
    "definition": "[신선X] 진부한, 상한"
  },
  {
    "word": "stalwart",
    "definition": "[튼튼] 충직한, 튼튼한"
  },
  {
    "word": "stark",
    "definition": "[뚜렷] 극명한, 삭막한"
  },
  {
    "word": "starkly",
    "definition": "[분명] 극명히, 완전히"
  },
  {
    "word": "staunch",
    "definition": "[굳건] 충실한, 확고한"
  },
  {
    "word": "steadfast",
    "definition": "[확고] 확고한, 불변의"
  },
  {
    "word": "steer",
    "definition": "[몰다] 조종하다, 이끌다"
  },
  {
    "word": "stemming",
    "definition": "[막기] 저지하는, 막는"
  },
  {
    "word": "checking",
    "definition": "[막기] 저지하는, 막는"
  },
  {
    "word": "stern",
    "definition": "[엄격] 엄격한, 단호한"
  },
  {
    "word": "stifle",
    "definition": "[억누르다] 숨막히게 하다, 억제하다"
  },
  {
    "word": "stigma",
    "definition": "[낙인] 오명, 불명예"
  },
  {
    "word": "stigmatize",
    "definition": "[낙인찍다] 낙인찍다, 비난하다"
  },
  {
    "word": "stingy",
    "definition": "[인색] 인색한"
  },
  {
    "word": "parsimonious",
    "definition": "[인색] 인색한"
  },
  {
    "word": "stoicism",
    "definition": "[금욕] 금욕, 냉정함"
  },
  {
    "word": "stratification",
    "definition": "[계층화] 계층화, 구분"
  },
  {
    "word": "stratified",
    "definition": "[층화] 계층적인"
  },
  {
    "word": "hierarchical",
    "definition": "[층화] 계층적인"
  },
  {
    "word": "striking",
    "definition": "[두드러짐] 현저한, 눈에 띄는"
  },
  {
    "word": "pronounced",
    "definition": "[두드러짐] 현저한, 눈에 띄는"
  },
  {
    "word": "stunning",
    "definition": "[놀람] 놀라운, 멋진"
  },
  {
    "word": "stymie",
    "definition": "[방해] 방해하다, 좌절시키다"
  },
  {
    "word": "hinder",
    "definition": "[방해] 방해하다, 좌절시키다"
  },
  {
    "word": "subjective",
    "definition": "[주관] 주관적인"
  },
  {
    "word": "subservient",
    "definition": "[복종] 복종하는, 아첨하는"
  },
  {
    "word": "substantiate",
    "definition": "[입증] 입증하다"
  },
  {
    "word": "subterfuge",
    "definition": "[속임수] 핑계, 구실, 기만"
  },
  {
    "word": "chicanery",
    "definition": "[속임수] 핑계, 구실, 기만"
  },
  {
    "word": "subtle",
    "definition": "[섬세] 미묘한, 섬세한"
  },
  {
    "word": "subtlety",
    "definition": "[미묘] 미묘함, 정교함"
  },
  {
    "word": "subversive",
    "definition": "[뒤집다] 전복적인"
  },
  {
    "word": "subvert",
    "definition": "[뒤엎다] 전복하다, 파괴하다"
  },
  {
    "word": "succeeding",
    "definition": "[이어지는] 다음의, 뒤이은"
  },
  {
    "word": "successively",
    "definition": "[연속] 연속적으로"
  },
  {
    "word": "sequentially",
    "definition": "[연속] 연속적으로"
  },
  {
    "word": "succumb",
    "definition": "[굴복] 굴복하다, 쓰러지다"
  },
  {
    "word": "yield",
    "definition": "[굴복] 굴복하다, 쓰러지다"
  },
  {
    "word": "sullen",
    "definition": "[시무룩] 뚱한, 시무룩한"
  },
  {
    "word": "surly",
    "definition": "[시무룩] 뚱한, 시무룩한"
  },
  {
    "word": "sullied",
    "definition": "[더럽히다] 더럽혀진, 손상된"
  },
  {
    "word": "superannuation",
    "definition": "[퇴직 연금] 노후 연금, 연금제도"
  },
  {
    "word": "supercilious",
    "definition": "[거만] 거만한, 남을 깔보는"
  },
  {
    "word": "imperious",
    "definition": "[거만] 거만한, 남을 깔보는"
  },
  {
    "word": "superficial",
    "definition": "[피상] 피상적인, 얕은"
  },
  {
    "word": "sketchy",
    "definition": "[피상] 피상적인, 얕은"
  },
  {
    "word": "superfluous",
    "definition": "[과잉] 불필요한, 과잉의"
  },
  {
    "word": "supersede",
    "definition": "[대체하다] 대신하다, 대체하다"
  },
  {
    "word": "replace",
    "definition": "[대체하다] 대신하다, 대체하다"
  },
  {
    "word": "supplant",
    "definition": "[대체] 대신하다, 대체하다"
  },
  {
    "word": "supportive",
    "definition": "[도움] 지원하는, 도와주는"
  },
  {
    "word": "supposition",
    "definition": "[가정] 가정, 추정"
  },
  {
    "word": "suppress",
    "definition": "[눌러막다] 억압하다, 진압하다"
  },
  {
    "word": "surefit",
    "definition": "[확실히 맞음] 딱 들어맞음"
  },
  {
    "word": "surfeit",
    "definition": "[과잉] 과다, 과잉"
  },
  {
    "word": "glut",
    "definition": "[과잉] 과다, 과잉"
  },
  {
    "word": "surge",
    "definition": "[솟구치다] 급등, 쇄도"
  },
  {
    "word": "surmise",
    "definition": "[추측] 추측하다"
  },
  {
    "word": "infer",
    "definition": "[추측] 추측하다"
  },
  {
    "word": "surmount",
    "definition": "[극복] 극복하다"
  },
  {
    "word": "surreptitious",
    "definition": "[몰래] 은밀한, 비밀스러운"
  },
  {
    "word": "swagger",
    "definition": "[뽐냄] 으스대다, 오만한 태도"
  },
  {
    "word": "sway",
    "definition": "[흔들다] 흔들다, 지배하다"
  },
  {
    "word": "sweeping",
    "definition": "[포괄] 포괄적인, 광범위한"
  },
  {
    "word": "comprehensive",
    "definition": "[포괄] 포괄적인, 광범위한"
  },
  {
    "word": "swift",
    "definition": "[빠름] 신속한, 재빠른"
  },
  {
    "word": "swill",
    "definition": "[벌컥] 벌컥 마시다, 쓸어 담다"
  },
  {
    "word": "guzzle",
    "definition": "[벌컥] 벌컥 마시다, 쓸어 담다"
  },
  {
    "word": "sycophant",
    "definition": "[아첨] 아첨꾼, 아부하는 사람"
  },
  {
    "word": "adulator",
    "definition": "[아첨] 아첨꾼, 아부하는 사람"
  },
  {
    "word": "sympathetic",
    "definition": "[공감] 동정적인, 공감하는"
  },
  {
    "word": "synopses",
    "definition": "[요약] 개요, 요약"
  },
  {
    "word": "tacit",
    "definition": "[무언] 무언의, 암묵적인"
  },
  {
    "word": "taciturn",
    "definition": "[과묵] 말없는, 과묵한"
  },
  {
    "word": "reserved",
    "definition": "[과묵] 말없는, 과묵한"
  },
  {
    "word": "tactful",
    "definition": "[요령] 요령있는, 재치있는"
  },
  {
    "word": "skillful",
    "definition": "[요령] 요령있는, 재치있는"
  },
  {
    "word": "taint",
    "definition": "[더럽히다] 오점, 오염"
  },
  {
    "word": "take on",
    "definition": "[맡다] 떠맡다, 고용하다"
  },
  {
    "word": "tangent",
    "definition": "[접촉] 접선, 본론에서 벗어남"
  },
  {
    "word": "tangential",
    "definition": "[벗어남] 관계없는, 주변의"
  },
  {
    "word": "tangible",
    "definition": "[만질 수 있음] 실질적인, 명백한"
  },
  {
    "word": "tantamount to",
    "definition": "[같다] ~와 마찬가지의"
  },
  {
    "word": "synonymous with",
    "definition": "[같다] ~와 마찬가지의"
  },
  {
    "word": "tarnish",
    "definition": "[흐리게 하다] 흐리게 하다, 더럽히다"
  },
  {
    "word": "taxing",
    "definition": "[힘든] 고된, 부담스러운"
  },
  {
    "word": "tedious",
    "definition": "[지루함] 지루한, 장황한"
  },
  {
    "word": "boring",
    "definition": "[지루함] 지루한, 장황한"
  },
  {
    "word": "teem",
    "definition": "[가득하다] 풍부하다, 바글거리다"
  },
  {
    "word": "temerity",
    "definition": "[무모] 무모함, 뻔뻔스러움"
  },
  {
    "word": "temper",
    "definition": "[누그러뜨리다] 완화시키다"
  },
  {
    "word": "moderate",
    "definition": "[누그러뜨리다] 완화시키다"
  },
  {
    "word": "temperance",
    "definition": "[절제] 절제, 금주"
  },
  {
    "word": "temperate",
    "definition": "[온화] 온화한, 절제된"
  },
  {
    "word": "tempestuously",
    "definition": "[격렬] 격렬하게, 폭풍우처럼"
  },
  {
    "word": "tenacious",
    "definition": "[고집] 끈질긴, 집요한"
  },
  {
    "word": "tendentious",
    "definition": "[편향] 편향적인, 선동적인"
  },
  {
    "word": "tenor",
    "definition": "[진행] 경향, 취지"
  },
  {
    "word": "tentative",
    "definition": "[시험적] 잠정적인, 임시의"
  },
  {
    "word": "tenuous",
    "definition": "[얇다] 희박한, 빈약한"
  },
  {
    "word": "tepid",
    "definition": "[미지근] 미지근한"
  },
  {
    "word": "terse",
    "definition": "[간결] 간결한, 간단명료한"
  },
  {
    "word": "laconic, brief",
    "definition": "[간결] 간결한, 간단명료한"
  },
  {
    "word": "theoretical",
    "definition": "[이론] 이론적인, 개념상의"
  },
  {
    "word": "conceptual",
    "definition": "[이론] 이론적인, 개념상의"
  },
  {
    "word": "thoughtful",
    "definition": "[생각깊다] 사려 깊은, 생각이 많은"
  },
  {
    "word": "thrive",
    "definition": "[번성] 번영하다, 잘 자라다"
  },
  {
    "word": "thwart",
    "definition": "[방해] 좌절시키다, 막다"
  },
  {
    "word": "tilt",
    "definition": "[기울다] 기울다, 기울기"
  },
  {
    "word": "list[기울기]",
    "definition": "[기울다] 기울다, 기울기"
  },
  {
    "word": "timely",
    "definition": "[적절한 때] 시기적절한"
  },
  {
    "word": "opportune",
    "definition": "[적절한 때] 시기적절한"
  },
  {
    "word": "timid",
    "definition": "[겁 많음] 소심한, 겁 많은"
  },
  {
    "word": "diffident",
    "definition": "[겁 많음] 소심한, 겁 많은"
  },
  {
    "word": "timorous",
    "definition": "[겁 많음] 겁 많은, 두려워하는"
  },
  {
    "word": "tonic",
    "definition": "[회복] 강장제, 활력 주는 것"
  },
  {
    "word": "torpid",
    "definition": "[무기력] 무기력한, 둔한"
  },
  {
    "word": "torpor",
    "definition": "[무기력] 무기력, 활기 없음"
  },
  {
    "word": "torrid",
    "definition": "[뜨겁다] 무더운, 열렬한"
  },
  {
    "word": "tout",
    "definition": "[과대선전] 광고하다, 과시하다"
  },
  {
    "word": "tractable",
    "definition": "[다루기 쉬움] 다루기 쉬운, 유순한"
  },
  {
    "word": "trammel",
    "definition": "[속박] 구속, 방해"
  },
  {
    "word": "transcend",
    "definition": "[넘다] 초월하다, 능가하다"
  },
  {
    "word": "transient",
    "definition": "[잠깐] 일시적인, 순식간의"
  },
  {
    "word": "transitional",
    "definition": "[과도] 과도기의, 변천하는"
  },
  {
    "word": "transitory",
    "definition": "[덧없음] 일시적인, 순간의"
  },
  {
    "word": "ephemeral",
    "definition": "[덧없음] 일시적인, 순간의"
  },
  {
    "word": "transparent",
    "definition": "[투명] 투명한, 명백한"
  },
  {
    "word": "trenchant",
    "definition": "[날카로운] 신랄한, 통찰력 있는"
  },
  {
    "word": "profound",
    "definition": "[날카로운] 신랄한, 통찰력 있는"
  },
  {
    "word": "trendy",
    "definition": "[유행] 유행의, 최신식의"
  },
  {
    "word": "trepidation",
    "definition": "[두려움] 공포, 불안"
  },
  {
    "word": "apprehension",
    "definition": "[두려움] 공포, 불안"
  },
  {
    "word": "trespass",
    "definition": "[침입] 무단 침입, 불법 침해"
  },
  {
    "word": "trickster",
    "definition": "[속임수] 사기꾼, 협잡꾼"
  },
  {
    "word": "trifling",
    "definition": "[사소] 하찮은, 사소한"
  },
  {
    "word": "minimal",
    "definition": "[사소] 하찮은, 사소한"
  },
  {
    "word": "trivialize",
    "definition": "[사소화] 경시하다, 사소하게 만들다"
  },
  {
    "word": "truculent",
    "definition": "[호전적] 공격적인, 반항적인"
  },
  {
    "word": "truncate",
    "definition": "[잘라내다] 줄이다, 생략하다"
  },
  {
    "word": "turbulence",
    "definition": "[격동] 난기류, 소란"
  },
  {
    "word": "ubiquitous",
    "definition": "[어디든] 아주 흔한, 어디에나 있는"
  },
  {
    "word": "unabated",
    "definition": "[약하지 않음] 줄지 않은, 계속되는"
  },
  {
    "word": "undiminished",
    "definition": "[약하지 않음] 줄지 않은, 계속되는"
  },
  {
    "word": "unalloyed",
    "definition": "[순수] 순전한, 완전한"
  },
  {
    "word": "unqualified",
    "definition": "[순수] 순전한, 완전한"
  },
  {
    "word": "unassailable",
    "definition": "[공격 불가] 난공불락의, 논박할 수 없는"
  },
  {
    "word": "unassuming",
    "definition": "[겸손] 겸손한, 드러내지 않는"
  },
  {
    "word": "modest",
    "definition": "[겸손] 겸손한, 드러내지 않는"
  },
  {
    "word": "unavoidable",
    "definition": "[피할 수 없음] 불가피한"
  },
  {
    "word": "inevitable",
    "definition": "[피할 수 없음] 불가피한"
  },
  {
    "word": "uncanny",
    "definition": "[이상/괴이] 이상한, 섬뜩한"
  },
  {
    "word": "uncertain",
    "definition": "[확실치 않음] 불확실한"
  },
  {
    "word": "conjectural",
    "definition": "[확실치 않음] 불확실한"
  },
  {
    "word": "unconventional",
    "definition": "[비정형] 독창적인, 관습에 얽매이지 않는"
  },
  {
    "word": "quirky,original",
    "definition": "[비정형] 독창적인, 관습에 얽매이지 않는"
  },
  {
    "word": "unctuous",
    "definition": "[기름기] (말투·행동이) 번드르르한, 아부하는"
  },
  {
    "word": "undercut",
    "definition": "[약화] 약화시키다, 싸게 팔다"
  },
  {
    "word": "underemphasized",
    "definition": "[덜 강조] 강조되지 않은"
  },
  {
    "word": "undergrid",
    "definition": "[받치다] 뒷받침하다"
  },
  {
    "word": "support",
    "definition": "[받치다] 뒷받침하다"
  },
  {
    "word": "undermine",
    "definition": "[약화하다] 손상시키다, 약화시키다"
  },
  {
    "word": "subvert,impair",
    "definition": "[약화하다] 손상시키다, 약화시키다"
  },
  {
    "word": "undeserved",
    "definition": "[받을 자격 없음] 부당한, 과분한"
  },
  {
    "word": "unexpected 가능",
    "definition": "[받을 자격 없음] 부당한, 과분한"
  },
  {
    "word": "undeveloped",
    "definition": "[미발달] 미발달의, 불완전한"
  },
  {
    "word": "sketchy",
    "definition": "[미발달] 미발달의, 불완전한"
  },
  {
    "word": "undiminished",
    "definition": "[줄지 않음] 줄지 않은"
  },
  {
    "word": "undistinguished",
    "definition": "[평범] 특별할 것 없는"
  },
  {
    "word": "unearth",
    "definition": "[밝히다] 발굴하다, 드러내다"
  },
  {
    "word": "unencumbered",
    "definition": "[방해 없음] 방해받지 않는"
  },
  {
    "word": "unequivocal",
    "definition": "[명백] 명확한, 분명한"
  },
  {
    "word": "unexceptional",
    "definition": "[특별X] 평범한"
  },
  {
    "word": "nondescript",
    "definition": "[특별X] 평범한"
  },
  {
    "word": "unexplored",
    "definition": "[탐험X] 탐구되지 않은"
  },
  {
    "word": "unfamiliarity",
    "definition": "[익숙X] 생소, 무지"
  },
  {
    "word": "ignorance",
    "definition": "[익숙X] 생소, 무지"
  },
  {
    "word": "unfathomable",
    "definition": "[헤아릴 수 없음] 불가해한, 측량할 수 없는"
  },
  {
    "word": "unfazed",
    "definition": "[동요 없음] 동요하지 않는, 당황하지 않는"
  },
  {
    "word": "unfeeling",
    "definition": "[감정X] 감정 없는, 냉혹한"
  },
  {
    "word": "unflagging",
    "definition": "[지치지 않음] 꾸준한, 끈질긴"
  },
  {
    "word": "unfatigued",
    "definition": "[지치지 않음] 꾸준한, 끈질긴"
  },
  {
    "word": "unfortunate",
    "definition": "[불운] 불행한, 불운한"
  },
  {
    "word": "unfounded",
    "definition": "[근거 없음] 근거 없는"
  },
  {
    "word": "baseless",
    "definition": "[근거 없음] 근거 없는"
  },
  {
    "word": "ungainly",
    "definition": "[어색] 어색한, 서투른"
  },
  {
    "word": "unimpeachable",
    "definition": "[비난 불가] 의심할 여지 없는, 확실한"
  },
  {
    "word": "blameless",
    "definition": "[비난 불가] 의심할 여지 없는, 확실한"
  },
  {
    "word": "unique",
    "definition": "[유일] 독특한, 유일한"
  },
  {
    "word": "singular",
    "definition": "[유일] 독특한, 유일한"
  },
  {
    "word": "unkempt",
    "definition": "[단정치 못함] 흐트러진, 단정치 못한"
  },
  {
    "word": "unlinked",
    "definition": "[떨어진] 분리된, 소원해진"
  },
  {
    "word": "estranged",
    "definition": "[떨어진] 분리된, 소원해진"
  },
  {
    "word": "unobtrusive",
    "definition": "[튀지 않음] 조심스러운, 나서지 않는"
  },
  {
    "word": "unorthodox",
    "definition": "[비정통] 정통이 아닌, 이단의"
  },
  {
    "word": "unostentatious",
    "definition": "[허세X] 수수한, 겸손한"
  },
  {
    "word": "modest",
    "definition": "[허세X] 수수한, 겸손한"
  },
  {
    "word": "unprecedented",
    "definition": "[전례 없음] 전례 없는"
  },
  {
    "word": "abnormal",
    "definition": "[전례 없음] 전례 없는"
  },
  {
    "word": "unprepossessing",
    "definition": "[매력X] 매력 없는, 평범한"
  },
  {
    "word": "unremarkable",
    "definition": "[매력X] 매력 없는, 평범한"
  },
  {
    "word": "unremarkable",
    "definition": "[평범] 평범한, 특별치 않은"
  },
  {
    "word": "unremitting",
    "definition": "[끊임없음] 끊임없는"
  },
  {
    "word": "incessant",
    "definition": "[끊임없음] 끊임없는"
  },
  {
    "word": "untenable",
    "definition": "[방어 불가] 유지할 수 없는"
  },
  {
    "word": "unwarranted",
    "definition": "[정당 근거X] 정당성 없는"
  },
  {
    "word": "groundless",
    "definition": "[정당 근거X] 정당성 없는"
  },
  {
    "word": "unwillingly",
    "definition": "[마지못해] 마지못해"
  },
  {
    "word": "reluctantly",
    "definition": "[마지못해] 마지못해"
  },
  {
    "word": "unwitting",
    "definition": "[무의식] 무의식적인, 의도치 않은"
  },
  {
    "word": "upend",
    "definition": "[뒤엎다] 뒤집다, 거꾸로 세우다"
  },
  {
    "word": "uprightness",
    "definition": "[정직] 정직, 고결"
  },
  {
    "word": "utilitarian",
    "definition": "[실용] 실용적인"
  },
  {
    "word": "functional",
    "definition": "[실용] 실용적인"
  },
  {
    "word": "vacant",
    "definition": "[비다] 텅 빈"
  },
  {
    "word": "vacillate",
    "definition": "[흔들리다] 망설이다, 흔들리다"
  },
  {
    "word": "vacillate",
    "definition": "[흔들리다] 동요하다, 오락가락하다"
  },
  {
    "word": "fluctuate",
    "definition": "[흔들리다] 동요하다, 오락가락하다"
  },
  {
    "word": "vacillation",
    "definition": "[주저] 망설임"
  },
  {
    "word": "irresolution",
    "definition": "[주저] 망설임"
  },
  {
    "word": "vacuous",
    "definition": "[공허] 멍청한, 공허한"
  },
  {
    "word": "vacuousness",
    "definition": "[공허] 공허함, 부족함"
  },
  {
    "word": "paucity",
    "definition": "[공허] 공허함, 부족함"
  },
  {
    "word": "vainglorious",
    "definition": "[허영] 허영심 강한, 자만심 강한"
  },
  {
    "word": "valorize",
    "definition": "[가치 높이다] 칭송하다, 높이 평가하다"
  },
  {
    "word": "exalt",
    "definition": "[가치 높이다] 칭송하다, 높이 평가하다"
  },
  {
    "word": "vanish",
    "definition": "[사라지다] 사라지다"
  },
  {
    "word": "vapid",
    "definition": "[김빠진] 맛없는, 흥미롭지 못한"
  },
  {
    "word": "variety",
    "definition": "[다양] 다양성, 종류"
  },
  {
    "word": "varnish",
    "definition": "[칠하기] 니스칠하다, 겉치레하다"
  },
  {
    "word": "vary",
    "definition": "[바꾸다] 변하다, 달라지다"
  },
  {
    "word": "vehement",
    "definition": "[격렬] 격렬한, 맹렬한"
  },
  {
    "word": "velocity",
    "definition": "[속도] 속도"
  },
  {
    "word": "venerable",
    "definition": "[존경] 존경할 만한, 유서 깊은"
  },
  {
    "word": "respected",
    "definition": "[존경] 존경할 만한, 유서 깊은"
  },
  {
    "word": "veneration",
    "definition": "[존경] 존경, 숭배"
  },
  {
    "word": "venomous",
    "definition": "[독] 독이 있는, 원한 품은"
  },
  {
    "word": "veracious",
    "definition": "[진실] 정직한, 진실한"
  },
  {
    "word": "veracity",
    "definition": "[진실] 진실성"
  },
  {
    "word": "truth",
    "definition": "[진실] 진실성"
  },
  {
    "word": "verbose",
    "definition": "[말 많음] 장황한"
  },
  {
    "word": "prolix",
    "definition": "[말 많음] 장황한"
  },
  {
    "word": "verisimilitude",
    "definition": "[그럴듯함] 사실성, 진실처럼 보임"
  },
  {
    "word": "realism",
    "definition": "[그럴듯함] 사실성, 진실처럼 보임"
  },
  {
    "word": "versatile",
    "definition": "[다재] 다재다능한, 융통성 있는"
  },
  {
    "word": "vestige",
    "definition": "[자취] 흔적, 유물"
  },
  {
    "word": "relic",
    "definition": "[자취] 흔적, 유물"
  },
  {
    "word": "vex",
    "definition": "[괴롭히다] 괴롭히다, 성가시게 하다"
  },
  {
    "word": "vicarious",
    "definition": "[대리] 대리의, 간접적인"
  },
  {
    "word": "vigor",
    "definition": "[힘] 힘, 활력"
  },
  {
    "word": "vigorous",
    "definition": "[활력] 활기찬, 강력한"
  },
  {
    "word": "spirited",
    "definition": "[활력] 활기찬, 강력한"
  },
  {
    "word": "vilify",
    "definition": "[비난] 비방하다, 헐뜯다"
  },
  {
    "word": "censure",
    "definition": "[비난] 비방하다, 헐뜯다"
  },
  {
    "word": "vindication",
    "definition": "[정당화] 옹호, 변호"
  },
  {
    "word": "vindictive",
    "definition": "[보복] 보복심 있는, 앙심 깊은"
  },
  {
    "word": "virtue",
    "definition": "[미덕] 미덕, 장점"
  },
  {
    "word": "merit",
    "definition": "[미덕] 미덕, 장점"
  },
  {
    "word": "virtuoso",
    "definition": "[대가] 거장, 명연주자"
  },
  {
    "word": "visceral",
    "definition": "[내장] 본능적인, 감정적인"
  },
  {
    "word": "visibility",
    "definition": "[보임] 가시성, 시야"
  },
  {
    "word": "visible",
    "definition": "[눈에 보임] 뚜렷한, 분명한"
  },
  {
    "word": "salient",
    "definition": "[눈에 보임] 뚜렷한, 분명한"
  },
  {
    "word": "vitiate",
    "definition": "[손상] 손상시키다, 해치다"
  },
  {
    "word": "vitriol",
    "definition": "[독설] 신랄한 비난"
  },
  {
    "word": "opprobrium",
    "definition": "[독설] 신랄한 비난"
  },
  {
    "word": "vitriolic",
    "definition": "[신랄] 신랄한, 독설의"
  },
  {
    "word": "vituperation",
    "definition": "[욕설] 욕설, 혹평"
  },
  {
    "word": "vivacity",
    "definition": "[활력] 생기, 활기"
  },
  {
    "word": "vociferous",
    "definition": "[큰 소리] 떠들썩한, 큰소리치는"
  },
  {
    "word": "volatile",
    "definition": "[변하기 쉬움] 휘발성의, 변덕스러운"
  },
  {
    "word": "volatile",
    "definition": "[변덕] 변덕스러운, 불안정한"
  },
  {
    "word": "capricious",
    "definition": "[변덕] 변덕스러운, 불안정한"
  },
  {
    "word": "voluble",
    "definition": "[말 많음] 유창한, 수다스러운"
  },
  {
    "word": "voracious",
    "definition": "[게걸] 게걸스러운, 열성적인"
  },
  {
    "word": "vulnerable",
    "definition": "[상처 받기 쉬움] 취약한"
  },
  {
    "word": "waggish",
    "definition": "[익살] 익살맞은, 장난기 많은"
  },
  {
    "word": "wane",
    "definition": "[줄다] 줄어들다, 기울다"
  },
  {
    "word": "waning",
    "definition": "[줄어감] 쇠퇴하는, 약해지는"
  },
  {
    "word": "waning",
    "definition": "[쇠퇴] 줄어드는"
  },
  {
    "word": "declining, ebbing",
    "definition": "[쇠퇴] 줄어드는"
  },
  {
    "word": "warbling",
    "definition": "[지저귀다] 지저귀다, 떨리는 소리 내다"
  },
  {
    "word": "wary",
    "definition": "[조심] 조심하는, 경계하는"
  },
  {
    "word": "wayward",
    "definition": "[제멋대로] 고집 센, 제멋대로인"
  },
  {
    "word": "errant",
    "definition": "[제멋대로] 고집 센, 제멋대로인"
  },
  {
    "word": "wealth",
    "definition": "[풍부] 풍요, 부"
  },
  {
    "word": "profusion",
    "definition": "[풍부] 풍요, 부"
  },
  {
    "word": "wearisome",
    "definition": "[지루함] 지루한, 피곤하게 하는"
  },
  {
    "word": "weaving",
    "definition": "[짜다] 짜다, 엮다"
  },
  {
    "word": "well-defined",
    "definition": "[명확] 뚜렷하게 정의된"
  },
  {
    "word": "wherewithal",
    "definition": "[수단] 필요한 수단, 자금"
  },
  {
    "word": "whimsical",
    "definition": "[기발] 엉뚱한, 기발한"
  },
  {
    "word": "whimsy",
    "definition": "[엉뚱] 기발한 생각, 변덕"
  },
  {
    "word": "winning",
    "definition": "[매력 있다] 매력적인, 마음을 끄는"
  },
  {
    "word": "winnow",
    "definition": "[거르다] 가려내다"
  },
  {
    "word": "wistful",
    "definition": "[그리움] 아쉬운, 그리워하는"
  },
  {
    "word": "withdrawn",
    "definition": "[내성적] 내성적인, 소극적인"
  },
  {
    "word": "witless",
    "definition": "[어리석음] 어리석은, 바보 같은"
  },
  {
    "word": "dense[아둔한]",
    "definition": "[어리석음] 어리석은, 바보 같은"
  },
  {
    "word": "workaday",
    "definition": "[평범] 평범한, 일상적인"
  },
  {
    "word": "quotidian",
    "definition": "[평범] 평범한, 일상적인"
  },
  {
    "word": "yield",
    "definition": "[낳다] 산출하다, 생기게 하다"
  },
  {
    "word": "engender",
    "definition": "[낳다] 산출하다, 생기게 하다"
  },
  {
    "word": "zeal",
    "definition": "[열정] 열정, 열의"
  },
  {
    "word": "zealous",
    "definition": "[열성] 열성적인, 열렬한"
  },
  {
    "word": "impassioned",
    "definition": "[열성] 열성적인, 열렬한"
  },
  {
    "word": "zenith",
    "definition": "[정점] 절정, 정점"
  },
  {
    "word": "meretricious",
    "definition": "[겉치레] 겉만 번지르르한, 속빈"
  },
  {
    "word": "showy",
    "definition": "[겉치레] 겉만 번지르르한, 속빈"
  },
  {
    "word": "complacency",
    "definition": "[자족] 자기만족, 안일함"
  },
  {
    "word": "risible",
    "definition": "[우스움] 우스꽝스러운"
  },
  {
    "word": "facetious",
    "definition": "[우스움] 우스꽝스러운"
  },
  {
    "word": "sycophantic",
    "definition": "[아첨] 아부하는, 알랑거리는"
  },
  {
    "word": "obsequious",
    "definition": "[아첨] 아부하는, 알랑거리는"
  },
  {
    "word": "maundering",
    "definition": "[중얼거림] (의미 없는) 지껄임"
  },
  {
    "word": "screed",
    "definition": "[장광설] 지루한 긴 이야기"
  },
  {
    "word": "tedious speech",
    "definition": "[장광설] 지루한 긴 이야기"
  },
  {
    "word": "irenic",
    "definition": "[평화] 평화적인"
  },
  {
    "word": "simmer with",
    "definition": "[끓어오름] 부글부글 끓다(감정 차오름)"
  },
  {
    "word": "squelch",
    "definition": "[짓누르다] 진압하다, 억누르다"
  },
  {
    "word": "sparingly",
    "definition": "[아껴] 조금씩, 절약하여"
  },
  {
    "word": "catholic",
    "definition": "[보편] 보편적인, 전반적인"
  },
  {
    "word": "underscore",
    "definition": "[강조] 강조하다"
  },
  {
    "word": "highlight",
    "definition": "[강조] 강조하다"
  },
  {
    "word": "nebulous",
    "definition": "[흐리다] 흐릿한, 모호한"
  },
  {
    "word": "vague",
    "definition": "[흐리다] 흐릿한, 모호한"
  },
  {
    "word": "approbation",
    "definition": "[찬성] 승인, 칭찬"
  },
  {
    "word": "adulation",
    "definition": "[찬성] 승인, 칭찬"
  },
  {
    "word": "redemptive",
    "definition": "[구원] 구원하는, 속죄하는"
  },
  {
    "word": "decry",
    "definition": "[헐뜯다] 비난하다, 매도하다"
  }
];
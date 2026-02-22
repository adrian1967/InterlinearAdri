<script>
  // -----------------------------
  // ETAT GLOBAL
  // -----------------------------
  let selectedWord = null;

  let currentBook = "John";
  let currentChapter = 1;
  let currentVerseNum = 1;

  // "read" | "chapters" | "verses"
  let view = "read";

  // -----------------------------
  // LEXIQUE (version courte)
  // -----------------------------

  const lexicon = {

  en: {
  strong: "G1722",
  lexical: "ἐν",
  transliteration: "en",
  partOfSpeech: "Preposition",
  phoneticSpelling: "en",
  definition: "in, on, at, by, with.",
  origin: "A primary preposition denoting (fixed) position (in place, time or state), and (by implication) instrumentality (medially or constructively), i.e. A relation of rest (intermediate between eis and ek); \"in,\" at, (up-)on, by, etc..",
  usage: "about, after, against, + almost, X altogether, among, X as, at, before, between, (here-)by (+ all means), for (... Sake of), + give self wholly to, (here-)in(-to, -wardly), X mightily, (because) of, (up-)on, (open-)ly, X outwardly, one, X quickly, X shortly, (speedi-)ly, X that, X there(-in, -on), through(-out), (un-)to(-ward), under, when, where(-with), while, with(-in). Often used in compounds, with substantially the same import; rarely with verbs of motion, and then not to indicate direction, except (elliptically) by a separate (and different) preposition.",
  translatedAsCount: "in (2177), with (130), among (125), by (111), on (73), At (41), into (26), within (16), during (11), through (10), to (10), as (5), under (3), along (2), as to (2), because of (2), besides (2), in regard to (2), throughout (2), wherein (2), while (2), afterward (1), amid (1), amidst (1), before (1), between (1), But in (1), For (1), in all (1), in the (1), in the midst of (1), of (1), outwardly (1), the in (1), toward (1), until (1), When (1), With respect to (1), with the (1)."
},

arche: {
  strong: "G746",
  lexical: "ἀρχή",
  transliteration: "arché",
  partOfSpeech: "Noun, Feminine",
  phoneticSpelling: "ar-khay'",
  definition: "(a) rule (kingly or magisterial), (b) plur: in a quasi-personal sense, almost: rulers, magistrates, (c) beginning.",
  origin: "From archomai; (properly abstract) a commencement, or (concretely) chief (in various applications of order, time, place, or rank).",
  usage: "beginning, corner, (at the, the) first (estate), magistrate, power, principality, principle, rule.",
  translatedAsCount: "beginning (42), rulers (5), corners (2), rule (2), a commencement (1), domain (1), dominion (1), principalities (1), principality (1), to rulers (1)."
},

  eimi: {
  strong: "G1510",
  lexical: "εἰμί",
  transliteration: "eimi",
  partOfSpeech: "Verb",
  phoneticSpelling: "i-mee'",
  definition: "I exist, I am.",
  origin: "The first person singular present indicative; a prolonged form of a primary and defective verb; I exist (used only when emphatic).",
  usage: "am, have been, X it is I, was. See also ei, eien, einai, heis kath heis, en, esomai, esmen, este, esti, kerdos, isthi, o.",
  translatedAsCount: "is (603), are (242), was (166), being (147), it is (112), to be (109), will be (85), am (80), were (65), You are (65), He is (64), there is (52), He was (51), I am (50), they are (38), There was (33), we are (32), there are (31), it was (28), they were (26), there will be (25), is it (22), are you (21), may be (17), There were (16), you will be (16), you were (13), it will be (12), are they (11), I was (11), might be (11), Be (10), I will be (8), We were (8), am I (7), he will be (7), is He (7), will it be (7), had been (6), you may be (6), she is (5), he might be (4), Let be (4), let him be (4), Shall be (4), we will be (4), are we (3), He had been (3), Let it be (3), should be (3), there being (3), they may be (3), they will be (3), was it (3), will become (3), will I be (3), will there be (3), as being (2), be it (2), existed (2), existing (2), having been (2), He may be (2), He were (2), is there (2), it be (2), it being (2), It would be (2), shall have been (2), she was (2), there should be (2), there to be (2), they had been (2), they should be (2), will she be (2), would be (2), You had been (2), you shall be (2), are there (1), are to be (1), be absorbed (1), Be it so (1), belongs (1), came about (1), comes (1), consists (1), exist (1), had (1), have been (1), He (1), He exists (1), he had (1), he remained (1), he stood (1), himself to be (1), I (1), I shall be (1), I would be (1), if (1), it might be (1), it shall (1), it shall be (1), It was they (1), it were (1), it will be done (1), It will happen that (1), it would have been (1), let there be (1), may it be (1), means (1), might appear (1), might have been (1), remain (1), shall it be (1), she being (1), she should be (1), that will be (1), there be (1), these were (1), they continued (1), they existed (1), they had (1), they might be (1), to become (1), to remain (1), was He (1), was there (1), we had lived (1), we might be (1), we should be (1), we would have been (1), were they (1), would have emerged (1), would He be (1), would it be (1), you used to be (1), you would be (1), you yourselves are (1)."
},

ho: {
  strong: "G3588",
  lexical: "ὁ",
  transliteration: "ho",
  partOfSpeech: "Definite Article",
  phoneticSpelling: "ho",
  definition: "the, the definite article.",
  origin: "Including the feminine he (hay), and the neuter to (to) in all their inflections; the definite article; the (sometimes to be supplied, at others omitted, in English idiom).",
  usage: "the, this, that, one, he, she, it, etc.",
  translatedAsCount: "the (10868), - (5328), of the (1592), To the (451), those (425), that (133), The things (129), of (100), in the (92), who (82), to those (74), to (70), with the (64), on the (58), of those (51), for the (50), which (39), by the (31), that which (29), a (25), what (20), things (17), with (15), at the (14), he who (14), Some (13), than the (13), those who (13), from the (10), his (9), in (8), their (8), this (7), to the things (6), by (5), O (5), they (5), to him (5), for those (4), from (4), Him who (4), our (4), the one (4), the ones (4), these things (4), to whom (4), you (4), among the (3), for (3), of that (3), One (3), Others (3), over the (3), such (3), who were (3), with those (3), about the (2), during the (2), He (2), her (2), him (2), In this (2), into the (2), of that which (2), of the things (2), of this (2), of those who (2), on those (2), She (2), the thing (2), to her (2), to that (2), unto (2), who are (2), who was (2), about (1), according to the (1), against (1), anything (1), as the (1), at (1), at that (1), before (1), belonging to the (1), between the (1), by the things (1), by those (1), for that which (1), from those (1), he who is (1), however (1), in one (1), in the things (1), in things (1), it (1), its (1), my (1), of her (1), of him (1), of what (1), of your (1), on (1), She who (1), Since (1), than (1), than those (1), that of (1), that was (1), the of the (1), the same (1), the same things (1), their own (1), them (1), these (1), thing (1), those ones (1), those that (1), to Him who (1), to His (1), to the one (1), to the own (1), to those who (1), toward the (1), unto those (1), upon the (1), what is (1), which is (1), who is (1), whole (1), whom (1), whose (1)."
},

ton: {
  strong: "G3588",
  lexical: "τὸν",
  transliteration: "ton",
  partOfSpeech: "Definite Article",
  phoneticSpelling: "ton",
  definition: "the, the definite article.",
  origin: "Including the feminine he (hay), and the neuter to (to) in all their inflections; the definite article; the (sometimes to be supplied, at others omitted, in English idiom).",
  usage: "the, this, that, one, he, she, it, etc.",
  translatedAsCount: "the (10868), - (5328), of the (1592), To the (451), those (425), that (133), The things (129), of (100), in the (92), who (82), to those (74), to (70), with the (64), on the (58), of those (51), for the (50), which (39), by the (31), that which (29), a (25), what (20), things (17), with (15), at the (14), he who (14), Some (13), than the (13), those who (13), from the (10), his (9), in (8), their (8), this (7), to the things (6), by (5), O (5), they (5), to him (5), for those (4), from (4), Him who (4), our (4), the one (4), the ones (4), these things (4), to whom (4), you (4), among the (3), for (3), of that (3), One (3), Others (3), over the (3), such (3), who were (3), with those (3), about the (2), during the (2), He (2), her (2), him (2), In this (2), into the (2), of that which (2), of the things (2), of this (2), of those who (2), on those (2), She (2), the thing (2), to her (2), to that (2), unto (2), who are (2), who was (2), about (1), according to the (1), against (1), anything (1), as the (1), at (1), at that (1), before (1), belonging to the (1), between the (1), by the things (1), by those (1), for that which (1), from those (1), he who is (1), however (1), in one (1), in the things (1), in things (1), it (1), its (1), my (1), of her (1), of him (1), of what (1), of your (1), on (1), She who (1), Since (1), than (1), than those (1), that of (1), that was (1), the of the (1), the same (1), the same things (1), their own (1), them (1), these (1), thing (1), those ones (1), those that (1), to Him who (1), to His (1), to the one (1), to the own (1), to those who (1), toward the (1), unto those (1), upon the (1), what is (1), which is (1), who is (1), whole (1), whom (1), whose (1)."
},


  logos: {
  strong: "G3056",
  lexical: "λόγος",
  transliteration: "logos",
  partOfSpeech: "Noun, Masculine",
  phoneticSpelling: "log'-os",
  definition: "a word (as embodying an idea), a statement, a speech.",
  origin: "From lego; something said (including the thought); by implication, a topic (subject of discourse), also reasoning (the mental faculty) or motive; by extension, a computation; specially, (with the article in John) the Divine Expression (i.e. Christ).",
  usage: "account, cause, communication, X concerning, doctrine, fame, X have to do, intent, matter, mouth, preaching, question, reason, + reckon, remove, say(-ing), shew, X speaker, speech, talk, thing, + none of these things move me, tidings, treatise, utterance, word, work.",
  translatedAsCount: "word (177), words (51), saying (9), a word (8), account (8), speech (8), message (6), report (4), statement (4), talk (4), in word (3), matter (3), the words (3), thing (3), an account (2), by word (2), of word (2), reason (2), the word (2), a matter (1), a reason (1), accounts (1), an appearance (1), by a word (1), by words (1), commandment (1), divine utterance (1), His words (1), in a word (1), in discourse (1), in speech (1), in talk (1), instruction (1), of discourse (1), of speech (1), of words (1), on account (1), one thing (1), question (1), reckoning (1), remark (1), sayings (1), sentence (1), speaker (1), teaching (1), the matter (1), things (1), what he says (1), with talk (1), with words (1)."
},

  kai: {
  strong: "G2532",
  lexical: "καί",
  transliteration: "kai",
  partOfSpeech: "Conjunction",
  phoneticSpelling: "kahee",
  definition: "and, even, also, namely.",
  origin: "Apparently, a primary particle, having a copulative and sometimes also a cumulative force; and, also, even, so then, too, etc.; often used in connection (or composition) with other particles or small words.",
  usage: "and, also, both, but, even, for, if, or, so, that, then, therefore, when, yet.",
  translatedAsCount: "and (8135), also (695), even (108), both (41), But (17), and yet (16), Then (16), that (13), and also (9), indeed (7), or (5), Although (3), yet (3), and then (2), including (2), again (1), also even (1), and even (1), as well (1), For (1), For even (1), however (1), nor (1), only (1), other (1), Truly (1), with (1)."
},

pros: {
  strong: "G4314",
  lexical: "πρός",
  transliteration: "pros",
  partOfSpeech: "Preposition",
  phoneticSpelling: "pros",
  definition: "advantageous for, at (denotes local proximity), toward (denotes motion toward a place).",
  origin: "A strengthened form of pro; a preposition of direction; forward to, i.e. Toward (with the genitive case, the side of, i.e. Pertaining to; with the dative case, by the side of, i.e. Near to; usually with the accusative case, the place, time, occasion, or respect, which is the destination of the relation, i.e. Whither or for which it is predicated).",
  usage: "about, according to, against, among, at, because of, before, between, (where-)by, for, X at thy house, in, for intent, nigh unto, of, which pertain to, that, to (the end that), X together, to (you) -ward, unto, with(-in). In the comparative case, it denotes essentially the same applications, namely, motion towards, accession to, or nearness at.",
  translatedAsCount: "to (476), with (48), for (45), toward (31), against (22), at (20), unto (18), among (10), in order (6), according to (3), as to (3), by (3), near (2), relating to (2), about (1), as (1), As for (1), Because of (1), before (1), between (1), close to (1), from (1), in (1), in view of (1), into (1), of (1), pertaining to (1), so as (1), with a view to (1), within (1)."
},

theos: {
  strong: "G2316",
  lexical: "θεός",
  transliteration: "theos",
  partOfSpeech: "Noun, Feminine; Noun, Masculine",
  phoneticSpelling: "theh'-os",
  definition: "(a) God, (b) a god, generally.",
  origin: "Of uncertain affinity; a deity, especially (with ho) the supreme Divinity; figuratively, a magistrate; by Hebraism, very.",
  usage: "X exceeding, God, god(-ly, -ward).",
  translatedAsCount: "God (718), of God (505), to God (68), God’s (11), gods (8), with God (3), for God (2), from God (2), the God (2), a god (1), between God (1), by God (1), divinely (1), goddess (1), in God (1), O God (1), Of a god (1), of God’s (1), toward God (1)"
},

  houtos: {
    strong: "G3779",
    lexical: "οὕτως",
    transliteration: "houtós",
    partOfSpeech: "Adverb",
    phoneticSpelling: "hoo'-to",
    definition: "thus, so, in this manner.",
    origin: "Or (before a vowel houtos hoo'-toce); adverb from houtos; in this way (referring to what precedes or follows).",
    usage: "after that, after (in) this manner, as, even (so), for all that, like(-wise), no more, on this fashion(-wise), so (in like manner), thus, what.",
    translatedAsCount: "thus (94), so (87), in this way (7), like this (5), in this manner (3), this (3), in the same manner (2), in the same way (2), this way (2), as they were (1), by thus (1), that (1), thus so (1)."
  },

  gar: {
    strong: "G1063",
    lexical: "γάρ",
    transliteration: "gar",
    partOfSpeech: "Conjunction",
    phoneticSpelling: "gar",
    definition: "for, indeed (a conjunction used to express cause, explanation, inference or continuation).",
    origin: "A primary particle; properly, assigning a reason (used in argument, explanation or intensification; often with other particles).",
    usage: "and, as, because (that), but, even, for, indeed, no doubt, seeing, then, therefore, verily, what, why, yet.",
    translatedAsCount: "for (1009), indeed (25), however (2), then (2), therefore (2), though (2), truly (2), - (1), As for (1), just (1)."
  },

  agapao: {
    strong: "G25",
    lexical: "ἀγαπάω",
    transliteration: "agapaó",
    partOfSpeech: "Verb",
    phoneticSpelling: "ag-ap-ah'-o",
    definition: "to love, wish well to, take pleasure in, long for; denotes the love of reason, esteem.",
    origin: "Perhaps from agan (much); to love (in a social or moral sense).",
    usage: "(be-)love(-ed). Compare phileo.",
    translatedAsCount: "loving (24), loved (15), love (12), You shall love (10), to love (8), loves (7), you love (7), we should love (6), having loved (5), Beloved (4), you loved (4), having been loved (3), He loved (3), he loves (3), should love (3), we love (3), will love (3), have loved (2), he will love (2), I have loved (2), I love (2), love you (2), has loved (1), having been beloved (1), I am loved (1), I do love (1), I loved (1), let love (1), she loved (1), they have loved (1), they loved (1), will be loved (1), You have loved (1), you should love (1), you would have loved (1)."
  },

  kosmos: {
    strong: "G2889",
    lexical: "κόσμος",
    transliteration: "kosmos",
    partOfSpeech: "Noun, Masculine",
    phoneticSpelling: "kos'-mos",
    definition: "the world, universe; worldly affairs; the inhabitants of the world; adornment.",
    origin: "Probably from the base of komizo; orderly arrangement, i.e. Decoration; by implication, the world (in a wide or narrow sense, including its inhabitants, literally or figuratively (morally)).",
    usage: "adorning, world.",
    translatedAsCount: "world (169), of world (13), adorning (1), earth (1), in this world (1), the world (1)."
  },

  hoste: {
    strong: "G5620",
    lexical: "ὥστε",
    transliteration: "hóste",
    partOfSpeech: "Conjunction",
    phoneticSpelling: "hoce'-teh",
    definition: "so that, therefore, so then, so as to.",
    origin: "From hos and te; so too, i.e. Thus therefore (in various relations of consecution, as follow).",
    usage: "(insomuch) as, so that (then), (insomuch) that, therefore, to, wherefore.",
    translatedAsCount: "so that (25), Therefore (13), so as (11), so as for (11), So then (7), So (6), in order for (3), in order (2), that (2), as (1), Likewise (1), Thus (1)."
  },

  huios: {
    strong: "G5207",
    lexical: "υἱός",
    transliteration: "huios",
    partOfSpeech: "Noun, Masculine",
    phoneticSpelling: "hwee-os'",
    definition: "a son, descendent.",
    origin: "Apparently a primary word; a \"son\" (sometimes of animals), used very widely of immediate, remote or figuratively, kinship.",
    usage: "child, foal, son.",
    translatedAsCount: "son (284), sons (67), a son (19), the Son (6), of sons (2), foal (1), His Son (1), sons of (1), to sons (1)."
  },
monogenes: {
  strong: "G3439",
  lexical: "μονογενής",
  transliteration: "monogenés",
  partOfSpeech: "Adjective",
  phoneticSpelling: "mon-og-en-ace'",
  definition: "only, only-begotten; unique.",
  origin: "From monos and ginomai; only-born, i.e. Sole.",
  usage: "only (begotten, child).",
  translatedAsCount: "only begotten (4), an only (1), an only child (1), of an only begotten (1), one and only (1), only begotten son (1)."
},

didomi: {
  strong: "G1325",
  lexical: "δίδωμι",
  transliteration: "didómi",
  partOfSpeech: "Verb",
  phoneticSpelling: "did'-o-mee",
  definition: "to offer, give; to put, place.",
  origin: "A prolonged form of a primary verb (which is used as an alternative in most of the tenses); to give (used in a very wide application, properly, or by implication, literally or figuratively; greatly modified by the connection).",
  usage: "adventure, bestow, bring forth, commit, deliver (up), give, grant, hinder, make, minister, number, offer, have power, put, receive, set, shew, smite (+ with the hand), strike (+ with the palm of the hand), suffer, take, utter, yield.",
  translatedAsCount: "give (36), to give (34), gave (27), has given (21), will give (21), He gave (20), was given (17), having given (15), having been given (14), I will give (14), You have given (12), gives (10), I give (9), will be given (8), giving (7), it will be given (7), you gave (7), he will give (5), they gave (5), Had given (4), Has been given (4), He has given (4), is given (4), to be given (4), were given (4), given (3), grant (3), He gives (3), it has been given (3), may give (3), putting (3), there was given (3), was giving (3), did you give (2), gave up (2), have given (2), He kept giving (2), He may give (2), I have given (2), it has been granted (2), May grant (2), might be given (2), they will give (2), will I give (2), you give (2), are giving (1), began to take (1), began yielding (1), did give (1), granting (1), had been given (1), has put (1), have been given (1), have been granted (1), having been bestowed (1), He did give (1), he had given (1), He might give (1), he should give (1), he will offer (1), He would have given (1), I gave (1), I have set (1), I will grant (1), I will show (1), inflicting (1), is giving (1), it had been given (1), it may give (1), it should give (1), it was given (1), it was granted (1), it yielded (1), kept giving (1), let him give (1), may be given (1), may He give (1), pay (1), placing (1), shall give (1), Should we pay (1), there will be given (1), they give (1), they kept giving (1), they shall give up (1), they were offering (1), to grant (1), to have been given (1), to offer (1), to venture (1), was granted (1), we gave (1), we may offer (1), we might give (1), we should place (1), were yielding (1), will they put (1), will You allow (1), You will allow (1), you would have given (1)."
},

hina: {
  strong: "G2443",
  lexical: "ἵνα",
  transliteration: "hina",
  partOfSpeech: "Conjunction",
  phoneticSpelling: "hin'-ah",
  definition: "in order that, that, so that.",
  origin: "Probably from the same as the former part of heautou (through the demonstrative idea; compare ho); in order that (denoting the purpose or the result).",
  usage: "albeit, because, to the intent (that), lest, so as, (so) that, (for) to. Compare hina me.",
  translatedAsCount: "that (390), so that (262), in order that (11), so (2), - (1), in order (1), in that (1), that it (1), Thus (1), when (1)."
},

pas: {
  strong: "G3956",
  lexical: "πᾶς",
  transliteration: "pas",
  partOfSpeech: "Adjective",
  phoneticSpelling: "pas",
  definition: "all, the whole, every kind of.",
  origin: "Including all the forms of declension; apparently a primary word; all, any, every, the whole.",
  usage: "all (manner of, means), alway(-s), any (one), X daily, + ever, every (one, way), as many as, + no(-thing), X thoroughly, whatsoever, whole, whosoever.",
  translatedAsCount: "All (693), All things (146), every (138), everyone (60), of all (44), to all (36), everything (32), any (19), to everyone (10), than all (7), of every (6), Anyone (5), among all (3), for all (3), in all (3), in all things (3), of all things (3), with all (3), anything (2), every one (2), of full (2), over all (2), to every (2), all kinds of (1), all of you (1), all the things (1), all these (1), all this (1), all those (1), altogether (1), always (1), by all (1), by every (1), complete (1), each one (1), ever (1), in every (1), In everything (1), of all kinds (1), of any (1), of everything (1), on all (1), the entire (1), the whole (1), upon every (1), Whoever (1), whole (1), with all things (1), with every (1)."
},

pisteuo: {
  strong: "G4100",
  lexical: "πιστεύω",
  transliteration: "pisteuó",
  partOfSpeech: "Verb",
  phoneticSpelling: "pist-yoo'-o",
  definition: "to believe, have faith in, trust in; pass: to be entrusted with.",
  origin: "From pistis; to have faith (in, upon, or with respect to, a person or thing), i.e. Credit; by implication, to entrust (especially one's spiritual well-being to Christ).",
  usage: "believe(-r), commit (to trust), put in trust with.",
  translatedAsCount: "believing (54), believe (27), believed (25), having believed (22), to believe (9), you believe (8), they believed (6), Believe you (5), I believe (5), we believe (5), have believed (4), believes (3), did you believe (3), has believed (3), he believed (3), will you believe (3), you have believed (3), you should believe (3), have been entrusted (2), he has believed (2), may believe (2), might believe (2), were believing (2), you believed (2), you did believe (2), you may believe (2), you might believe (2), did believe (1), did entrust (1), did they believe (1), do believe (1), do they believe (1), do you believe (1), have come to believe (1), I am entrusted with (1), I believed (1), I have been entrusted with (1), I have believed (1), I may believe (1), is belief (1), shall believe (1), shall they believe on (1), they had believed (1), they may believe (1), they should believe (1), they were entrusted with (1), to be entrusted with (1), was believed (1), was believed on (1), we believed (1), we should believe (1), we will believe (1), who believed (1), will believe (1), will entrust (1), will I believe (1), would you believe (1), you do believe (1), you shall believe (1), you were believing (1), you would believe (1), you would have believed (1)."
},

eis: {
  strong: "G1519",
  lexical: "εἰς",
  transliteration: "eis",
  partOfSpeech: "Preposition",
  phoneticSpelling: "ice",
  definition: "to or into (indicating the point reached or entered, of place, time, purpose, result).",
  origin: "A primary preposition; to or into (indicating the point reached or entered), of place, time, or (figuratively) purpose (result, etc.); also in adverbial phrases.",
  usage: "(abundant-)ly, against, among, as, at, (back-)ward, before, by, concerning, + continual, + far more exceeding, for (intent, purpose), fore, + forth, in (among, at, unto, -so much that, -to), to the intent that, + of one mind, + never, of, (up-)on, + perish, + set at one again, (so) that, therefore(-unto), throughout, til, to (be, the end, -ward), (here-)until(-to),...ward, (where-)fore, with. Often used in composition with the same general import, but only with verbs (etc.) Expressing motion (literally or figuratively).",
  translatedAsCount: "into (569), to (568), For (188), in (161), unto (72), toward (44), on (30), at (23), against (18), among (13), in order (13), upon (13), as (11), as to (8), so as (8), of (3), to the (3), about (2), by (2), in order for (2), over (2), so as for (2), the (2), until (2), Accordingly (1), and (1), back (1), for the (1), for the purpose of (1), for this (1), For what (1), in regard to (1), in respect to (1), onto (1), so that (1), to result in (1), To this (1), with (1), with regard to (1)."
},

autos: {
  strong: "G846",
  lexical: "αὐτός",
  transliteration: "autos",
  partOfSpeech: "Personal Pronoun",
  phoneticSpelling: "ow-tos'",
  definition: "(1) self (emphatic) (2) he, she, it (used for the third person pronoun) (3) the same.",
  origin: "From the particle au (perhaps akin to the base of aer through the idea of a baffling wind) (backward); the reflexive pronoun self, used (alone or in the comparative heautou) of the third person, and (with the proper personal pronoun) of the other persons.",
  usage: "her, it(-self), one, the other, (mine) own, said, (self-), the) same, ((him-, my-, thy-)self, (your-)selves, she, that, their(-s), them(-selves), there(-at, - by, -in, -into, -of, -on, -with), they, (these) things, this (man), those, together, very, which. Compare hautou.",
  translatedAsCount: "him (1426), of him (1047), them (689), to him (448), to them (387), of them (369), it (227), He (137), her (96), of her (96), of it (81), they (78), same (62), to her (48), Himself (46), his (46), their (21), He Himself (19), themselves (17), for him (16), to it (15), yourselves (12), for them (11), of himself (11), myself (10), the same (9), on them (8), she (8), itself (7), on him (7), by Him (6), of His (6), with him (6), You yourselves (6), ourselves (5), these (5), this very (5), against him (4), likewise (4), than he (4), with them (4), by them (3), I myself (3), of herself (3), same thing (3), same things (3), that (3), theirs (3), these things (3), They themselves (3), this (3), upon them (3), We ourselves (3), yourself (3), against them (2), as He (2), from Him (2), in it (2), in them (2), place (2), unto him (2), very (2), - (1), a woman (1), about them (1), among them (1), as them (1), at her (1), at him (1), before Him (1), between them (1), both theirs (1), for her (1), from it (1), he answered (1), herself (1), in Him (1), in person (1), in those things (1), its (1), number (1), of themselves (1), of these (1), on her (1), On His part (1), one (1), over them (1), own (1), selves (1), than them (1), than they (1), the same things (1), their own (1), thereof (1), this very thing (1), to these (1), to those who (1), upon her (1), upon him (1), very thing (1), we (1), with it (1)."
},

me: {
  strong: "G3361",
  lexical: "μή",
  transliteration: "mé",
  partOfSpeech: "Particle, Negative",
  phoneticSpelling: "may",
  definition: "not, that...not, lest (used for qualified negation).",
  origin: "A primary particle of qualified negation (whereas ou expresses an absolute denial); (adverb) not, (conjunction) lest; also (as an interrogative implying a negative answer (whereas ou expects an affirmative one)) whether.",
  usage: "any but (that), X forbear, + God forbid, + lack, lest, neither, never, no (X wise in), none, nor, (can-)not, nothing, that not, un(-taken), without. Often used in compounds in substantially the same relations. See also ean me, hina me, ou me, mekos, mekuno, men, me ouk.",
  translatedAsCount: "not (958), lest (46), Never (17), no (15), Nothing (6), Neither (5), nor (5), none (3), not even (2), - (1), at all (1), but (1), except (1), no more (1), not at all (1), whether (1), without (1)."
},

apollumi: {
  strong: "G622",
  lexical: "ἀπόλλυμι",
  transliteration: "apollumi",
  partOfSpeech: "Verb",
  phoneticSpelling: "ap-ol'-loo-mee",
  definition: "(a) to kill, destroy, (b) to lose, mid: to be perishing (the resultant death being viewed as certain).",
  origin: "From apo and the base of olethros; to destroy fully (reflexively, to perish, or lose), literally or figuratively.",
  usage: "destroy, die, lose, mar, perish.",
  translatedAsCount: "to destroy (8), will lose (7), should perish (6), perishing (4), will perish (4), having been lost (3), perished (3), they might destroy (3), being lost (2), destroyed (2), has perished (2), having lost (2), he destroyed (2), I lost (2), might lose (2), shall he lose (2), to perish (2), we are perishing (2), will be destroyed (2), will destroy (2), you will perish (2), am perishing (1), are destroyed (1), are perishing (1), being destroyed (1), destroy (1), has been lost (1), have departed (1), have perished (1), having destroyed (1), having perished (1), he was lost (1), He will destroy (1), I should lose (1), I will destroy (1), Is destroyed (1), is perishing (1), it might destroy (1), loses (1), lost (1), may be lost (1), might destroy (1), shall they perish (1), she should lose (1), should destroy (1), they perished (1), we perish (1), were destroyed (1), you should lose (1)."
},

alla: {
  strong: "G235",
  lexical: "ἀλλά",
  transliteration: "alla",
  partOfSpeech: "Conjunction",
  phoneticSpelling: "al-lah'",
  definition: "otherwise, on the other hand, but.",
  origin: "Neuter plural of allos; properly, other things, i.e. (adverbially) contrariwise (in many relations).",
  usage: "and, but (even), howbeit, indeed, nay, nevertheless, no, notwithstanding, save, therefore, yea, yet.",
  translatedAsCount: "but (588), Instead (15), yet (13), rather (9), Nevertheless (3), but only (2), but rather (2), However (2), In fact (2), but instead (1), but other (1), certainly (1), except (1), No (1), On the contrary (1), other (1), Yes (1)."
},

echo: {
  strong: "G2192",
  lexical: "ἔχω",
  transliteration: "echó",
  partOfSpeech: "Verb",
  phoneticSpelling: "ekh'-o",
  definition: "to have, hold, possess.",
  origin: "Including an alternate form scheo skheh'-o; (used in certain tenses only); a primary verb; to hold (used in very various applications, literally or figuratively, direct or remote; such as possession; ability, contiuity, relation, or condition).",
  usage: "be (able, X hold, possessed with), accompany, + begin to amend, can(+ -not), X conceive, count, diseased, do + eat, + enjoy, + fear, following, have, hold, keep, + lack, + go to law, lie, + must needs, + of necessity, + need, next, + recover, + reign, + rest, + return, X sick, take for, + tremble, + uncircumcised, use.",
  translatedAsCount: "having (211), has (63), you have (55), have (48), I have (35), we have (34), he has (25), had (23), to have (20), they have (14), being (12), have you (11), holding (9), he had (8), have we (7), they had (7), may have (6), hold (5), will have (5), I had (4), I might have (4), might have (4), you may have (4), you will have (4), following (3), I should have (3), it had (3), let have (3), should have (3), they may have (3), they were holding (3), they would have had (3), we may have (3), do you have (2), has it (2), having had (2), I am (2), she had (2), to be (2), we have had (2), we might have (2), you have had (2), you would have (2), accompanying (1), are (1), are You (1), being able (1), gain possession of (1), Had seized (1), had you (1), has he (1), having been (1), he does have (1), he got (1), he has been (1), He holds (1), He is holding (1), he may have (1), he might have (1), he will have (1), I am having (1), I kept (1), incurring (1), is (1), is coming to (1), is he (1), is holding (1), it has (1), keep (1), keeping (1), neighboring (1), retain (1), she could (1), she has (1), they are (1), they had upheld (1), they might have (1), they will be (1), We are having (1), we had (1), were (1), were holding (1), will hold (1), you are (1), you consider (1), you might have (1), you shall have (1), you should have (1), you took (1)."
},

zoe: {
  strong: "G2222",
  lexical: "ζωή",
  transliteration: "zóé",
  partOfSpeech: "Noun, Feminine",
  phoneticSpelling: "dzo-ay'",
  definition: "life, both of physical (present) and of spiritual (particularly future) existence.",
  origin: "From zao; life (literally or figuratively).",
  usage: "life(-time). Compare psuche.",
  translatedAsCount: "life (97), of life (34), living (2), lifetime (1), of a life (1)."
},

aionios: {
  strong: "G166",
  lexical: "αἰώνιος",
  transliteration: "aiónios",
  partOfSpeech: "Adjective",
  phoneticSpelling: "ahee-o'-nee-os",
  definition: "age-long, and therefore: practically eternal, unending; partaking of the character of that which lasts for an age, as contrasted with that which is brief and fleeting.",
  origin: "From aion; perpetual (also used of past time, or past and future as well).",
  usage: "eternal, for ever, everlasting, world (began).",
  translatedAsCount: "eternal (66), an eternal (1), eternally (1), everlasting (1), of eternal (1), of the ages (1)."
}


};

let selectedKey = null;

function normalizeWord(w) {
  if (!w) return null;
  return {
    ...w,
    // harmonisation des champs (compat ancien/nouveau)
    phonetic: w.phonetic ?? w.phoneticSpelling ?? "",
    translatedAs: w.translatedAs ?? w.translatedAsCount ?? ""
  };
}

function select(key) {
  selectedKey = (selectedKey === key) ? null : key;
  selectedWord = selectedKey ? normalizeWord(lexicon[selectedKey]) : null;
}



  function copyLexicon() {
    if (!selectedWord) return;

    const text = `
${selectedWord.lexical} — Strong’s ${selectedWord.strong}

Transliteration: ${selectedWord.transliteration}
Part of Speech: ${selectedWord.partOfSpeech}
Phonetic Spelling: ${selectedWord.phonetic ?? selectedWord.phoneticSpelling ?? ""}

Definition:
${selectedWord.definition}

Origin:
${selectedWord.origin}

Usage:
${selectedWord.usage}

Translated as (count):
${selectedWord.translatedAs ?? selectedWord.translatedAsCount ?? ""}
    `.trim();

    navigator.clipboard?.writeText(text);
  }

  // -----------------------------
  // CHAPITRES / VERSETS
  // -----------------------------
  // John a 21 chapitres.
  // John 1 a 51 versets.
  // Les autres chapitres sont placeholders (à compléter).
  const CHAPTERS = {
    John: {
      1: 51,
      2: 25,
      3: 36,
      4: 54,
      5: 47,
      6: 71,
      7: 53,
      8: 59,
      9: 41,
      10: 42,
      11: 57,
      12: 50,
      13: 38,
      14: 31,
      15: 27,
      16: 33,
      17: 26,
      18: 40,
      19: 42,
      20: 31,
      21: 25
    }
  };

// -----------------------------
// LISTES POUR LES MENUS (chapitres / versets)
// -----------------------------

// Liste des chapitres (ex: [1..21] pour John)
$: chapterNums = Object.keys(CHAPTERS?.[currentBook] ?? {})
  .map(Number)
  .sort((a, b) => a - b);

// Nombre de versets dans le chapitre courant
$: maxVerses = CHAPTERS?.[currentBook]?.[currentChapter] ?? 0;

// Liste des versets (ex: [1..51] si chapitre 1)
$: verseNums = Array.from({ length: maxVerses }, (_, i) => i + 1);


// -----------------------------
// VERSES (contenu par verset)
// -----------------------------
const VERSE_DATA = {
  John: {

    // =========================
    // CHAPITRE 1
    // =========================
    1: {

      1: [
        // Ligne 1
        [
          { key: "en", trans: "In", greek: "Ἐν", pron: "en" },
          { dim: true, trans: "[the]" },
          { key: "arche", trans: "beginning", greek: "ἀρχῇ", pron: "archē" },
          { key: "eimi", trans: "was", greek: "ἦν", pron: "ēn" },
          { key: "ho", trans: "the", greek: "ὁ", pron: "ho" }
        ],

        // Ligne 2
        [
          { key: "logos", trans: "Word", greek: "Λόγος", pron: "logos" },
          { key: "kai", trans: "and", greek: "καὶ", pron: "kai" },
          { key: "ho", trans: "the", greek: "ὁ", pron: "ho" },
          { key: "logos", trans: "Word", greek: "Λόγος", pron: "logos" },
          { key: "eimi", trans: "was", greek: "ἦν", pron: "ēn" }
        ],

        // Ligne 3
        [
          { key: "pros", trans: "with", greek: "πρὸς", pron: "pros" },
          { key: "ton", trans: "—", greek: "τὸν", pron: "ton" },
          { key: "theos", trans: "God", greek: "Θεόν", pron: "theon" },
          { key: "kai", trans: "and", greek: "καὶ", pron: "kai" },
          { key: "theos", trans: "God", greek: "Θεὸς", pron: "theos" }
        ],

        // Ligne 4
        [
          { key: "eimi", trans: "was", greek: "ἦν", pron: "ēn" },
          { key: "ho", trans: "the", greek: "ὁ", pron: "ho" },
          { key: "logos", trans: "Word", greek: "Λόγος", pron: "logos" }
        ]
      ],

      7: [
        [
          { key: "houtos", trans: "He", greek: "Οὗτος", pron: "houtos" },
          { key: "erchomai", trans: "came", greek: "ἦλθεν", pron: "ēlthen" },
          { key: "eis", trans: "for", greek: "εἰς", pron: "eis" },
          { dim: true, trans: "[a]" },
          { key: "martyria", trans: "witness", greek: "μαρτυρίαν", pron: "marturian" }
        ]
      ]
    },

    // =========================
// CHAPITRE 3
// =========================
3: {

  16: [

    // Ligne 1
    [
      { key: "houtos", trans: "Thus", greek: "Οὕτως", pron: "houtōs" },
      { key: "gar", trans: "for", greek: "γὰρ", pron: "gar" },
      { key: "agapao", trans: "loved", greek: "ἠγάπησεν", pron: "ēgapēsen" },
      { key: "ho", trans: "—", greek: "ὁ", pron: "ho" },
      { key: "theos", trans: "God", greek: "Θεὸς", pron: "theos" }
    ],

    // Ligne 2
    [
      { key: "ton", trans: "the", greek: "τὸν", pron: "ton" },
      { key: "kosmos", trans: "world", greek: "κόσμον", pron: "kosmon" },
      { key: "hoste", trans: "that", greek: "ὥστε", pron: "hōste" },
      { key: "ton", trans: "the", greek: "τὸν", pron: "ton" },
      { key: "huios", trans: "Son", greek: "Υἱὸν", pron: "huion" },
      { key: "ton", trans: "the", greek: "τὸν", pron: "ton" }
    ],

    // Ligne 3
    [
      { key: "monogenes", trans: "only begotten", greek: "μονογενῆ", pron: "monogenē" },
      { key: "didomi", trans: "He gave", greek: "ἔδωκεν", pron: "edōken" },
      { key: "hina", trans: "so that", greek: "ἵνα", pron: "hina" },
      { key: "pas", trans: "everyone", greek: "πᾶς", pron: "pas" }
    ],

    // Ligne 4
    [
      { key: "ho", trans: "—", greek: "ὁ", pron: "ho" },
      { key: "pisteuo", trans: "believing", greek: "πιστεύων", pron: "pisteuōn" },
      { key: "eis", trans: "in", greek: "εἰς", pron: "eis" },
      { key: "autos", trans: "Him", greek: "αὐτὸν", pron: "auton" },
      { key: "me", trans: "not", greek: "μὴ", pron: "mē" }
    ],

    // Ligne 5
    [
      { key: "apollumi", trans: "should perish", greek: "ἀπόληται", pron: "apolētai" },
      { key: "alla", trans: "but", greek: "ἀλλ’", pron: "all’" },
      { key: "echo", trans: "should have", greek: "ἔχῃ", pron: "echē" },
      { key: "zoe", trans: "life", greek: "ζωὴν", pron: "zōēn" },
      { key: "aionios", trans: "eternal", greek: "αἰώνιον", pron: "aiōnion" }
    ]

  ]

}



  }
};

// verset courant (tableau de lignes)
$: currentVerseLines =
  VERSE_DATA?.[currentBook]?.[currentChapter]?.[currentVerseNum] ?? null;

  $: verseTitle = `${currentBook} ${currentChapter}:${currentVerseNum}`;

  // -----------------------------
  // NAV (mode "page remplace tout")
  // -----------------------------
  function openChapterPicker() {
    view = "chapters";
    selectedWord = null;
  }

  function pickChapter(ch) {
    currentChapter = ch;
    currentVerseNum = 1;
    view = "verses";
    selectedWord = null;
  }

  function openVersePicker() {
    view = "verses";
    selectedWord = null;
  }

  function pickVerse(v) {
    currentVerseNum = v;
    view = "read";
    selectedWord = null;
  }

  function cancelPicker() {
    view = "read";
    selectedWord = null;
  }
</script>

<!-- TITRE (cliquable) -->
<h2 class="verse-title" on:click={openChapterPicker}>
  {verseTitle}
</h2>


{#if view === "chapters"}
  <!-- PICKER CHAPITRES -->
  <div class="picker">
    <div class="tabs">
      <div class="tab active">CHAPTER</div>
      <div class="tab" on:click={openVersePicker}>VERSE</div>
    </div>

    <div class="grid">
      {#each chapterNums as ch}
        <button
          class:selected={ch === currentChapter}
          on:click={() => pickChapter(ch)}
        >
          {ch}
        </button>
      {/each}
    </div>

    <button class="cancel" on:click={cancelPicker}>CANCEL</button>
  </div>

{:else if view === "verses"}
  <!-- PICKER VERSETS -->
  <div class="picker">
    <div class="tabs">
      <div class="tab" on:click={openChapterPicker}>CHAPTER</div>
      <div class="tab active">VERSE</div>
    </div>

    <div class="grid">
      {#each verseNums as v}
        <button
          class:selected={v === currentVerseNum}
          on:click={() => pickVerse(v)}
        >
          {v}
        </button>
      {/each}
    </div>

    <button class="cancel" on:click={cancelPicker}>CANCEL</button>
  </div>

{:else}
  <!-- MODE LECTURE -->
  <div class="read">
    {#if currentVerseLines}
      {#each currentVerseLines as line}
        <div class="line">
          {#each line as w}
            <div
              class="word-block"
              class:dim={w.dim}
              role={w.key ? "button" : undefined}
              tabindex={w.key ? 0 : undefined}
              on:click={() => w.key && select(w.key)}
              on:keydown={(e) => w.key && (e.key === "Enter" || e.key === " ") && select(w.key)}
            >
              <div class="trans">{w.trans ?? ""}</div>
              <div class="greek">{w.greek ?? ""}</div>
              <div class="pron">{w.pron ?? ""}</div>
            </div>
          {/each}
        </div>
      {/each}
    {:else}
      <p style="text-align:center; margin-top: 24px;">
        Verset pas encore encodé 🙂<br />
        (choisis un autre verset, ou on l’ajoute)
      </p>
    {/if}
  </div>
{/if}


{#if selectedWord}
  <div
    class="lexicon-overlay"
    on:click={() => (selectedKey = null, selectedWord = null)}
  >
    <div class="lexicon-card" on:click|stopPropagation>
      <div class="lexicon-actions">
        <button class="copy-btn" type="button" on:click={copyLexicon}>Copy</button>
        <button class="close-btn" type="button" on:click={() => (selectedKey = null, selectedWord = null)}>
          Close
        </button>
      </div>

      <div class="lexicon-header">
        <h2>{selectedWord.lexical}</h2>
        <p class="strong-line">
          <span class="lex-label">Greek lexical index:</span>
          <span class="lex-value">Strong {selectedWord.strong}</span>
        </p>
      </div>

      <p><b>Transliteration:</b> {selectedWord.transliteration}</p>
      <p><b>Part of Speech:</b> {selectedWord.partOfSpeech}</p>
      <p><b>Phonetic Spelling:</b> {selectedWord.phonetic}</p>

      <hr />

      <p><b>Definition:</b><br />{selectedWord.definition}</p>
      <p><b>Origin:</b><br />{selectedWord.origin}</p>
      <p><b>Usage:</b><br />{selectedWord.usage}</p>

      <p><b>Translated as (count):</b><br />{selectedWord.translatedAs}</p>
    </div>
  </div>
{/if}

<style>
  .verse-title {
    font-family: "Times New Roman", serif;
    font-size: 3rem;
    margin: 0.5rem 0 1rem;
    cursor: pointer;
    user-select: none;
  }

  /* Lecture */
  
  .read {
  margin-top: 0.5rem;
  max-width: 900px;
  margin-left: 40px;   /* aligne vers la gauche */
}

  .line {
    display: flex;
    gap: 12px;
    margin-bottom: 1rem;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
.word-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;   /* ✅ au lieu de center */
  cursor: pointer;
  min-width: 120px;          /* ✅ cohérent avec ton override */
}
  .word-block.dim {
    opacity: 0.5;
    cursor: default;
  }
.trans {
  font-size: 1.2rem;
  font-weight: 500;
  color: #111;
  text-align: left;
}

.greek {
  font-size: 1.6rem;
  font-family: "Times New Roman", serif;
  font-weight: 500;
}

.pron {
  font-size: 0.8rem;
  color: #777;
}

  /* Picker style (Hagios-ish) */
  .picker {
    border: 1px solid #ddd;
    border-radius: 14px;
    padding: 16px;
    max-width: 900px;
    margin: 24px auto;
    background: #fafafa;
  }

  .tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }

  .tab {
    text-align: center;
    padding: 10px 12px;
    border-radius: 999px;
    background: #eee;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #666;
  }

  .tab.active {
    background: #e6e6e6;
    color: #111;
    border: 1px solid #cfcfcf;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    padding: 10px 4px 18px;
  }

  .grid button {
    padding: 16px 10px;
    border-radius: 12px;
    border: 1px solid #cfcfcf;
    background: white;
    font-size: 1.2rem;
    cursor: pointer;
  }

  .grid button.selected {
    outline: 2px solid #d26;
    border-color: #d26;
  }

  .cancel {
    width: 100%;
    padding: 12px 10px;
    border-radius: 999px;
    border: 0;
    background: #eee;
    cursor: pointer;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #777;
  }

  /* Lexicon overlay */
  .lexicon-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    z-index: 9999;
  }

  .lexicon-card {
    width: min(920px, 95vw);
    max-height: 78vh;
    overflow: auto;
    background: white;
    border-radius: 14px;
    padding: 18px 18px 22px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }

  .lexicon-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 6px;
  }

  .copy-btn,
  .close-btn {
    border: 0;
    padding: 8px 12px;
    border-radius: 999px;
    background: #e9eefb;
    cursor: pointer;
    font-weight: 600;
  }

.lexicon-card p {
  margin: 4px 0;
}

.lex-label { font-weight: 700; }
.lex-value { font-weight: 400; }

/* === OVERRIDE HIÉRARCHIE (English > Greek > Pron) === */
.read .word-block .trans{
  font-size: 1.8rem !important;
  font-weight: 600 !important;
  color: #111 !important;
  line-height: 1.05 !important;
  margin-bottom: 0.15rem !important;
  text-align: left !important;
}

.read .word-block .greek{
  font-size: 1.65rem !important;
  font-weight: 500 !important;
  color: #111 !important;
  line-height: 1.05 !important;
  margin-bottom: 0.05rem !important;
  text-align: left !important;
}

.read .word-block .pron{
  font-size: 1.3rem !important;
  color: #666 !important;
  line-height: 1 !important;
  text-align: left !important;
}

/* un peu plus de “bloc” pour que ça respire bien */
.read .word-block{
  min-width: 120px !important;
}

</style>
enum Activity {
  Walking = "chůze",
  Running = "běh",
  Bicycle = "kolo",
  Scooter = "koloběžka",
  Unicycle = "jednokolka",
  Stairs = "schody",
  Gym = "posilovna",
  Swimming = "plavání",
  Volleyball = "odbíjená",
  Basketball = "košíková",
  Football = "kopaná",
  Lial = "LiAl",
  Ringo = "ringo",
  Inline = "inline",
  Skateboard = "skate/longboard",
  Dance = "tanec",
}
const activityUnits = {
  [Activity.Walking]: "km",
  [Activity.Running]: "km",
  [Activity.Bicycle]: "km",
  [Activity.Scooter]: "km",
  [Activity.Unicycle]: "km",
  [Activity.Stairs]: "pater",
  [Activity.Gym]: "h",
  [Activity.Swimming]: "100 m",
  [Activity.Volleyball]: "h",
  [Activity.Basketball]: "h",
  [Activity.Football]: "h",
  [Activity.Lial]: "h",
  [Activity.Ringo]: "h",
  [Activity.Inline]: "km",
  [Activity.Skateboard]: "km",
  [Activity.Dance]: "h",
};
const activityCalorieConversion = {
  [Activity.Walking]: 75,
  [Activity.Running]: 80,
  [Activity.Bicycle]: 35,
  [Activity.Scooter]: 42,
  [Activity.Unicycle]: 120,
  [Activity.Stairs]: 0.5,
  [Activity.Gym]: 620,
  [Activity.Swimming]: 66,
  [Activity.Volleyball]: 641,
  [Activity.Basketball]: 541,
  [Activity.Football]: 600,
  [Activity.Lial]: 400,
  [Activity.Ringo]: 530,
  [Activity.Inline]: 80,
  [Activity.Skateboard]: 42,
  [Activity.Dance]: 300,
};
const milestonesData = [
  {
    km: 115,
    title: "Jindřichův Hradec",
    text: "Prošli jsme Jindřichovým Hradcem. Dokážeš správně odpovědět na všechny otázky záludného kvízu o tomto městě?",
  },
  {
    km: 230,
    title: "Dunaj",
    text: "Překonali jsme Dunaj. V místech překonání je široký přibližně 300 metrů. Musíš tedy i ty uplavat 300 metrů. Nemusíš kvůli tomu až k Dunaji, ale využij bazén, rybník či nádrž. Nezapomeň na dodržování bezpečnostních pravidel.",
  },
  {
    km: 1500,
    title: "Etna",
    text: "Těsně jsme minuli vrchol Etny. Musíš i ty vystoupat alespoň desetinu její výšky. Čeká tě tedy zdolat 330 výškových metrů. Může to být na jednom kopci, může to být na schodišti, které vyjdeš mnohokrát za sebou. Každopádně 330 výškových metrů musíš zdolat během jednoho dne.",
  },
  {
    km: 6000,
    title: "Kinshasa",
    text: "Zde leží hlavní město Konga, Kinshasa. Běhá se zde maraton, který letos byl 2. června. Pro nás je tedy výzva uběhnout alespoň jeho desetinu -- 4,2 kilometru.",
  },
  {
    km: 8000,
    title: "Pobřeží koster",
    text: "Dorazili jsme na známé Pobřeží koster, kde ztroskotala nejedna loď. Abys úkol splnil, musíš i ty urazit na libovolném plavidle 1 kilometr.",
  },
  {
    km: 14000,
    title: "Jižní pól",
    text: "Čeká nás čeká pomyslná první otočka. Dorazili jsme na jižní pól. Musíš poslat nebo postnout fotku, jak jsi hlavou vzhůru. Hashtag zní #polobezka",
  },
  {
    km: 25000,
    title: "Havaj",
    text: "Dostali jsme se na jeden z ostrovů Havaje, ostrov Necker. Tento úkol bude pro někoho nesmírně obtížný, pro někoho naopak možná nejjednodušší. Alespoň jednou kousnout do pizzy Havaj.",
  },
  {
    km: 31000,
    title: "Aljaška",
    text: "Konečně jsme dorazili na pobřeží USA na Aljašce. Tvým úkolem je podstoupit koupel ve studené vodě.",
  },
  {
    km: 36000,
    title: "Severní pól",
    text: "Zde leží severní pól. Konečně se budeme rychle blížit k domovu. Ale jak říká Cimmerman: “To se s výletem na Kokořín nedá vůbec srovnat”. Tvým úkolem je navštívit nějaký hrad na K. Například již zmíněný Kokořín, ale uznává se i Karlštejn, Konopiště, Kámen, Kost a další.",
  },
  {
    km: 39900,
    title: "Česká republika",
    text: "Překračuješ zpátky hranice České republiky. Musíš sníst tradiční český pokrm, kterým vítáme poutniky: chleba se solí.",
  },
  {
    km: 40002,
    title: "Doma",
    text: "Pozdrav a obejmi své blízké. Ve zdraví jsi dorazil zpátky domů. Děkujeme ti, že ses s námi vydal na cestu kolem světa.",
  },
];

interface ClassInfo {
  id: number;
  name: string;
  studentIds: number[];
}

interface TeamInfo {
  id: number;
  name: string;
  memberIds: number[];
}

interface UserInfo {
  id: number;
  nickname: string | null;
  email: string;
  teamId: number | null;
  classId: number | null;
}

interface ActivityInfo {
  id: number;
  type: Activity | null;
  unitCount: number;
  userId: number;
  date: Date;
}

interface InviteInfo {
  id: number;
  teamFrom: number;
  userTo: number;
  date: Date;
}

interface WeekInfo {
  start: Date;
  end: Date;
  activities: ActivityInfo[];
}

interface MilestoneInfo {
  number: number;
  userId: number;
}

export type {
  ClassInfo,
  TeamInfo,
  UserInfo,
  ActivityInfo,
  InviteInfo,
  WeekInfo,
  MilestoneInfo,
};
export { Activity, activityUnits, activityCalorieConversion, milestonesData };

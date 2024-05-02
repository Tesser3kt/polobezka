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
};

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

export type {
  ClassInfo,
  TeamInfo,
  UserInfo,
  ActivityInfo,
  InviteInfo,
  WeekInfo,
};
export { Activity, activityUnits, activityCalorieConversion };

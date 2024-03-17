enum Activity {
  Walking = 'chůze',
  Running = 'běh',
  Bicycle = 'kolo',
  Scooter = 'koloběžka',
  Unicycle = 'jednokolka',
  Stairs = 'schody',
  Gym = 'posilovna',
  Swimming = 'plavání',
  Skis = 'běžky',
  Volleyball = 'odbíjená',
  Basketball = 'košíková',
  Football = 'kopaná',
  Lial = 'lial',
  Ringo = 'ringo',
  Inline = 'inline',
  Skateboard = 'skate/longboard'
}
const activityUnits = {
  [Activity.Walking]: 'km',
  [Activity.Running]: 'km',
  [Activity.Bicycle]: 'km',
  [Activity.Scooter]: 'km',
  [Activity.Unicycle]: 'km',
  [Activity.Stairs]: 'patro',
  [Activity.Gym]: 'h',
  [Activity.Swimming]: '100 m',
  [Activity.Skis]: 'km',
  [Activity.Volleyball]: 'h',
  [Activity.Basketball]: 'h',
  [Activity.Football]: 'h',
  [Activity.Lial]: 'h',
  [Activity.Ringo]: 'h',
  [Activity.Inline]: 'km',
  [Activity.Skateboard]: 'km'
}
const activityCalorieConversion = {
  [Activity.Walking]: 80,
  [Activity.Running]: 20,
  [Activity.Bicycle]: 35,
  [Activity.Scooter]: 10,
  [Activity.Unicycle]: 70,
  [Activity.Stairs]: 100,
  [Activity.Gym]: 30,
  [Activity.Swimming]: 60,
  [Activity.Skis]: 80,
  [Activity.Volleyball]: 30,
  [Activity.Basketball]: 60,
  [Activity.Football]: 40,
  [Activity.Lial]: 10,
  [Activity.Ringo]: 43,
  [Activity.Inline]: 10,
  [Activity.Skateboard]: 20
}

interface ClassInfo {
  id: number
  name: string
  studentIds: number[]
}

interface TeamInfo {
  id: number
  name: string
  description: string
  memberIds: number[]
}

interface UserInfo {
  id: number
  name: string
  nickname: string
  email: string
  teamId: number
  classId: number
}

interface ActivityInfo {
  id: number
  type: Activity | null
  unitCount: number
  userId: number
}

export type { ClassInfo, TeamInfo, UserInfo, ActivityInfo }
export { Activity, activityUnits, activityCalorieConversion }

import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

import Sparkles from 'lucide-react-native/icons/sparkles';
import BookOpen from 'lucide-react-native/icons/book-open';
import Dumbbell from 'lucide-react-native/icons/dumbbell';
import Wind from 'lucide-react-native/icons/wind';
import PenLine from 'lucide-react-native/icons/pen-line';
import Droplets from 'lucide-react-native/icons/droplets';
import Music from 'lucide-react-native/icons/music';
import Salad from 'lucide-react-native/icons/salad';
import Moon from 'lucide-react-native/icons/moon';
import Target from 'lucide-react-native/icons/target';
import Brain from 'lucide-react-native/icons/brain';
import Focus from 'lucide-react-native/icons/focus';
import Coffee from 'lucide-react-native/icons/coffee';
import Bike from 'lucide-react-native/icons/bike';
import Footprints from 'lucide-react-native/icons/footprints';
import HeartPulse from 'lucide-react-native/icons/heart-pulse';
import StretchHorizontal from 'lucide-react-native/icons/stretch-horizontal';
import Flame from 'lucide-react-native/icons/flame';
import Sun from 'lucide-react-native/icons/sun';
import Sunrise from 'lucide-react-native/icons/sunrise';
import Languages from 'lucide-react-native/icons/languages';
import Terminal from 'lucide-react-native/icons/terminal';
import Palette from 'lucide-react-native/icons/palette';
import Camera from 'lucide-react-native/icons/camera';
import Headphones from 'lucide-react-native/icons/headphones';
import Mic from 'lucide-react-native/icons/mic';
import Gamepad2 from 'lucide-react-native/icons/gamepad-2';
import Puzzle from 'lucide-react-native/icons/puzzle';
import Leaf from 'lucide-react-native/icons/leaf';
import Trees from 'lucide-react-native/icons/trees';
import Mountain from 'lucide-react-native/icons/mountain';
import Droplet from 'lucide-react-native/icons/droplet';
import Pill from 'lucide-react-native/icons/pill';
import Apple from 'lucide-react-native/icons/apple';
import Utensils from 'lucide-react-native/icons/utensils';
import Bath from 'lucide-react-native/icons/bath';
import BedDouble from 'lucide-react-native/icons/bed-double';
import AlarmClock from 'lucide-react-native/icons/alarm-clock';
import CalendarCheck from 'lucide-react-native/icons/calendar-check';
import ClipboardList from 'lucide-react-native/icons/clipboard-list';
import Mail from 'lucide-react-native/icons/mail';
import Phone from 'lucide-react-native/icons/phone';
import Users from 'lucide-react-native/icons/users';
import HandHeart from 'lucide-react-native/icons/hand-heart';
import Dog from 'lucide-react-native/icons/dog';
import Cat from 'lucide-react-native/icons/cat';
import Wallet from 'lucide-react-native/icons/wallet';
import PiggyBank from 'lucide-react-native/icons/piggy-bank';
import Briefcase from 'lucide-react-native/icons/briefcase';
import GraduationCap from 'lucide-react-native/icons/graduation-cap';
import Activity from 'lucide-react-native/icons/activity';
import AirVent from 'lucide-react-native/icons/air-vent';
import Anchor from 'lucide-react-native/icons/anchor';
import Baby from 'lucide-react-native/icons/baby';
import Backpack from 'lucide-react-native/icons/backpack';
import Banana from 'lucide-react-native/icons/banana';
import Beer from 'lucide-react-native/icons/beer';
import Bell from 'lucide-react-native/icons/bell';
import Bird from 'lucide-react-native/icons/bird';
import Bone from 'lucide-react-native/icons/bone';
import BookMarked from 'lucide-react-native/icons/book-marked';
import Bookmark from 'lucide-react-native/icons/bookmark';
import Bot from 'lucide-react-native/icons/bot';
import Brush from 'lucide-react-native/icons/brush';
import Building2 from 'lucide-react-native/icons/building-2';
import Bus from 'lucide-react-native/icons/bus';
import Cake from 'lucide-react-native/icons/cake';
import Car from 'lucide-react-native/icons/car';
import Carrot from 'lucide-react-native/icons/carrot';
import CheckCheck from 'lucide-react-native/icons/check-check';
import Cherry from 'lucide-react-native/icons/cherry';
import CigaretteOff from 'lucide-react-native/icons/cigarette-off';
import Citrus from 'lucide-react-native/icons/citrus';
import Clapperboard from 'lucide-react-native/icons/clapperboard';
import Clock from 'lucide-react-native/icons/clock';
import CloudSun from 'lucide-react-native/icons/cloud-sun';
import Code from 'lucide-react-native/icons/code';
import Compass from 'lucide-react-native/icons/compass';
import CookingPot from 'lucide-react-native/icons/cooking-pot';
import Croissant from 'lucide-react-native/icons/croissant';
import CupSoda from 'lucide-react-native/icons/cup-soda';
import Dice5 from 'lucide-react-native/icons/dice-5';
import Drama from 'lucide-react-native/icons/drama';
import Drum from 'lucide-react-native/icons/drum';
import Ear from 'lucide-react-native/icons/ear';
import Egg from 'lucide-react-native/icons/egg';
import Eye from 'lucide-react-native/icons/eye';
import FaceSlightlySmiling from 'lucide-react-native/icons/face-slightly-smiling';
import Feather from 'lucide-react-native/icons/feather';
import FerrisWheel from 'lucide-react-native/icons/ferris-wheel';
import Film from 'lucide-react-native/icons/film';
import Fish from 'lucide-react-native/icons/fish';
import Flower2 from 'lucide-react-native/icons/flower-2';
import Gift from 'lucide-react-native/icons/gift';
import Glasses from 'lucide-react-native/icons/glasses';
import Globe from 'lucide-react-native/icons/globe';
import Guitar from 'lucide-react-native/icons/guitar';
import Hammer from 'lucide-react-native/icons/hammer';
import Handshake from 'lucide-react-native/icons/handshake';
import Heart from 'lucide-react-native/icons/heart';
import HeartHandshake from 'lucide-react-native/icons/heart-handshake';
import House from 'lucide-react-native/icons/house';
import Hourglass from 'lucide-react-native/icons/hourglass';
import IceCreamCone from 'lucide-react-native/icons/ice-cream-cone';
import Keyboard from 'lucide-react-native/icons/keyboard';
import Laptop from 'lucide-react-native/icons/laptop';
import Library from 'lucide-react-native/icons/library';
import Lightbulb from 'lucide-react-native/icons/lightbulb';
import ListChecks from 'lucide-react-native/icons/list-checks';
import Map from 'lucide-react-native/icons/map';
import Medal from 'lucide-react-native/icons/medal';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Milk from 'lucide-react-native/icons/milk';
import Monitor from 'lucide-react-native/icons/monitor';
import Newspaper from 'lucide-react-native/icons/newspaper';
import NotebookPen from 'lucide-react-native/icons/notebook-pen';
import Paintbrush from 'lucide-react-native/icons/paintbrush';
import PersonStanding from 'lucide-react-native/icons/person-standing';
import Plane from 'lucide-react-native/icons/plane';
import Pizza from 'lucide-react-native/icons/pizza';
import Radio from 'lucide-react-native/icons/radio';
import Repeat from 'lucide-react-native/icons/repeat';
import Rocket from 'lucide-react-native/icons/rocket';
import Scale from 'lucide-react-native/icons/scale';
import Scissors from 'lucide-react-native/icons/scissors';
import Shell from 'lucide-react-native/icons/shell';
import Shirt from 'lucide-react-native/icons/shirt';
import ShoppingBag from 'lucide-react-native/icons/shopping-bag';
import ShowerHead from 'lucide-react-native/icons/shower-head';
import Snowflake from 'lucide-react-native/icons/snowflake';
import SoapDispenserDroplet from 'lucide-react-native/icons/soap-dispenser-droplet';
import Soup from 'lucide-react-native/icons/soup';
import Sprout from 'lucide-react-native/icons/sprout';
import Star from 'lucide-react-native/icons/star';
import Stethoscope from 'lucide-react-native/icons/stethoscope';
import StickyNote from 'lucide-react-native/icons/sticky-note';
import Sword from 'lucide-react-native/icons/sword';
import Syringe from 'lucide-react-native/icons/syringe';
import Tent from 'lucide-react-native/icons/tent';
import Thermometer from 'lucide-react-native/icons/thermometer';
import Timer from 'lucide-react-native/icons/timer';
import TrainFront from 'lucide-react-native/icons/train-front';
import TreePine from 'lucide-react-native/icons/tree-pine';
import Trophy from 'lucide-react-native/icons/trophy';
import Tv from 'lucide-react-native/icons/tv';
import Umbrella from 'lucide-react-native/icons/umbrella';
import Video from 'lucide-react-native/icons/video';
import Volleyball from 'lucide-react-native/icons/volleyball';
import WavesLadder from 'lucide-react-native/icons/waves-ladder';
import Wheat from 'lucide-react-native/icons/wheat';
import Wine from 'lucide-react-native/icons/wine';
import Wrench from 'lucide-react-native/icons/wrench';
import Zap from 'lucide-react-native/icons/zap';
import Earth from 'lucide-react-native/icons/earth';
import Plus from 'lucide-react-native/icons/plus';

import type { HabitIconId } from '@/src/domain';
import { colors } from '@/src/shared/ui/tokens';

type LucideIcon = ComponentType<SvgProps & { size?: number; color?: string; strokeWidth?: number }>;

/** Curated Lucide set — per-icon public exports (avoids the barrel + export warnings). */
export const HABIT_ICON_OPTIONS: {
  id: HabitIconId;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: 'sparkles', label: 'General', Icon: Sparkles as LucideIcon },
  { id: 'book-open', label: 'Reading', Icon: BookOpen as LucideIcon },
  { id: 'dumbbell', label: 'Strength', Icon: Dumbbell as LucideIcon },
  { id: 'wind', label: 'Breath / meditation', Icon: Wind as LucideIcon },
  { id: 'pen-line', label: 'Writing', Icon: PenLine as LucideIcon },
  { id: 'droplets', label: 'Hydration', Icon: Droplets as LucideIcon },
  { id: 'music', label: 'Music', Icon: Music as LucideIcon },
  { id: 'salad', label: 'Healthy eating', Icon: Salad as LucideIcon },
  { id: 'moon', label: 'Sleep', Icon: Moon as LucideIcon },
  { id: 'target', label: 'Goals', Icon: Target as LucideIcon },
  { id: 'brain', label: 'Learning', Icon: Brain as LucideIcon },
  { id: 'focus', label: 'Deep work', Icon: Focus as LucideIcon },
  { id: 'coffee', label: 'Coffee / ritual', Icon: Coffee as LucideIcon },
  { id: 'bike', label: 'Cycling', Icon: Bike as LucideIcon },
  { id: 'footprints', label: 'Walking', Icon: Footprints as LucideIcon },
  { id: 'heart-pulse', label: 'Cardio', Icon: HeartPulse as LucideIcon },
  { id: 'stretch-horizontal', label: 'Stretch / yoga', Icon: StretchHorizontal as LucideIcon },
  { id: 'flame', label: 'Energy', Icon: Flame as LucideIcon },
  { id: 'sun', label: 'Morning', Icon: Sun as LucideIcon },
  { id: 'sunrise', label: 'Wake early', Icon: Sunrise as LucideIcon },
  { id: 'languages', label: 'Languages', Icon: Languages as LucideIcon },
  { id: 'terminal', label: 'Coding', Icon: Terminal as LucideIcon },
  { id: 'palette', label: 'Art', Icon: Palette as LucideIcon },
  { id: 'camera', label: 'Photo', Icon: Camera as LucideIcon },
  { id: 'headphones', label: 'Podcast / audio', Icon: Headphones as LucideIcon },
  { id: 'mic', label: 'Speaking', Icon: Mic as LucideIcon },
  { id: 'gamepad-2', label: 'Play', Icon: Gamepad2 as LucideIcon },
  { id: 'puzzle', label: 'Puzzles', Icon: Puzzle as LucideIcon },
  { id: 'leaf', label: 'Nature', Icon: Leaf as LucideIcon },
  { id: 'trees', label: 'Outdoors', Icon: Trees as LucideIcon },
  { id: 'mountain', label: 'Hiking', Icon: Mountain as LucideIcon },
  { id: 'droplet', label: 'Swim / water', Icon: Droplet as LucideIcon },
  { id: 'pill', label: 'Medication', Icon: Pill as LucideIcon },
  { id: 'apple', label: 'Fruit / snack', Icon: Apple as LucideIcon },
  { id: 'utensils', label: 'Cooking', Icon: Utensils as LucideIcon },
  { id: 'bath', label: 'Self-care', Icon: Bath as LucideIcon },
  { id: 'bed-double', label: 'Rest', Icon: BedDouble as LucideIcon },
  { id: 'alarm-clock', label: 'Routine', Icon: AlarmClock as LucideIcon },
  { id: 'calendar-check', label: 'Planning', Icon: CalendarCheck as LucideIcon },
  { id: 'clipboard-list', label: 'Tasks', Icon: ClipboardList as LucideIcon },
  { id: 'mail', label: 'Inbox zero', Icon: Mail as LucideIcon },
  { id: 'phone', label: 'Calls', Icon: Phone as LucideIcon },
  { id: 'users', label: 'Social', Icon: Users as LucideIcon },
  { id: 'hand-heart', label: 'Kindness', Icon: HandHeart as LucideIcon },
  { id: 'dog', label: 'Dog', Icon: Dog as LucideIcon },
  { id: 'cat', label: 'Cat', Icon: Cat as LucideIcon },
  { id: 'wallet', label: 'Budget', Icon: Wallet as LucideIcon },
  { id: 'piggy-bank', label: 'Saving', Icon: PiggyBank as LucideIcon },
  { id: 'briefcase', label: 'Work', Icon: Briefcase as LucideIcon },
  { id: 'graduation-cap', label: 'Study', Icon: GraduationCap as LucideIcon },
  { id: 'activity', label: 'Activity', Icon: Activity as LucideIcon },
  { id: 'air-vent', label: 'Fresh air', Icon: AirVent as LucideIcon },
  { id: 'anchor', label: 'Grounding', Icon: Anchor as LucideIcon },
  { id: 'baby', label: 'Parenting', Icon: Baby as LucideIcon },
  { id: 'backpack', label: 'Adventure', Icon: Backpack as LucideIcon },
  { id: 'banana', label: 'Snack', Icon: Banana as LucideIcon },
  { id: 'beer', label: 'Social drink', Icon: Beer as LucideIcon },
  { id: 'bell', label: 'Reminder', Icon: Bell as LucideIcon },
  { id: 'bird', label: 'Birds', Icon: Bird as LucideIcon },
  { id: 'bone', label: 'Pet care', Icon: Bone as LucideIcon },
  { id: 'book-marked', label: 'Study notes', Icon: BookMarked as LucideIcon },
  { id: 'bookmark', label: 'Reading list', Icon: Bookmark as LucideIcon },
  { id: 'bot', label: 'AI / automation', Icon: Bot as LucideIcon },
  { id: 'brush', label: 'Painting', Icon: Brush as LucideIcon },
  { id: 'building-2', label: 'Office', Icon: Building2 as LucideIcon },
  { id: 'bus', label: 'Commute', Icon: Bus as LucideIcon },
  { id: 'cake', label: 'Celebrate', Icon: Cake as LucideIcon },
  { id: 'car', label: 'Drive', Icon: Car as LucideIcon },
  { id: 'carrot', label: 'Veggies', Icon: Carrot as LucideIcon },
  { id: 'check-check', label: 'Done', Icon: CheckCheck as LucideIcon },
  { id: 'cherry', label: 'Treat', Icon: Cherry as LucideIcon },
  { id: 'cigarette-off', label: 'Quit smoking', Icon: CigaretteOff as LucideIcon },
  { id: 'citrus', label: 'Citrus', Icon: Citrus as LucideIcon },
  { id: 'clapperboard', label: 'Film', Icon: Clapperboard as LucideIcon },
  { id: 'clock', label: 'Time', Icon: Clock as LucideIcon },
  { id: 'cloud-sun', label: 'Weather', Icon: CloudSun as LucideIcon },
  { id: 'code', label: 'Code', Icon: Code as LucideIcon },
  { id: 'compass', label: 'Explore', Icon: Compass as LucideIcon },
  { id: 'cooking-pot', label: 'Cook', Icon: CookingPot as LucideIcon },
  { id: 'croissant', label: 'Bakery', Icon: Croissant as LucideIcon },
  { id: 'cup-soda', label: 'Drink', Icon: CupSoda as LucideIcon },
  { id: 'dice-5', label: 'Games', Icon: Dice5 as LucideIcon },
  { id: 'drama', label: 'Theatre', Icon: Drama as LucideIcon },
  { id: 'drum', label: 'Drums', Icon: Drum as LucideIcon },
  { id: 'ear', label: 'Listening', Icon: Ear as LucideIcon },
  { id: 'egg', label: 'Breakfast', Icon: Egg as LucideIcon },
  { id: 'eye', label: 'Observe', Icon: Eye as LucideIcon },
  { id: 'face-slightly-smiling', label: 'Mood', Icon: FaceSlightlySmiling as LucideIcon },
  { id: 'feather', label: 'Light touch', Icon: Feather as LucideIcon },
  { id: 'ferris-wheel', label: 'Fun', Icon: FerrisWheel as LucideIcon },
  { id: 'film', label: 'Movies', Icon: Film as LucideIcon },
  { id: 'fish', label: 'Fishing', Icon: Fish as LucideIcon },
  { id: 'flower-2', label: 'Garden', Icon: Flower2 as LucideIcon },
  { id: 'gift', label: 'Giving', Icon: Gift as LucideIcon },
  { id: 'glasses', label: 'Reading glasses', Icon: Glasses as LucideIcon },
  { id: 'globe', label: 'World', Icon: Globe as LucideIcon },
  { id: 'guitar', label: 'Guitar', Icon: Guitar as LucideIcon },
  { id: 'hammer', label: 'Build', Icon: Hammer as LucideIcon },
  { id: 'handshake', label: 'Meet', Icon: Handshake as LucideIcon },
  { id: 'heart', label: 'Love', Icon: Heart as LucideIcon },
  { id: 'heart-handshake', label: 'Care', Icon: HeartHandshake as LucideIcon },
  { id: 'house', label: 'Home', Icon: House as LucideIcon },
  { id: 'hourglass', label: 'Patience', Icon: Hourglass as LucideIcon },
  { id: 'ice-cream-cone', label: 'Dessert', Icon: IceCreamCone as LucideIcon },
  { id: 'keyboard', label: 'Typing', Icon: Keyboard as LucideIcon },
  { id: 'laptop', label: 'Laptop', Icon: Laptop as LucideIcon },
  { id: 'library', label: 'Library', Icon: Library as LucideIcon },
  { id: 'lightbulb', label: 'Ideas', Icon: Lightbulb as LucideIcon },
  { id: 'list-checks', label: 'Checklist', Icon: ListChecks as LucideIcon },
  { id: 'map', label: 'Travel', Icon: Map as LucideIcon },
  { id: 'medal', label: 'Achievement', Icon: Medal as LucideIcon },
  { id: 'message-circle', label: 'Chat', Icon: MessageCircle as LucideIcon },
  { id: 'milk', label: 'Dairy', Icon: Milk as LucideIcon },
  { id: 'monitor', label: 'Screen', Icon: Monitor as LucideIcon },
  { id: 'newspaper', label: 'News', Icon: Newspaper as LucideIcon },
  { id: 'notebook-pen', label: 'Journal', Icon: NotebookPen as LucideIcon },
  { id: 'paintbrush', label: 'Paint', Icon: Paintbrush as LucideIcon },
  { id: 'person-standing', label: 'Stand', Icon: PersonStanding as LucideIcon },
  { id: 'plane', label: 'Flight', Icon: Plane as LucideIcon },
  { id: 'pizza', label: 'Pizza', Icon: Pizza as LucideIcon },
  { id: 'radio', label: 'Radio', Icon: Radio as LucideIcon },
  { id: 'repeat', label: 'Reps', Icon: Repeat as LucideIcon },
  { id: 'rocket', label: 'Launch', Icon: Rocket as LucideIcon },
  { id: 'scale', label: 'Weigh-in', Icon: Scale as LucideIcon },
  { id: 'scissors', label: 'Craft', Icon: Scissors as LucideIcon },
  { id: 'shell', label: 'Beach', Icon: Shell as LucideIcon },
  { id: 'shirt', label: 'Style', Icon: Shirt as LucideIcon },
  { id: 'shopping-bag', label: 'Shop', Icon: ShoppingBag as LucideIcon },
  { id: 'shower-head', label: 'Shower', Icon: ShowerHead as LucideIcon },
  { id: 'snowflake', label: 'Winter', Icon: Snowflake as LucideIcon },
  { id: 'soap-dispenser-droplet', label: 'Hygiene', Icon: SoapDispenserDroplet as LucideIcon },
  { id: 'soup', label: 'Soup', Icon: Soup as LucideIcon },
  { id: 'sprout', label: 'Grow', Icon: Sprout as LucideIcon },
  { id: 'star', label: 'Favorite', Icon: Star as LucideIcon },
  { id: 'stethoscope', label: 'Health', Icon: Stethoscope as LucideIcon },
  { id: 'sticky-note', label: 'Notes', Icon: StickyNote as LucideIcon },
  { id: 'sword', label: 'Challenge', Icon: Sword as LucideIcon },
  { id: 'syringe', label: 'Shot', Icon: Syringe as LucideIcon },
  { id: 'tent', label: 'Camping', Icon: Tent as LucideIcon },
  { id: 'thermometer', label: 'Body check', Icon: Thermometer as LucideIcon },
  { id: 'timer', label: 'Timer', Icon: Timer as LucideIcon },
  { id: 'train-front', label: 'Train', Icon: TrainFront as LucideIcon },
  { id: 'tree-pine', label: 'Forest', Icon: TreePine as LucideIcon },
  { id: 'trophy', label: 'Win', Icon: Trophy as LucideIcon },
  { id: 'tv', label: 'TV', Icon: Tv as LucideIcon },
  { id: 'umbrella', label: 'Rain', Icon: Umbrella as LucideIcon },
  { id: 'video', label: 'Video', Icon: Video as LucideIcon },
  { id: 'volleyball', label: 'Sports', Icon: Volleyball as LucideIcon },
  { id: 'waves-ladder', label: 'Pool', Icon: WavesLadder as LucideIcon },
  { id: 'wheat', label: 'Grain', Icon: Wheat as LucideIcon },
  { id: 'wine', label: 'Wine', Icon: Wine as LucideIcon },
  { id: 'wrench', label: 'Fix', Icon: Wrench as LucideIcon },
  { id: 'zap', label: 'Energy burst', Icon: Zap as LucideIcon },
  { id: 'earth', label: 'Planet', Icon: Earth as LucideIcon },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  HABIT_ICON_OPTIONS.map(({ id, Icon }) => [id, Icon]),
);

/** Map legacy emoji icons (pre-Lucide) to Lucide ids. */
const LEGACY_EMOJI_MAP: Record<string, HabitIconId> = {
  '✨': 'sparkles',
  '📚': 'book-open',
  '🏃': 'dumbbell',
  '🧘': 'wind',
  '✍️': 'pen-line',
  '💧': 'droplets',
  '🎸': 'music',
  '🥗': 'salad',
  '😴': 'moon',
  '🎯': 'target',
  '🧠': 'brain',
  '💪': 'dumbbell',
  '⏱': 'focus',
  '✓': 'sparkles',
  guitar: 'music',
  'code-2': 'terminal',
  waves: 'waves-ladder',
};

export function resolveHabitIconId(icon: string | undefined | null): HabitIconId {
  if (!icon) return 'sparkles';
  if (icon in ICON_MAP) return icon as HabitIconId;
  return LEGACY_EMOJI_MAP[icon] ?? 'sparkles';
}

type HabitIconProps = {
  name?: string | null;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function HabitIcon({
  name,
  size = 28,
  color = colors.accent,
  strokeWidth = 2,
}: HabitIconProps) {
  const id = resolveHabitIconId(name);
  const Icon = ICON_MAP[id] ?? (Sparkles as LucideIcon);
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}

export function SessionFallbackIcon({
  size = 28,
  color = colors.accent,
}: {
  size?: number;
  color?: string;
}) {
  const Icon = Timer as LucideIcon;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

export function TimerActionIcon({
  size = 22,
  color = colors.accent,
  strokeWidth = 2,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const Icon = Timer as LucideIcon;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}

export function PlusIcon({
  size = 28,
  color = colors.accent,
  strokeWidth = 2.5,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const Icon = Plus as LucideIcon;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}

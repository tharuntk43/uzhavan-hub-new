import React from 'react';

// Base helper for standard Lucide SVG icons
function createLucideIcon(iconName, pathD, circleProps = null) {
  return function Icon({ size = 20, className = '', color = 'currentColor', strokeWidth = 2, ...props }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-${iconName} inline-block shrink-0 ${className}`}
        aria-hidden="true"
        {...props}
      >
        {circleProps && <circle {...circleProps} />}
        {Array.isArray(pathD) ? pathD.map((d, i) => <path key={i} d={d} />) : <path d={pathD} />}
      </svg>
    );
  };
}

// 1. Leaf / Sprout (Planting, Organic, Agriculture)
export const Leaf = createLucideIcon('leaf', [
  "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
  "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
]);

export const Sprout = createLucideIcon('sprout', [
  "M7 20h10",
  "M10 20c5.5-2.5.8-6.4 3-10",
  "M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z",
  "M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"
]);

export const Wheat = createLucideIcon('wheat', [
  "M2 22 16 8",
  "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
  "M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
  "M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
  "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z",
  "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
  "M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
  "M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"
]);

// 2. Weather & Environment
export const CloudSun = createLucideIcon('cloud-sun', [
  "M12 2v2",
  "m4.93 4.93 1.41 1.41",
  "M20 12h2",
  "m19.07 4.93-1.41 1.41",
  "M15.947 12.65a4 4 0 0 0-5.925-4.128",
  "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"
]);

export const CloudRain = createLucideIcon('cloud-rain', [
  "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
  "M16 14v6",
  "M8 14v6",
  "M12 16v6"
]);

export const Droplets = createLucideIcon('droplets', [
  "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
  "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
]);

export const Thermometer = createLucideIcon('thermometer', [
  "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"
]);

// 3. Market & Finance
export const TrendingUp = createLucideIcon('trending-up', [
  "m22 7-8.5 8.5-5-5L2 17",
  "M16 7h6v6"
]);

export const DollarSign = createLucideIcon('dollar-sign', [
  "M12 2v20",
  "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
]);

export const Calculator = createLucideIcon('calculator', [
  "M4 2v20h16V2H4zm4 4h8v2H8V6zm0 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h0v2h0v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h0v2h0v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h0v2h0v-2z"
]);

// 4. Users, Community & Communication
export const Users = createLucideIcon('users', [
  "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
  "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "M22 21v-2a4 4 0 0 0-3-3.87",
  "M16 3.13a4 4 0 0 1 0 7.75"
]);

export const Phone = createLucideIcon('phone', [
  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
]);

export const Mail = createLucideIcon('mail', [
  "rect width='20' height='16' x='2' y='4' rx='2'",
  "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
]);

// 5. Actions, UI & Navigation
export const Eye = createLucideIcon('eye', [
  "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
], { cx: "12", cy: "12", r: "3" });

export const EyeOff = createLucideIcon('eye-off', [
  "M9.88 9.88a3 3 0 1 0 4.24 4.24",
  "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",
  "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",
  "m2 2 20 20"
]);

export const ArrowRight = createLucideIcon('arrow-right', [
  "M5 12h14",
  "m12 5 7 7-7 7"
]);

export const ArrowLeft = createLucideIcon('arrow-left', [
  "M19 12H5",
  "m12 19-7-7 7-7"
]);

export const CheckCircle = createLucideIcon('check-circle', [
  "path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'",
  "polyline points='22 4 12 14.01 9 11.01'"
]);

export const AlertCircle = createLucideIcon('alert-circle', [
  "line x1='12' x2='12' y1='8' y2='12'",
  "line x1='12' x2='12.01' y1='16' y2='16'"
], { cx: "12", cy: "12", r: "10" });

export const Lock = createLucideIcon('lock', [
  "rect width='18' height='11' x='3' y='11' rx='2' ry='2'",
  "path d='M7 11V7a5 5 0 0 1 10 0v4'"
]);

export const MapPin = createLucideIcon('map-pin', [
  "path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'"
], { cx: "12", cy: "10", r: "3" });

export const Compass = createLucideIcon('compass', [
  "polygon points='16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76'"
], { cx: "12", cy: "12", r: "10" });

export const CalendarCheck = createLucideIcon('calendar-check', [
  "rect width='18' height='18' x='3' y='4' rx='2' ry='2'",
  "line x1='16' x2='16' y1='2' y2='6'",
  "line x1='8' x2='8' y1='2' y2='6'",
  "line x1='3' x2='21' y1='10' y2='10'",
  "path d='m9 16 2 2 4-4'"
]);

export const Tractor = createLucideIcon('tractor', [
  "path d='m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H18'",
  "path d='M16 18h-5'",
  "path d='M18 5a1 1 0 0 0-1 1v5.5'",
  "path d='m3 11 4-7h10l1 7'",
  "circle cx='7' cy='15' r='4'",
  "circle cx='18.5' cy='18.5' r='2.5'"
]);

export const HeartPulse = createLucideIcon('heart-pulse', [
  "path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'",
  "path d='M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27'"
]);

export const FolderKanban = createLucideIcon('folder-kanban', [
  "path d='M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z'",
  "path d='M8 10v4'",
  "path d='M12 10v2'",
  "path d='M16 10v6'"
]);

export const Stethoscope = createLucideIcon('stethoscope', [
  "path d='M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3'",
  "path d='M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4'",
  "circle cx='20' cy='10' r='2'"
]);

export const ShieldAlert = createLucideIcon('shield-alert', [
  "path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10'",
  "path d='M12 8v4'",
  "path d='M12 16h.01'"
]);

export const Award = createLucideIcon('award', [
  "circle cx='12' cy='8' r='6'",
  "path d='M15.477 12.89 17 22l-5-3-5 3 1.523-9.11'"
]);

export const FileText = createLucideIcon('file-text', [
  "path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'",
  "path d='M14 2v4a2 2 0 0 0 2 2h4'",
  "path d='M10 9H8'",
  "path d='M16 13H8'",
  "path d='M16 17H8'"
]);

export const Menu = createLucideIcon('menu', [
  "line x1='4' x2='20' y1='12' y2='12'",
  "line x1='4' x2='20' y1='6' y2='6'",
  "line x1='4' x2='20' y1='18' y2='18'"
]);

export const X = createLucideIcon('x', [
  "path d='M18 6 6 18'",
  "path d='m6 6 12 12'"
]);

export const LogOut = createLucideIcon('log-out', [
  "path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'",
  "polyline points='16 17 21 12 16 7'",
  "line x1='21' x2='9' y1='12' y2='12'"
]);

export const ChevronRight = createLucideIcon('chevron-right', [
  "path d='m9 18 6-6-6-6'"
]);

export const ChevronDown = createLucideIcon('chevron-down', [
  "path d='m6 9 6 6 6-6'"
]);

export const Plus = createLucideIcon('plus', [
  "path d='M5 12h14'",
  "path d='M12 5v14'"
]);

export const Search = createLucideIcon('search', [
  "path d='m21 21-4.3-4.3'"
], { cx: "11", cy: "11", r: "8" });

export const Volume2 = createLucideIcon('volume-2', [
  "polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'",
  "path d='M15.54 8.46a5 5 0 0 1 0 7.07'",
  "path d='M19.07 4.93a10 10 0 0 1 0 14.14'"
]);

export const VolumeX = createLucideIcon('volume-x', [
  "polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'",
  "line x1='22' x2='16' y1='9' y2='15'",
  "line x1='16' x2='22' y1='9' y2='15'"
]);

export const Home = createLucideIcon('home', [
  "path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'",
  "polyline points='9 22 9 12 15 12 15 22'"
]);

export const HelpCircle = createLucideIcon('help-circle', [
  "circle cx='12' cy='12' r='10'",
  "path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'",
  "line x1='12' x2='12.01' y1='17' y2='17'"
]);

// Dynamic Icon Component mapping all names to pure Lucide SVG

export const Bell = createLucideIcon('bell', [
  "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
  "M10.3 21a1.94 1.94 0 0 0 3.4 0"
]);

export const Settings = createLucideIcon('settings', [
  "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
]);

export const Lightbulb = createLucideIcon('lightbulb', [
  "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
  "M9 18h6",
  "M10 22h4"
]);

export const Camera = createLucideIcon('camera', [
  "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
]);

export const MessageSquare = createLucideIcon('messageSquare', [
  "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
]);

export const allIcons = {
  leaf: Leaf,
  sprout: Sprout,
  wheat: Wheat,
  cloudSun: CloudSun,
  cloudRain: CloudRain,
  droplets: Droplets,
  thermometer: Thermometer,
  trendingUp: TrendingUp,
  dollarSign: DollarSign,
  calculator: Calculator,
  users: Users,
  user: Users,
  phone: Phone,
  mail: Mail,
  eye: Eye,
  eyeOff: EyeOff,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
  lock: Lock,
  mapPin: MapPin,
  compass: Compass,
  calendarCheck: CalendarCheck,
  tractor: Tractor,
  heartPulse: HeartPulse,
  folderKanban: FolderKanban,
  stethoscope: Stethoscope,
  shieldAlert: ShieldAlert,
  award: Award,
  fileText: FileText,
  menu: Menu,
  bell: Bell,
  settings: Settings,
  lightbulb: Lightbulb,
  camera: Camera,
  messageSquare: MessageSquare,
  x: X,
  logout: LogOut,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  plus: Plus,
  search: Search,
  volume2: Volume2,
  volumeX: VolumeX,
  home: Home,
  helpCircle: HelpCircle
};

const nameMapping = {
  potted_plant: 'leaf',
  eco: 'leaf',
  spa: 'sprout',
  grass: 'sprout',
  agriculture: 'tractor',
  precision_manufacturing: 'tractor',
  partly_cloudy_day: 'cloudSun',
  cloud: 'cloudRain',
  water_drop: 'droplets',
  trending_up: 'trendingUp',
  arrow_upward: 'trendingUp',
  groups: 'users',
  person: 'user',
  verified_user: 'checkCircle',
  check_circle: 'checkCircle',
  checklist: 'calendarCheck',
  calendar_month: 'calendarCheck',
  mail: 'mail',
  lock: 'lock',
  visibility: 'eye',
  visibility_off: 'eyeOff',
  arrow_forward: 'arrowRight',
  arrow_back: 'arrowLeft',
  chevron_right: 'chevronRight',
  chevron_left: 'arrowLeft',
  expand_more: 'chevronDown',
  arrow_drop_down: 'chevronDown',
  close: 'x',
  logout: 'logout',
  campaign: 'volume2',
  volume_up: 'volume2',
  add: 'plus',
  search: 'search',
  add_a_photo: 'camera',
  forum: 'messageSquare',
  payments: 'dollarSign',
  account_balance: 'award',
  account_balance_wallet: 'dollarSign',
  psychology: 'leaf',
  document_scanner: 'stethoscope',
  medical_services: 'heartPulse',
  landscape: 'sprout',
  pin_drop: 'mapPin',
  science: 'droplets',
  history_edu: 'fileText',
  support_agent: 'phone',
  call: 'phone',
  notifications: 'bell',
  settings: 'settings',
  lightbulb: 'lightbulb',
  sensors: 'droplets',
  picture_as_pdf: 'fileText',
  error: 'alertCircle',
  warning: 'alertCircle',
  progress_activity: 'sprout',
  schedule: 'calendarCheck'
};

export function Icon({ name, size = 18, className = '', color = 'currentColor', ...props }) {
  const normalizedKey = nameMapping[name] || name;
  const TargetComponent = allIcons[normalizedKey] || Leaf;
  return <TargetComponent size={size} className={className} color={color} {...props} />;
}

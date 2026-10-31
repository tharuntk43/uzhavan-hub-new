/**
 * Uzhavan Hub - Pure SVG Lucide Icon Engine
 * Zero external font dependency. Eliminates Material Symbols ligature bugs.
 */

(function (window) {
  const iconPaths = {
    leaf: [
      "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
      "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
    ],
    sprout: [
      "M7 20h10",
      "M10 20c5.5-2.5.8-6.4 3-10",
      "M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z",
      "M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"
    ],
    wheat: [
      "M2 22 16 8",
      "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
      "M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
      "M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
      "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z",
      "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
      "M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
      "M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"
    ],
    cloudSun: [
      "M12 2v2",
      "m4.93 4.93 1.41 1.41",
      "M20 12h2",
      "m19.07 4.93-1.41 1.41",
      "M15.947 12.65a4 4 0 0 0-5.925-4.128",
      "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"
    ],
    cloudRain: [
      "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
      "M16 14v6",
      "M8 14v6",
      "M12 16v6"
    ],
    droplets: [
      "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
      "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
    ],
    trendingUp: [
      "M22 7 13.5 15.5 8.5 10.5 2 17",
      "M16 7h6v6"
    ],
    users: [
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      "M22 21v-2a4 4 0 0 0-3-3.87",
      "M16 3.13a4 4 0 0 1 0 7.75"
    ],
    user: [
      "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
    ],
    mail: [
      "M22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
    ],
    lock: [
      "M7 11V7a5 5 0 0 1 10 0v4"
    ],
    eye: [
      "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
    ],
    eyeOff: [
      "M9.88 9.88a3 3 0 1 0 4.24 4.24",
      "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",
      "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",
      "M2 2l20 20"
    ],
    arrowRight: [
      "M5 12h14",
      "m12 5 7 7-7 7"
    ],
    arrowLeft: [
      "m12 19-7-7 7-7",
      "M19 12H5"
    ],
    checkCircle: [
      "M22 11.08V12a10 10 0 1 1-5.93-9.14",
      "m9 11 3 3L22 4"
    ],
    alertCircle: [
      "M12 8v4",
      "M12 16h.01"
    ],
    mapPin: [
      "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
    ],
    calendarCheck: [
      "M16 2v4",
      "M8 2v4",
      "M3 10h18",
      "m9 16 2 2 4-4"
    ],
    tractor: [
      "m10 11 11 .9a1 1 0 0 1 .8 1.1l-.66 5a1 1 0 0 1-1 .9H15",
      "M16 18h-5",
      "M18 5a1 1 0 0 0-1 1v5"
    ],
    heartPulse: [
      "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"
    ],
    stethoscope: [
      "M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3",
      "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"
    ],
    shieldAlert: [
      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
      "M12 8v4",
      "M12 16h.01"
    ],
    award: [
      "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
    ],
    fileText: [
      "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      "M14 2v6h6",
      "M16 13H8",
      "M16 17H8",
      "M10 9H8"
    ],
    phone: [
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
    ],
    dollarSign: [
      "M12 2v20",
      "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    ],
    calculator: [
      "M16 6H8",
      "M16 14v4",
      "M16 10h.01",
      "M12 10h.01",
      "M8 10h.01",
      "M12 14h.01",
      "M8 14h.01",
      "M12 18h.01",
      "M8 18h.01"
    ],
    volume2: [
      "M11 5 6 9H2v6h4l5 4V5Z",
      "M15.54 8.46a5 5 0 0 1 0 7.07",
      "M19.07 4.93a10 10 0 0 1 0 14.14"
    ],
    volumeX: [
      "M11 5 6 9H2v6h4l5 4V5Z",
      "m22 9-6 6",
      "m16 9 6 6"
    ],
    logout: [
      "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
      "m16 17 5-5-5-5",
      "M21 12H9"
    ],
    plus: [
      "M12 5v14",
      "M5 12h14"
    ],
    close: [
      "M18 6 6 18",
      "M6 6l12 12"
    ],
    chevronRight: [
      "m9 18 6-6-6-6"
    ],
    chevronDown: [
      "m6 9 6 6 6-6"
    ],
    search: [
      "m21 21-4.35-4.35"
    ],
    camera: [
      "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
    ],
    messageSquare: [
      "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
    ],
    database: [
      "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5",
      "M3 12c0 1.66 4 3 9 3s9-1.34 9-3"
    ],
    home: [
      "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      "M9 22V12h6v10"
    ],
    thermometer: [
      "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"
    ],
    bell: [
      "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
      "M10.3 21a1.94 1.94 0 0 0 3.4 0"
    ],
    settings: [
      "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
    ],
    menu: [
      "M4 12h16",
      "M4 6h16",
      "M4 18h16"
    ],
    lightbulb: [
      "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      "M9 18h6",
      "M10 22h4"
    ]
  };

  const extraCircles = {
    users: [{ cx: 9, cy: 7, r: 4 }],
    user: [{ cx: 12, cy: 7, r: 4 }],
    eye: [{ cx: 12, cy: 12, r: 3 }],
    alertCircle: [{ cx: 12, cy: 12, r: 10 }],
    mapPin: [{ cx: 12, cy: 10, r: 3 }],
    tractor: [{ cx: 7, cy: 15, r: 5 }, { cx: 7, cy: 15, r: 2 }, { cx: 19, cy: 17, r: 2 }],
    stethoscope: [{ cx: 20, cy: 10, r: 2 }],
    award: [{ cx: 12, cy: 8, r: 6 }],
    search: [{ cx: 11, cy: 11, r: 8 }],
    camera: [{ cx: 12, cy: 13, r: 3 }],
    settings: [{ cx: 12, cy: 12, r: 3 }]
  };

  const extraRects = {
    mail: [{ width: 20, height: 16, x: 2, y: 4, rx: 2 }],
    lock: [{ width: 18, height: 11, x: 3, y: 11, rx: 2, ry: 2 }],
    calendarCheck: [{ width: 18, height: 18, x: 3, y: 4, rx: 2, ry: 2 }],
    calculator: [{ width: 16, height: 20, x: 4, y: 2, rx: 2 }]
  };

  const extraEllipses = {
    database: [{ cx: 12, cy: 5, rx: 9, ry: 3 }]
  };

  const iconAliases = {
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
    close: 'close',
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
    psychology: 'sprout',
    document_scanner: 'stethoscope',
    medical_services: 'heartPulse',
    landscape: 'calendarCheck',
    pin_drop: 'mapPin',
    science: 'droplets',
    history_edu: 'fileText',
    support_agent: 'phone',
    call: 'phone',
    notifications: 'bell',
    sensors: 'droplets',
    picture_as_pdf: 'fileText',
    error: 'alertCircle',
    warning: 'alertCircle',
    progress_activity: 'sprout',
    schedule: 'calendarCheck'
  };

  function getLucideSvg(name, options = {}) {
    const key = iconAliases[name] || name;
    const paths = iconPaths[key] || iconPaths['leaf'];
    const circles = extraCircles[key] || [];
    const rects = extraRects[key] || [];
    const ellipses = extraEllipses[key] || [];

    const size = options.size || 20;
    const className = options.className || '';
    const strokeWidth = options.strokeWidth || 2;
    const color = options.color || 'currentColor';

    const circleSvg = circles.map(c => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}"/>`).join('');
    const rectSvg = rects.map(r => `<rect width="${r.width}" height="${r.height}" x="${r.x}" y="${r.y}" rx="${r.rx || 0}" ry="${r.ry || 0}"/>`).join('');
    const ellipseSvg = ellipses.map(e => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}"/>`).join('');
    const pathSvg = paths.map(d => `<path d="${d}"/>`).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${key} shrink-0 inline-block align-middle ${className}" aria-hidden="true">${circleSvg}${rectSvg}${ellipseSvg}${pathSvg}</svg>`;
  }

  window.UzhavanLucide = {
    getSvg: getLucideSvg,
    iconAliases
  };
})(window);

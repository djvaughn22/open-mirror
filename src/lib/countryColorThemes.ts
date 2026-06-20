export type CountryColorTheme = {
  code: string;
  name: string;
  colors: string[];
};

export type AppliedCountryTheme = {
  code: string;
  name: string;
  background: string;
  surface: string;
  surfaceSoft: string;
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  border: string;
};

const COUNTRY_CODES = [
  "AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ",
  "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ",
  "CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ",
  "DE","DJ","DK","DM","DO","DZ",
  "EC","EE","EG","EH","ER","ES","ET",
  "FI","FJ","FK","FM","FO","FR",
  "GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY",
  "HK","HM","HN","HR","HT","HU",
  "ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT",
  "JE","JM","JO","JP",
  "KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ",
  "LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY",
  "MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ",
  "NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ",
  "OM",
  "PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY",
  "QA",
  "RE","RO","RS","RU","RW",
  "SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ",
  "TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ",
  "UA","UG","UM","US","UY","UZ",
  "VA","VC","VE","VG","VI","VN","VU",
  "WF","WS",
  "YE","YT",
  "ZA","ZM","ZW"
];

const NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  IR: "Iran",
  KR: "South Korea",
  KP: "North Korea",
  PS: "Palestine",
  VA: "Vatican City",
  CD: "Congo - Kinshasa",
  CG: "Congo - Brazzaville",
  CI: "Côte d’Ivoire",
  CV: "Cape Verde",
  CZ: "Czechia",
  SZ: "Eswatini",
  TR: "Türkiye",
  MK: "North Macedonia",
};

const PALETTES: Record<string, string[]> = {
  AD: ["#0055A4", "#FFD100", "#EF3340"],
  AE: ["#00732F", "#FFFFFF", "#000000", "#FF0000"],
  AF: ["#000000", "#D32011", "#007A36"],
  AG: ["#CE1126", "#0072C6", "#FCD116", "#000000", "#FFFFFF"],
  AL: ["#E41E20", "#000000"],
  AM: ["#D90012", "#0033A0", "#F2A800"],
  AO: ["#CE1126", "#000000", "#FCD116"],
  AR: ["#75AADB", "#FFFFFF", "#F6B40E"],
  AT: ["#ED2939", "#FFFFFF"],
  AU: ["#00008B", "#FFFFFF", "#FF0000"],
  AZ: ["#00B5E2", "#EF3340", "#509E2F"],
  BA: ["#002F6C", "#FECB00", "#FFFFFF"],
  BB: ["#00267F", "#FFC726", "#000000"],
  BD: ["#006A4E", "#F42A41"],
  BE: ["#000000", "#FFD90C", "#EF3340"],
  BF: ["#EF2B2D", "#009E49", "#FCD116"],
  BG: ["#FFFFFF", "#00966E", "#D62612"],
  BH: ["#FFFFFF", "#CE1126"],
  BI: ["#1EB53A", "#FFFFFF", "#CE1126"],
  BJ: ["#008751", "#FCD116", "#E8112D"],
  BO: ["#D52B1E", "#F9E300", "#007934"],
  BR: ["#009B3A", "#FFDF00", "#002776"],
  BS: ["#00ABC9", "#FAE042", "#000000"],
  BT: ["#FFCC00", "#FF4E12", "#FFFFFF"],
  BW: ["#75AADB", "#000000", "#FFFFFF"],
  BY: ["#D22730", "#00AF66", "#FFFFFF"],
  BZ: ["#003F87", "#CE1126", "#FFFFFF"],
  CA: ["#D52B1E", "#FFFFFF"],
  CH: ["#FF0000", "#FFFFFF"],
  CL: ["#0039A6", "#FFFFFF", "#D52B1E"],
  CM: ["#007A5E", "#CE1126", "#FCD116"],
  CN: ["#DE2910", "#FFDE00"],
  CO: ["#FCD116", "#003893", "#CE1126"],
  CR: ["#002B7F", "#FFFFFF", "#CE1126"],
  CU: ["#002A8F", "#FFFFFF", "#CF142B"],
  CY: ["#FFFFFF", "#D57800", "#4E9A06"],
  CZ: ["#11457E", "#FFFFFF", "#D7141A"],
  DE: ["#000000", "#DD0000", "#FFCE00"],
  DK: ["#C60C30", "#FFFFFF"],
  DO: ["#002D62", "#FFFFFF", "#CE1126"],
  DZ: ["#006233", "#FFFFFF", "#D21034"],
  EC: ["#FFD100", "#003893", "#CE1126"],
  EE: ["#0072CE", "#000000", "#FFFFFF"],
  EG: ["#CE1126", "#FFFFFF", "#000000", "#C09300"],
  ER: ["#12AD2B", "#4189DD", "#EA0437", "#FFC726"],
  ES: ["#AA151B", "#F1BF00"],
  ET: ["#078930", "#FCDD09", "#DA121A"],
  FI: ["#FFFFFF", "#002F6C"],
  FJ: ["#68BFE5", "#002868", "#CE1126", "#FFFFFF"],
  FR: ["#0055A4", "#FFFFFF", "#EF4135"],
  GA: ["#009E60", "#FCD116", "#3A75C4"],
  GB: ["#012169", "#FFFFFF", "#C8102E"],
  GD: ["#CE1126", "#FCD116", "#007A5E"],
  GE: ["#FFFFFF", "#FF0000"],
  GH: ["#CE1126", "#FCD116", "#006B3F", "#000000"],
  GR: ["#0D5EAF", "#FFFFFF"],
  GT: ["#4997D0", "#FFFFFF"],
  GY: ["#009E49", "#FCD116", "#CE1126", "#000000", "#FFFFFF"],
  HK: ["#DE2910", "#FFFFFF"],
  HN: ["#00BCE4", "#FFFFFF"],
  HR: ["#FF0000", "#FFFFFF", "#171796"],
  HT: ["#00209F", "#D21034", "#FFFFFF"],
  HU: ["#CE2939", "#FFFFFF", "#477050"],
  ID: ["#FF0000", "#FFFFFF"],
  IE: ["#169B62", "#FFFFFF", "#FF883E"],
  IL: ["#0038B8", "#FFFFFF"],
  IN: ["#FF9933", "#FFFFFF", "#138808", "#000080"],
  IQ: ["#CE1126", "#FFFFFF", "#000000", "#007A3D"],
  IR: ["#239F40", "#FFFFFF", "#DA0000"],
  IS: ["#02529C", "#FFFFFF", "#DC1E35"],
  IT: ["#009246", "#FFFFFF", "#CE2B37"],
  JM: ["#009B3A", "#FED100", "#000000"],
  JO: ["#000000", "#FFFFFF", "#007A3D", "#CE1126"],
  JP: ["#FFFFFF", "#BC002D"],
  KE: ["#000000", "#BB0000", "#006600", "#FFFFFF"],
  KG: ["#E8112D", "#F9D616"],
  KH: ["#032EA1", "#E00025", "#FFFFFF"],
  KM: ["#3A75C4", "#FCD116", "#FFFFFF", "#CE1126", "#009639"],
  KR: ["#FFFFFF", "#CD2E3A", "#0047A0", "#000000"],
  KW: ["#007A3D", "#FFFFFF", "#CE1126", "#000000"],
  KZ: ["#00AFCA", "#FEC50C"],
  LA: ["#CE1126", "#002868", "#FFFFFF"],
  LB: ["#ED1C24", "#FFFFFF", "#00A651"],
  LC: ["#66CCFF", "#FCD116", "#000000", "#FFFFFF"],
  LI: ["#002B7F", "#CE1126", "#FFD100"],
  LK: ["#FFB700", "#8D153A", "#00534E", "#EB7400"],
  LR: ["#BF0A30", "#FFFFFF", "#002868"],
  LT: ["#FDB913", "#006A44", "#C1272D"],
  LU: ["#EF3340", "#FFFFFF", "#00A3E0"],
  LV: ["#9E3039", "#FFFFFF"],
  LY: ["#E70013", "#000000", "#239E46", "#FFFFFF"],
  MA: ["#C1272D", "#006233"],
  MC: ["#CE1126", "#FFFFFF"],
  MD: ["#0033A0", "#FFD200", "#CC092F"],
  ME: ["#C40308", "#D3AE3B"],
  MG: ["#FFFFFF", "#FC3D32", "#007E3A"],
  ML: ["#14B53A", "#FCD116", "#CE1126"],
  MM: ["#FECB00", "#34B233", "#EA2839", "#FFFFFF"],
  MN: ["#C4272F", "#015197", "#FFD100"],
  MT: ["#FFFFFF", "#CF142B"],
  MU: ["#EA2839", "#1A206D", "#FFD500", "#00A551"],
  MV: ["#D21034", "#007E3A", "#FFFFFF"],
  MW: ["#000000", "#CE1126", "#339E35"],
  MX: ["#006847", "#FFFFFF", "#CE1126"],
  MY: ["#010066", "#CC0001", "#FFFFFF", "#FFCC00"],
  MZ: ["#009739", "#000000", "#FCE100", "#FFFFFF", "#E4002B"],
  NA: ["#003580", "#FFFFFF", "#D21034", "#009543", "#FFD100"],
  NE: ["#E05206", "#FFFFFF", "#0DB02B"],
  NG: ["#008751", "#FFFFFF"],
  NI: ["#0067C6", "#FFFFFF"],
  NL: ["#AE1C28", "#FFFFFF", "#21468B"],
  NO: ["#BA0C2F", "#FFFFFF", "#00205B"],
  NP: ["#DC143C", "#003893", "#FFFFFF"],
  NZ: ["#00247D", "#CC142B", "#FFFFFF"],
  OM: ["#FFFFFF", "#DB161B", "#008000"],
  PA: ["#005293", "#FFFFFF", "#D21034"],
  PE: ["#D91023", "#FFFFFF"],
  PG: ["#000000", "#CE1126", "#FCD116"],
  PH: ["#0038A8", "#CE1126", "#FFFFFF", "#FCD116"],
  PK: ["#01411C", "#FFFFFF"],
  PL: ["#FFFFFF", "#DC143C"],
  PR: ["#0050F0", "#FFFFFF", "#EF0000"],
  PS: ["#000000", "#FFFFFF", "#007A3D", "#CE1126"],
  PT: ["#006600", "#FF0000", "#FFFF00"],
  PY: ["#D52B1E", "#FFFFFF", "#0038A8"],
  QA: ["#8A1538", "#FFFFFF"],
  RO: ["#002B7F", "#FCD116", "#CE1126"],
  RS: ["#C6363C", "#0C4076", "#FFFFFF"],
  RU: ["#FFFFFF", "#0039A6", "#D52B1E"],
  RW: ["#00A1DE", "#FAD201", "#20603D"],
  SA: ["#006C35", "#FFFFFF"],
  SB: ["#0051BA", "#FCD116", "#215B33"],
  SC: ["#003F87", "#FCD856", "#D62828", "#FFFFFF", "#007A3D"],
  SD: ["#D21034", "#FFFFFF", "#000000", "#007229"],
  SE: ["#006AA7", "#FECC00"],
  SG: ["#EF3340", "#FFFFFF"],
  SI: ["#FFFFFF", "#005DA4", "#ED1C24"],
  SK: ["#FFFFFF", "#0B4EA2", "#EE1C25"],
  SL: ["#1EB53A", "#FFFFFF", "#0072C6"],
  SN: ["#00853F", "#FDEF42", "#E31B23"],
  SO: ["#4189DD", "#FFFFFF"],
  SR: ["#377E3F", "#FFFFFF", "#B40A2D", "#ECC81D"],
  SS: ["#000000", "#DA121A", "#078930", "#FFFFFF", "#0F47AF", "#FCDD09"],
  SV: ["#0F47AF", "#FFFFFF"],
  SY: ["#CE1126", "#FFFFFF", "#000000", "#007A3D"],
  TH: ["#A51931", "#FFFFFF", "#2D2A4A"],
  TJ: ["#CC0000", "#FFFFFF", "#006600", "#F8C300"],
  TL: ["#DC241F", "#FFC726", "#000000", "#FFFFFF"],
  TM: ["#00843D", "#FFFFFF", "#B31B1B"],
  TN: ["#E70013", "#FFFFFF"],
  TO: ["#C10000", "#FFFFFF"],
  TR: ["#E30A17", "#FFFFFF"],
  TT: ["#CE1126", "#000000", "#FFFFFF"],
  TW: ["#FE0000", "#000095", "#FFFFFF"],
  TZ: ["#1EB53A", "#FCD116", "#000000", "#00A3DD"],
  UA: ["#005BBB", "#FFD500"],
  UG: ["#000000", "#FCDC04", "#D90000", "#FFFFFF"],
  US: ["#3C3B6E", "#FFFFFF", "#B22234"],
  UY: ["#0038A8", "#FFFFFF", "#FCD116"],
  UZ: ["#1EB53A", "#0099B5", "#FFFFFF", "#CE1126"],
  VA: ["#FFE000", "#FFFFFF"],
  VE: ["#FCD116", "#003893", "#CE1126"],
  VN: ["#DA251D", "#FFFF00"],
  VU: ["#009543", "#D21034", "#000000", "#FCD116"],
  WS: ["#CE1126", "#002B7F", "#FFFFFF"],
  YE: ["#CE1126", "#FFFFFF", "#000000"],
  ZA: ["#007749", "#FFB81C", "#000000", "#FFFFFF", "#DE3831", "#002395"],
  ZM: ["#198A00", "#DE2010", "#000000", "#EF7D00"],
  ZW: ["#009739", "#FCD116", "#DE2010", "#000000", "#FFFFFF"],
};

function countryName(code: string) {
  if (NAMES[code]) {
    return NAMES[code];
  }

  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(code) || code;
  } catch {
    return code;
  }
}

function fallbackColors(code: string) {
  const palettes = [
    ["#0f172a", "#f8fafc", "#10b981"],
    ["#111827", "#ffffff", "#ef4444"],
    ["#052e16", "#fefce8", "#eab308"],
    ["#1e1b4b", "#ffffff", "#38bdf8"],
    ["#450a0a", "#ffffff", "#22c55e"],
  ];

  const index = code.charCodeAt(0) % palettes.length;
  return palettes[index];
}

function readableTextFor(background: string) {
  const hex = background.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 148 ? "#111827" : "#f8fafc";
}

function withAlpha(hex: string, alpha: string) {
  const clean = hex.replace("#", "");

  if (clean.length !== 6) {
    return hex;
  }

  const value = Math.round(Number(alpha) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${clean}${value}`;
}

export const DEFAULT_COUNTRY_THEME: AppliedCountryTheme = {
  code: "DEFAULT",
  name: "CrossHeartPray Dark",
  background: "#020617",
  surface: "#0f172a",
  surfaceSoft: "rgba(255,255,255,0.06)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  accent: "#6ee7b7",
  accent2: "#f9a8d4",
  border: "rgba(255,255,255,0.14)",
};

export const COUNTRY_COLOR_THEMES: CountryColorTheme[] = COUNTRY_CODES.map((code) => ({
  code,
  name: countryName(code),
  colors: PALETTES[code] ?? fallbackColors(code),
})).sort((a, b) => a.name.localeCompare(b.name));

export function getCountryTheme(code?: string | null): AppliedCountryTheme {
  const cleanCode = (code || "").trim().toUpperCase();

  if (!cleanCode || cleanCode === "DEFAULT") {
    return DEFAULT_COUNTRY_THEME;
  }

  const country = COUNTRY_COLOR_THEMES.find((theme) => theme.code === cleanCode);

  if (!country) {
    return DEFAULT_COUNTRY_THEME;
  }

  const [primary, secondary = "#ffffff", tertiary = primary] = country.colors;
  const text = readableTextFor(primary);

  return {
    code: country.code,
    name: country.name,
    background: primary,
    surface: withAlpha(secondary, "0.20"),
    surfaceSoft: withAlpha(secondary, "0.12"),
    text,
    muted: text === "#111827" ? "#1f2937" : "#e5e7eb",
    accent: tertiary,
    accent2: secondary,
    border: withAlpha(secondary, "0.36"),
  };
}

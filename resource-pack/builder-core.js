const ID_PATTERN = /^[a-z0-9][a-z0-9._-]{0,127}$/;
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;
const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const encoder = new TextEncoder();

export const POI_TYPES = [
  ['port', '항구'],
  ['guild_city', '길드 도시'],
  ['landing', '상륙지'],
  ['outskirts', '도시 외곽'],
  ['inland', '내륙·유적'],
  ['inland_city', '내륙도시'],
  ['private_farm', '개인 농장'],
  ['sea', '해상 거점'],
];

export const DEFAULT_PALETTE = {
  surface: '#081722',
  surfaceRaised: '#12212E',
  text: '#F0E7D8',
  muted: '#91A4B2',
  accent: '#D8A84B',
  status: '#55B88B',
  warning: '#D27A67',
  steeringDirection: '#D8A84B',
  steeringTarget: '#35C6FF',
  steeringAligned: '#55B88B',
  steeringCenter: '#D8A84B',
};

export const DEFAULT_MAP_THEME = {
  vectorOpacity: 0.82, oceanColor: '#07131D', oceanOpacity: 0.08,
  showLandFill: true, landFillColor: '#12212E', landFillOpacity: 0.52,
  showCoastline: true, coastlineColor: '#EDE2CE', coastlineOpacity: 0.72,
  coastlineWidth: 0.9, coastlinePattern: 'solid', showSeaRegions: true,
  seaRegionColor: '#D8A84B', seaRegionOpacity: 0.68, seaRegionWidth: 1,
  seaRegionPattern: 'solid', showCurrentSeaRegion: true,
  currentSeaRegionColor: '#35C6FF', currentSeaRegionOpacity: 0.18,
  showSeaRegionLabels: false, seaRegionLabelColor: '#F0C768',
  seaRegionLabelOpacity: 0.78, seaRegionLabelSize: 10,
};

export const DEFAULT_LINE_THEME = {
  course: { color: '#35C6FF', pattern: 'solid', width: 2.2, opacity: 0.92 },
  compass: { color: '#C7A6FF', pattern: 'dashed', width: 1.25, opacity: 0.48 },
  mouse: { color: '#C8D7E1', pattern: 'dotted', width: 1, opacity: 0.3 },
  track: { color: '#4FD1A1', pattern: 'solid', width: 1.5, opacity: 0.65 },
  route: { color: '#FF7A6E', pattern: 'dashed', width: 2, opacity: 0.8 },
};

function linePatternDasharray(pattern, width) {
  const resolvedWidth = Math.max(0.25, Number(width) || 1);
  if (pattern === 'dashed') return `${resolvedWidth * 4} ${resolvedWidth * 3}`;
  if (pattern === 'dotted') return `${resolvedWidth} ${resolvedWidth * 2}`;
  return 'none';
}

export function previewStyleVariables(state) {
  const palette = state.palette || DEFAULT_PALETTE;
  const map = state.mapTheme || DEFAULT_MAP_THEME;
  const lines = state.lineTheme || DEFAULT_LINE_THEME;
  const details = state.details || {};
  const variables = {
    '--preview-surface': palette.surface,
    '--preview-surface-raised': palette.surfaceRaised,
    '--preview-text': palette.text,
    '--preview-muted': palette.muted,
    '--preview-accent': palette.accent,
    '--preview-status': palette.status,
    '--preview-warning': palette.warning,
    '--preview-steering-direction': palette.steeringDirection,
    '--preview-steering-target': palette.steeringTarget,
    '--preview-steering-aligned': palette.steeringAligned,
    '--preview-steering-center': palette.steeringCenter,
    '--preview-map-ocean': map.oceanColor,
    '--preview-map-ocean-opacity': String(map.oceanOpacity),
    '--preview-map-land': map.landFillColor,
    '--preview-map-land-opacity': String(map.landFillOpacity),
    '--preview-map-coastline': map.coastlineColor,
    '--preview-map-coastline-opacity': String(map.coastlineOpacity),
    '--preview-map-sea-region': map.seaRegionColor,
    '--preview-map-sea-region-opacity': String(map.seaRegionOpacity),
    '--preview-map-current-sea': map.currentSeaRegionColor,
    '--preview-map-current-sea-opacity': String(map.currentSeaRegionOpacity),
    '--preview-map-label': map.seaRegionLabelColor,
    '--preview-map-label-opacity': String(map.seaRegionLabelOpacity),
    '--preview-corner-radius': `${Number(details.cornerRadius) || 0}px`,
    '--preview-border-width': `${Number(details.borderWidth) || 0}px`,
    '--preview-backdrop-blur': `${Number(details.backdropBlur) || 0}px`,
    '--preview-shadow': details.shadow === 'none'
      ? 'none'
      : details.shadow === 'soft'
        ? '0 8px 18px rgb(0 0 0 / 0.22)'
        : '0 14px 34px rgb(0 0 0 / 0.42)',
  };
  for (const key of ['course', 'compass', 'mouse', 'track', 'route']) {
    const appearance = lines[key] || DEFAULT_LINE_THEME[key];
    variables[`--preview-${key}-color`] = appearance.color;
    variables[`--preview-${key}-width`] = `${appearance.width}px`;
    variables[`--preview-${key}-opacity`] = String(appearance.opacity);
    variables[`--preview-${key}-dash`] = linePatternDasharray(
      appearance.pattern,
      appearance.width,
    );
  }
  return variables;
}

export function createDefaultState() {
  return {
    namespace: 'community.myname',
    slug: 'my-navigation-pack',
    name: '나의 항해 리소스팩',
    author: '',
    version: '0.1.0',
    license: 'CC-BY-4.0',
    sourceName: '제작자 직접 제작',
    sourceUrl: '',
    includePoi: true,
    includeHud: false,
    palette: { ...DEFAULT_PALETTE },
    mapTheme: { ...DEFAULT_MAP_THEME },
    lineTheme: Object.fromEntries(Object.entries(DEFAULT_LINE_THEME).map(([key, value]) => [key, { ...value }])),
    details: { cornerRadius: 0, backdropBlur: 4, borderWidth: 1, shadow: 'strong', centerVertical: 112, centerHorizontal: 64, diamondSize: 12, centerLineWidth: 1, statusOpacity: 0.75, editOpacity: 0.9 },
    pois: [createDefaultPoi(1)],
  };
}

export function createDefaultPoi(index) {
  return {
    idSuffix: `place-${index}`,
    name: '',
    type: 'port',
    x: 15784,
    y: 3205,
    aliases: '',
    coordinateRole: 'navigation',
    entrancePoiIds: '',
  };
}

function labelValid(value, max = 128) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

function httpsOrEmpty(value) {
  if (!value) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function packIdFor(state) {
  return `${String(state.namespace).trim()}.${String(state.slug).trim()}`;
}

export function validateState(state) {
  const errors = [];
  const namespace = String(state.namespace).trim();
  const slug = String(state.slug).trim();
  const packId = packIdFor(state);
  if (!ID_PATTERN.test(namespace)) errors.push('제작자 ID는 소문자 영문·숫자와 . _ -만 사용할 수 있습니다.');
  if (!ID_PATTERN.test(slug) || slug.includes('.')) errors.push('팩 ID는 소문자 영문·숫자와 _ -만 사용해 주세요.');
  if (!ID_PATTERN.test(packId)) errors.push('완성된 packId가 128자를 넘거나 형식이 올바르지 않습니다.');
  if (!labelValid(state.name)) errors.push('팩 이름을 입력해 주세요.');
  if (!labelValid(state.author)) errors.push('제작자 표시명을 입력해 주세요.');
  if (!SEMVER_PATTERN.test(String(state.version).trim())) errors.push('버전은 0.1.0 같은 SemVer 형식이어야 합니다.');
  if (!labelValid(state.license)) errors.push('라이선스를 선택해 주세요.');
  if (!labelValid(state.sourceName)) errors.push('자료 출처 설명을 입력해 주세요.');
  if (!httpsOrEmpty(String(state.sourceUrl).trim())) errors.push('출처 주소는 비워 두거나 https:// 주소를 사용해야 합니다.');
  if (!state.includePoi && !state.includeHud) errors.push('거점 또는 HUD 색상 중 하나 이상을 선택해 주세요.');

  if (state.includePoi) {
    if (!Array.isArray(state.pois) || state.pois.length === 0) errors.push('추가할 거점을 하나 이상 입력해 주세요.');
    const ids = new Set();
    for (const [index, poi] of (state.pois || []).entries()) {
      const prefix = `거점 ${index + 1}`;
      const id = `${packId}.${String(poi.idSuffix).trim()}`;
      if (!ID_PATTERN.test(String(poi.idSuffix).trim()) || String(poi.idSuffix).includes('.')) errors.push(`${prefix}의 ID 형식을 확인해 주세요.`);
      if (!ID_PATTERN.test(id)) errors.push(`${prefix}의 완성된 ID가 너무 깁니다.`);
      if (ids.has(id)) errors.push(`${prefix}의 ID가 중복되었습니다.`);
      ids.add(id);
      if (!labelValid(poi.name)) errors.push(`${prefix}의 이름을 입력해 주세요.`);
      if (!POI_TYPES.some(([type]) => type === poi.type)) errors.push(`${prefix}의 유형이 올바르지 않습니다.`);
      if (!Number.isInteger(Number(poi.x)) || Number(poi.x) < 0 || Number(poi.x) > 16383) errors.push(`${prefix}의 X 좌표는 0~16383 정수여야 합니다.`);
      if (!Number.isInteger(Number(poi.y)) || Number(poi.y) < 0 || Number(poi.y) > 8191) errors.push(`${prefix}의 Y 좌표는 0~8191 정수여야 합니다.`);
      if (!['navigation', 'display'].includes(poi.coordinateRole)) errors.push(`${prefix}의 좌표 역할이 올바르지 않습니다.`);
      const aliases = splitList(poi.aliases);
      if (aliases.length > 32) errors.push(`${prefix}의 검색 별칭은 최대 32개입니다.`);
      if (new Set(aliases).size !== aliases.length) errors.push(`${prefix}의 검색 별칭이 중복되었습니다.`);
      const entrances = splitList(poi.entrancePoiIds);
      if (entrances.length > 16) errors.push(`${prefix}의 입구 ID는 최대 16개입니다.`);
      if (entrances.some((idValue) => !ID_PATTERN.test(idValue))) errors.push(`${prefix}의 입구 ID 형식을 확인해 주세요.`);
    }
  }

  if (state.includeHud) {
    for (const [key, color] of Object.entries(state.palette || {})) {
      if (!COLOR_PATTERN.test(String(color))) errors.push(`${key} 색상은 #RRGGBB 형식이어야 합니다.`);
    }
    for (const [key, color] of Object.entries(state.mapTheme || {}).filter(([name]) => name.endsWith('Color'))) {
      if (!COLOR_PATTERN.test(String(color))) errors.push(`${key} 지도 색상은 #RRGGBB 형식이어야 합니다.`);
    }
    for (const [key, appearance] of Object.entries(state.lineTheme || {})) {
      if (!COLOR_PATTERN.test(String(appearance.color)) || !['solid', 'dashed', 'dotted'].includes(appearance.pattern)
        || Number(appearance.width) < 0.25 || Number(appearance.width) > 8 || Number(appearance.opacity) < 0 || Number(appearance.opacity) > 1) errors.push(`${key} 항해선 설정이 올바르지 않습니다.`);
    }
    const detailRanges = { cornerRadius: [0, 24], backdropBlur: [0, 20], borderWidth: [0, 4], centerVertical: [8, 256], centerHorizontal: [8, 256], diamondSize: [4, 64], centerLineWidth: [1, 4], statusOpacity: [0, 1], editOpacity: [0, 1] };
    for (const [key, [minimum, maximum]] of Object.entries(detailRanges)) {
      const value = Number(state.details?.[key]);
      if (!Number.isFinite(value) || value < minimum || value > maximum) errors.push(`${key} 값은 ${minimum}~${maximum}여야 합니다.`);
    }
    if (!['none', 'soft', 'strong'].includes(state.details?.shadow)) errors.push('정보 패널 그림자 값이 올바르지 않습니다.');
  }
  return [...new Set(errors)];
}

function splitList(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
}

function makePoi(state, poi) {
  const item = {
    id: `${packIdFor(state)}.${String(poi.idSuffix).trim()}`,
    name: String(poi.name).trim(),
    type: poi.type,
    x: Number(poi.x),
    y: Number(poi.y),
  };
  const aliases = splitList(poi.aliases);
  const entrances = splitList(poi.entrancePoiIds);
  if (aliases.length) item.aliases = aliases;
  if (poi.coordinateRole === 'display') item.coordinateRole = 'display';
  if (entrances.length) item.entrancePoiIds = entrances;
  return item;
}

function makeHudComponents(state) {
  const id = packIdFor(state);
  const p = state.palette;
  return {
    infoPanelSkin: {
      id: `${id}.info-panel`, name: `${state.name} 정보 패널`,
      colors: {
        panelBackground: p.surface, panelBorder: p.muted, primaryText: p.text,
        secondaryText: p.muted, mutedText: p.muted, accent: p.accent,
        routeHighlight: p.accent, status: p.warning, rule: p.surfaceRaised,
        arrivalBackground: p.surfaceRaised, arrivalBorder: p.accent, arrivalText: p.text,
        editBackground: p.surface, editText: p.text, editBorder: p.accent,
        editControlBorder: p.muted,
      },
      frame: { borderWidth: Number(state.details.borderWidth), cornerRadius: Number(state.details.cornerRadius), backdropBlur: Number(state.details.backdropBlur), shadow: state.details.shadow },
      navigator: {
        colors: { background: p.surface, surface: p.surfaceRaised, text: p.text, mutedText: p.muted, line: p.accent, rule: p.surfaceRaised, accent: p.accent, danger: p.warning, focus: p.accent },
        cornerRadius: Number(state.details.cornerRadius),
      },
    },
    steeringHudSkin: {
      id: `${id}.steering-hud`, name: `${state.name} 조향 HUD`,
      colors: { neutral: p.text, surface: p.surface },
      guidanceColors: {
        direction: p.steeringDirection,
        target: p.steeringTarget,
        aligned: p.steeringAligned,
        centerMarker: p.steeringCenter,
      },
      opacity: {
        guideLine: 0.2, tick: 0.25, majorTick: 0.55, minorTick: 0.3,
        compassText: 0.65, minorCompassText: 0.35, centerLabel: 0.55,
        targetMarkerSurface: 0.7, targetLabelSurface: 0.8,
      },
      centerMarker: { verticalLength: Number(state.details.centerVertical), horizontalLength: Number(state.details.centerHorizontal), diamondSize: Number(state.details.diamondSize), lineWidth: Number(state.details.centerLineWidth) },
    },
    mapHudSkin: {
      id: `${id}.map-hud`, name: `${state.name} 지도 HUD`,
      colors: {
        surface: p.surface, text: p.text, mutedText: p.muted, border: p.muted,
        accent: p.accent, connected: p.status, waiting: p.accent, editText: p.text,
      },
      frame: {
        statusSurfaceOpacity: Number(state.details.statusOpacity), highlightedSurfaceOpacity: 0.8,
        borderOpacity: 0.6, editSurfaceOpacity: Number(state.details.editOpacity), editBorderWidth: 2,
      },
      mapTheme: state.mapTheme,
      navigationTheme: state.lineTheme,
    },
  };
}

export async function buildPackFiles(state) {
  const errors = validateState(state);
  if (errors.length) throw new Error(errors.join('\n'));
  const packId = packIdFor(state);
  const components = {};
  const contentFiles = new Map();
  if (state.includePoi) {
    const path = 'components/poi-data/pois.json';
    const poiDocument = { pois: state.pois.map((poi) => makePoi(state, poi)) };
    contentFiles.set(path, encoder.encode(`${JSON.stringify(poiDocument, null, 2)}\n`));
    components.poiData = {
      id: `${packId}.poi-data`, name: `${state.name} 거점`,
      dataVersion: new Date().toISOString().slice(0, 10),
      coordinateSpace: 'game 16384x8192', source: path,
    };
  }
  if (state.includeHud) Object.assign(components, makeHudComponents(state));
  const files = {};
  for (const [path, bytes] of contentFiles) files[path] = `sha256:${await sha256Hex(bytes)}`;
  const source = { name: String(state.sourceName).trim() };
  if (String(state.sourceUrl).trim()) source.url = String(state.sourceUrl).trim();
  const manifest = {
    formatVersion: 1,
    packId,
    name: String(state.name).trim(),
    author: String(state.author).trim(),
    version: String(state.version).trim(),
    license: state.license,
    publisher: { id: String(state.namespace).trim(), name: String(state.author).trim() },
    source,
    compatibility: { minimumManagerVersion: state.includeHud ? '2.1.1' : '2.1.0', maximumManagerVersionExclusive: '3.0.0' },
    files,
    componentRequirements: {},
    components,
  };
  const result = new Map([['manifest.json', encoder.encode(`${JSON.stringify(manifest, null, 2)}\n`)]]);
  for (const entry of contentFiles) result.set(...entry);
  return { manifest, files: result };
}

async function sha256Hex(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

const CRC_TABLE = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
  return crc >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function concat(parts) {
  const size = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { output.set(part, offset); offset += part.length; }
  return output;
}

function header(size) {
  const bytes = new Uint8Array(size);
  return { bytes, view: new DataView(bytes.buffer) };
}

export function makeStoredZip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, data] of files) {
    const nameBytes = encoder.encode(name);
    const crc = crc32(data);
    const local = header(30);
    local.view.setUint32(0, 0x04034b50, true);
    local.view.setUint16(4, 20, true);
    local.view.setUint16(6, 0x0800, true);
    local.view.setUint16(8, 0, true);
    local.view.setUint32(14, crc, true);
    local.view.setUint32(18, data.length, true);
    local.view.setUint32(22, data.length, true);
    local.view.setUint16(26, nameBytes.length, true);
    locals.push(local.bytes, nameBytes, data);

    const central = header(46);
    central.view.setUint32(0, 0x02014b50, true);
    central.view.setUint16(4, 20, true);
    central.view.setUint16(6, 20, true);
    central.view.setUint16(8, 0x0800, true);
    central.view.setUint16(10, 0, true);
    central.view.setUint32(16, crc, true);
    central.view.setUint32(20, data.length, true);
    central.view.setUint32(24, data.length, true);
    central.view.setUint16(28, nameBytes.length, true);
    central.view.setUint32(42, offset, true);
    centrals.push(central.bytes, nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }
  const centralBytes = concat(centrals);
  const end = header(22);
  end.view.setUint32(0, 0x06054b50, true);
  end.view.setUint16(8, files.size, true);
  end.view.setUint16(10, files.size, true);
  end.view.setUint32(12, centralBytes.length, true);
  end.view.setUint32(16, offset, true);
  return concat([...locals, centralBytes, end.bytes]);
}

export async function buildDhoPack(state) {
  const built = await buildPackFiles(state);
  return { ...built, bytes: makeStoredZip(built.files), filename: `${packIdFor(state)}-${state.version}.dho-pack` };
}

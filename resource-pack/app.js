import { POI_TYPES, buildDhoPack, buildPackFiles, createDefaultPoi, createDefaultState, packIdFor, previewStyleVariables, validateState } from './builder-core.js?v=2.1.3';

const state = createDefaultState();
const form = document.querySelector('#pack-builder');
const poiList = document.querySelector('#poi-list');
const errors = document.querySelector('#builder-errors');
const preview = document.querySelector('#manifest-preview');
const packIdOutput = document.querySelector('#pack-id-preview');
const addPoiButton = document.querySelector('#add-poi');
const downloadButton = document.querySelector('#download-pack');
const status = document.querySelector('#builder-status');
const visualPreview = document.querySelector('#visual-preview');
preview.before(visualPreview);

function renderVisualPreview() {
  visualPreview.hidden = !state.includeHud;
  for (const [name, value] of Object.entries(previewStyleVariables(state))) {
    visualPreview.style.setProperty(name, value);
  }
}

function syncBaseState() {
  for (const field of ['namespace', 'slug', 'name', 'author', 'version', 'license', 'sourceName', 'sourceUrl']) {
    state[field] = form.elements[field].value;
  }
  state.includePoi = form.elements.includePoi.checked;
  state.includeHud = form.elements.includeHud.checked;
  for (const key of Object.keys(state.palette)) state.palette[key] = form.elements[key].value;
  for (const key of Object.keys(state.mapTheme)) {
    const control = form.elements[`map-${key}`];
    if (!control) continue;
    state.mapTheme[key] = typeof state.mapTheme[key] === 'number' ? Number(control.value) : control.value;
  }
  for (const [key, appearance] of Object.entries(state.lineTheme)) {
    for (const token of ['color', 'pattern', 'width', 'opacity']) {
      const control = form.elements[`line-${key}-${token}`];
      appearance[token] = ['width', 'opacity'].includes(token) ? Number(control.value) : control.value;
    }
  }
  for (const key of Object.keys(state.details)) {
    const control = form.elements[`detail-${key}`];
    state.details[key] = key === 'shadow' ? control.value : Number(control.value);
  }
  packIdOutput.textContent = packIdFor(state);
  document.querySelector('#poi-section').hidden = !state.includePoi;
  document.querySelector('#palette-section').hidden = !state.includeHud;
  renderVisualPreview();
}

function field(labelText, control) {
  const label = document.createElement('label');
  label.className = 'field';
  const title = document.createElement('span');
  title.textContent = labelText;
  label.append(title, control);
  return label;
}

function input(type, value, name, options = {}) {
  const control = document.createElement('input');
  control.type = type;
  control.value = value;
  control.name = name;
  Object.assign(control, options);
  return control;
}

function renderPois() {
  poiList.replaceChildren();
  state.pois.forEach((poi, index) => {
    const card = document.createElement('article');
    card.className = 'poi-card';
    const heading = document.createElement('div');
    heading.className = 'poi-heading';
    const title = document.createElement('strong');
    title.textContent = `거점 ${index + 1}`;
    const remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'button quiet'; remove.textContent = '삭제';
    remove.disabled = state.pois.length === 1;
    remove.addEventListener('click', () => { state.pois.splice(index, 1); renderPois(); refresh(); });
    heading.append(title, remove);

    const grid = document.createElement('div');
    grid.className = 'form-grid';
    const id = input('text', poi.idSuffix, `poi-id-${index}`, { placeholder: 'lisbon-view' });
    const name = input('text', poi.name, `poi-name-${index}`, { placeholder: '표시할 거점 이름' });
    const type = document.createElement('select');
    for (const [value, label] of POI_TYPES) {
      const option = document.createElement('option'); option.value = value; option.textContent = label;
      option.selected = value === poi.type; type.append(option);
    }
    const x = input('number', poi.x, `poi-x-${index}`, { min: 0, max: 16383, step: 1 });
    const y = input('number', poi.y, `poi-y-${index}`, { min: 0, max: 8191, step: 1 });
    const role = document.createElement('select');
    [['navigation', '항해 가능 좌표'], ['display', '표시 전용 좌표']].forEach(([value, label]) => {
      const option = document.createElement('option'); option.value = value; option.textContent = label;
      option.selected = value === poi.coordinateRole; role.append(option);
    });
    const aliases = input('text', poi.aliases, `poi-alias-${index}`, { placeholder: '별칭1, 별칭2' });
    const entrances = input('text', poi.entrancePoiIds, `poi-entrance-${index}`, { placeholder: '입구 거점 ID, 여러 개는 쉼표' });
    const controls = { idSuffix: id, name, type, x, y, coordinateRole: role, aliases, entrancePoiIds: entrances };
    for (const [key, control] of Object.entries(controls)) {
      control.addEventListener('input', () => { poi[key] = ['x', 'y'].includes(key) ? Number(control.value) : control.value; refresh(); });
    }
    grid.append(field('ID 뒷부분', id), field('거점 이름', name), field('유형', type), field('X 좌표', x), field('Y 좌표', y), field('좌표 역할', role), field('검색 별칭', aliases), field('입구 거점 ID', entrances));
    card.append(heading, grid);
    poiList.append(card);
  });
}

async function refresh() {
  syncBaseState();
  const issueList = validateState(state);
  errors.replaceChildren(...issueList.map((message) => {
    const item = document.createElement('li'); item.textContent = message; return item;
  }));
  errors.parentElement.hidden = issueList.length === 0;
  downloadButton.disabled = issueList.length > 0;
  try {
    const built = await buildPackFiles(state);
    preview.textContent = JSON.stringify(built.manifest, null, 2);
  } catch {
    preview.textContent = '입력을 완성하면 manifest.json 미리보기가 표시됩니다.';
  }
}

form.addEventListener('input', refresh);
addPoiButton.addEventListener('click', () => { state.pois.push(createDefaultPoi(state.pois.length + 1)); renderPois(); refresh(); });
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = '팩을 만드는 중입니다.';
  downloadButton.disabled = true;
  try {
    const result = await buildDhoPack(state);
    const url = URL.createObjectURL(new Blob([result.bytes], { type: 'application/zip' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.filename;
    document.body.append(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    status.textContent = `${result.filename} 다운로드를 시작했습니다. Manager의 팩 메뉴에서 검사 후 적용하세요.`;
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : '팩을 만들지 못했습니다.';
  } finally {
    downloadButton.disabled = validateState(state).length > 0;
  }
});

renderPois();
refresh();

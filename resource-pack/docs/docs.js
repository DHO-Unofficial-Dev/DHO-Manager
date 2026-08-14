const search = document.querySelector('[data-docs-search]');
const links = [...document.querySelectorAll('[data-doc-link]')];
search?.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase('ko');
  links.forEach((link) => {
    link.hidden = Boolean(query) && !link.textContent.toLocaleLowerCase('ko').includes(query);
  });
});

document.querySelector('[data-docs-menu]')?.addEventListener('click', () => {
  const sidebar = document.querySelector('.docs-sidebar');
  sidebar.dataset.open = sidebar.dataset.open === 'true' ? 'false' : 'true';
});

document.querySelectorAll('.docs-code').forEach((container) => {
  const code = container.querySelector('code');
  if (!code) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'docs-copy';
  button.textContent = '복사';
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(code.textContent);
    button.textContent = '복사됨';
    window.setTimeout(() => { button.textContent = '복사'; }, 1200);
  });
  container.append(button);
});

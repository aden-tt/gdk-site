async function initConfigEngine() {
  const config = await fetchConfig();
  if (!config) return;

  applyConfigLinks(config);
  applyConfigActions(config);
  applyConfigText(config);
  applyConfigSrc(config);
}

async function fetchConfig() {
  try {
    const response = await fetch('js/config.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load config.json: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Config engine error:', error);
    return null;
  }
}

function getConfigValue(config, key) {
  if (!config || !key) return undefined;
  return key.split('.').reduce((current, segment) => {
    return current && Object.prototype.hasOwnProperty.call(current, segment)
      ? current[segment]
      : undefined;
  }, config);
}

function resolveConfigKey(config, key) {
  if (!config || !key) return undefined;
  const directValue = getConfigValue(config, key);
  if (directValue !== undefined) return directValue;
  if (!key.includes('.')) {
    return getConfigValue(config, `links.${key}`);
  }
  return undefined;
}

function applyConfigLinks(config) {
  document.querySelectorAll('[data-config-link]').forEach(element => {
    const key = element.dataset.configLink;
    const value = resolveConfigKey(config, key);
    if (typeof value !== 'string') {
      console.warn(`Missing or invalid config link for key: ${key}`);
      return;
    }

    if (element.tagName.toLowerCase() === 'a') {
      element.setAttribute('href', value);
      return;
    }

    element.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      window.location.href = value;
    });
  });
}

function applyConfigActions(config) {
  document.querySelectorAll('[data-config-action]').forEach(element => {
    const key = element.dataset.configAction;
    const value = resolveConfigKey(config, key);
    if (typeof value === 'string') {
      element.setAttribute('action', value);
    } else {
      console.warn(`Missing or invalid config action for key: ${key}`);
    }
  });
}

function applyConfigText(config) {
  document.querySelectorAll('[data-config-text]').forEach(element => {
    const key = element.dataset.configText;
    const value = getConfigValue(config, key);
    if (value !== undefined && value !== null) {
      element.textContent = value;
    } else {
      console.warn(`Missing config text for key: ${key}`);
    }
  });
}

function applyConfigSrc(config) {
  document.querySelectorAll('[data-config-src]').forEach(element => {
    const key = element.dataset.configSrc;
    const value = getConfigValue(config, key);
    if (typeof value === 'string') {
      element.setAttribute('src', value);
    } else {
      console.warn(`Missing or invalid config src for key: ${key}`);
    }
  });
}

function applyConfigHeader(config) {
  const navItems = getConfigValue(config, 'header.nav');
  if (!Array.isArray(navItems)) return;

  const navContainer = document.querySelector('.nav-links-desktop');
  if (!navContainer) return;

  const navHtml = navItems.map(item => {
    const href = getConfigValue(config, item.link) || item.link || '#';
    const text = item.text || 'Link';
    return `<a href="${href}" class="nav-item">${text}</a>`;
  }).join('');

  navContainer.innerHTML = navHtml;
}

function applyConfigFooter(config) {
  const socialLinks = getConfigValue(config, 'footer.social');
  if (!Array.isArray(socialLinks)) return;

  const footerList = document.querySelector('.footer-right ul');
  if (!footerList) return;

  const socialHtml = socialLinks.map(item => {
    const href = getConfigValue(config, item.link) || item.link || '#';
    const text = item.text || 'Link';
    return `<li><a href="${href}">${text}</a></li>`;
  }).join('');

  footerList.innerHTML = socialHtml;
}

document.addEventListener('DOMContentLoaded', initConfigEngine);

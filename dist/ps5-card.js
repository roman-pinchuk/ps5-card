/* ps5-card v0.4.2 */
const CARD_TYPE = "ps5-card";
const DEFAULT_NAME = "PS5 Pro";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

const idleArtwork = () => `
  <svg class="ps5-vector-art" viewBox="0 0 360 220" role="img" aria-label="PlayStation symbols">
    <defs>
      <radialGradient id="ps5-glow" cx="50%" cy="48%" r="52%">
        <stop offset="0" stop-color="currentColor" stop-opacity=".28" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="180" cy="110" rx="150" ry="104" fill="url(#ps5-glow)" />
    <g class="ps5-logo" fill="currentColor">
      <path d="M153 39v101l20 7V65c0-9 4-13 10-11 8 3 11 10 11 19v39l20-8V67c0-22-8-35-25-41-19-7-36 3-36 13Z" />
      <path d="M153 150v20l44 17c16 6 29 3 29-8 0-8-6-14-17-18l-56-18Z" />
      <path d="M132 153 92 168c-11 4-16 10-16 17 0 10 12 13 27 7l55-22v-20l-26 3Z" />
    </g>
    <g class="ps5-symbols" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">
      <path d="m55 199 18-31 18 31H55Z" />
      <circle cx="139" cy="185" r="16" />
      <path d="m207 169 29 32m0-32-29 32" />
      <rect x="281" y="169" width="32" height="32" />
    </g>
  </svg>`;

const styles = `
:host { display:block; }
.card { position:relative; overflow:hidden; min-height:72px; padding:12px 14px; box-sizing:border-box; border:1px solid var(--ha-card-border-color,rgba(255,255,255,.12)); border-radius:16px; color:var(--primary-text-color,#eef4ff); background:var(--ha-card-background,var(--card-background-color,#1c1c1c)); cursor:pointer; box-shadow:var(--ha-card-box-shadow,none); }
.card:focus-visible, button:focus-visible { outline:2px solid #83b2ff; outline-offset:3px; }
.content { position:relative; z-index:1; display:flex; align-items:center; gap:15px; min-width:0; }
.icon { display:grid; place-items:center; width:48px; height:48px; flex:none; border-radius:50%; background:var(--secondary-background-color,rgba(255,255,255,.09)); }
.icon ha-icon { --mdc-icon-size:27px; color:var(--primary-text-color,#d9e6ff); }
.copy { min-width:0; flex:1; }
.eyebrow { display:none; }
.title { overflow:hidden; color:var(--primary-text-color,#f4f7ff); font-size:16px; font-weight:500; text-overflow:ellipsis; white-space:nowrap; }
.subtitle { overflow:hidden; margin-top:3px; color:var(--secondary-text-color,#acbbd5); font-size:14px; text-overflow:ellipsis; white-space:nowrap; }
.status { align-self:center; display:flex; align-items:center; gap:6px; padding:5px 7px; border:1px solid rgba(255,255,255,.13); border-radius:99px; background:rgba(255,255,255,.07); color:var(--secondary-text-color,#d5e1fa); font-size:10px; white-space:nowrap; }
.dot { width:6px; height:6px; border-radius:50%; background:#79e6b1; box-shadow:0 0 10px #79e6b188; }
.resting .dot { background:#b6b8ff; box-shadow:0 0 10px #b6b8ff55; }.offline .dot { background:#8d97aa; box-shadow:none; }
`;

const popupStyles = `
.ps5-backdrop { position:absolute; inset:-15%; width:130%; height:130%; background-position:center; background-size:cover; filter:blur(28px) saturate(1.3); opacity:.52; z-index:-3; }
.ps5-idle-glow { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 35%,#244fac,#131e3d 45%,#090e1c 100%); z-index:-3; }
.ps5-shade { position:absolute; inset:0; background:linear-gradient(180deg,rgba(7,12,25,.38),rgba(7,12,25,.06) 40%,rgba(7,12,25,.94) 100%); z-index:-2; }
.idle-art { position:relative; z-index:1; display:flex; align-items:center; flex-direction:column; gap:20px; width:min(300px,88%); color:#b5ceff; filter:drop-shadow(0 0 18px rgba(73,137,255,.45)); }
.idle-art .console-icon { --mdc-icon-size:116px; width:116px; height:116px; color:currentColor; }
.idle-art .ps5-symbols { width:100%; height:auto; color:currentColor; opacity:.8; }
.popup.light .ps5-idle-glow { background:radial-gradient(ellipse at 50% 35%,#dbeafe,#eef4ff 48%,#f7f9ff 100%); }
.popup.light .ps5-shade { background:linear-gradient(180deg,rgba(247,249,255,.08),rgba(247,249,255,.18) 40%,rgba(247,249,255,.9) 100%); }
.popup.light .idle-art { color:#315fae; filter:drop-shadow(0 0 18px rgba(49,95,174,.28)); }
.popup { --ps5-surface:var(--card-background-color,#0a1020); --ps5-text:var(--primary-text-color,#eef4ff); --ps5-muted:var(--secondary-text-color,#acbbd5); --ps5-border:var(--divider-color,rgba(255,255,255,.13)); position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:12px; background:rgba(4,8,18,.68); backdrop-filter:blur(8px); font-family:var(--paper-font-body1_-_font-family,var(--ha-font-family,Roboto,sans-serif)); }
.popup.light { --ps5-surface:#f7f9ff; --ps5-text:#172033; --ps5-muted:#5d6b82; --ps5-border:rgba(38,58,91,.18); background:rgba(39,48,66,.48); }
.panel { position:relative; overflow:hidden; isolation:isolate; width:min(540px,100%); max-height:92dvh; overflow-y:auto; border-radius:28px; color:var(--ps5-text); background:var(--ps5-surface); box-shadow:0 24px 90px rgba(0,0,0,.65),0 0 45px rgba(27,65,151,.16); }
.popup-header { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; padding:16px 18px 0; }
.popup-header strong { font-size:17px; }.close { border:0; padding:6px; border-radius:50%; color:var(--ps5-muted); background:transparent; cursor:pointer; font-size:25px; line-height:1; }.close:hover { background:var(--ps5-border); }
.hero { position:relative; padding:20px 24px 24px; }.topline { display:flex; justify-content:space-between; align-items:center; gap:10px; }.session { color:var(--ps5-muted); font-size:10px; letter-spacing:2.2px; font-weight:700; }.pill { display:inline-flex; align-items:center; gap:7px; padding:7px 10px; border:1px solid var(--ps5-border); border-radius:99px; background:var(--ps5-surface); font-size:11px; font-weight:600; white-space:nowrap; }.pill .dot { width:6px; height:6px; border-radius:50%; background:#f0b429; }.pill.playing .dot,.pill.online .dot { background:#35c98b; box-shadow:0 0 10px #35c98b88; }.pill.resting .dot { background:#f0b429; box-shadow:0 0 10px #f0b42988; }.pill.offline .dot { background:#e05252; box-shadow:0 0 10px #e0525288; }
.artwork { min-height:218px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:18px; }.cover { width:218px; height:218px; object-fit:contain; border-radius:14px; box-shadow:0 18px 42px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.18); }.console-icon { --mdc-icon-size:108px; color:#d9e6ff; filter:drop-shadow(0 0 24px #4384ff77); }
.eyebrow { margin-bottom:9px; color:var(--primary-color,#83b2ff); font-size:10px; font-weight:800; letter-spacing:2.5px; }.caption h2 { margin:0; overflow-wrap:anywhere; font-size:27px; line-height:1.18; letter-spacing:-.6px; }.player { display:flex; align-items:center; gap:8px; margin-top:13px; color:var(--ps5-muted); font-size:12px; line-height:1.5; }.player ha-icon { --mdc-icon-size:17px; color:var(--primary-color,#86a4d8); }
.actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:22px; }.action { min-height:82px; padding:14px 16px; border:1px solid var(--ps5-border); border-radius:16px; color:var(--ps5-text); background:color-mix(in srgb,var(--ps5-surface) 88%,var(--primary-color) 12%); text-align:left; cursor:pointer; font:inherit; }.action.primary { border-color:var(--primary-color,#82a9ff); color:#fff; background:linear-gradient(135deg,#159bd2,#0872bd); box-shadow:0 5px 16px rgba(21,61,159,.18); }.action:disabled { cursor:default; opacity:.5; }.action.primary:disabled { opacity:.72; }.action-icon { float:left; display:grid; place-items:center; width:28px; height:28px; margin:8px 12px 0 0; }.action-icon ha-icon { --mdc-icon-size:24px; width:24px; height:24px; }.action strong, .action small { display:block; }.action strong { padding-top:2px; font-size:16px; font-weight:700; line-height:1.25; }.action small { margin-top:5px; color:var(--ps5-muted); font-size:12px; line-height:1.25; }.action.primary small { color:#d8f1ff; }
@media (max-width:450px) { .panel { border-radius:24px; }.hero { padding:16px 20px 20px; }.artwork { min-height:190px; }.cover { width:190px; height:190px; }.caption h2 { font-size:23px; } }
`;

class Ps5Card extends HTMLElement {
  disconnectedCallback() {
    this.closePopup();
  }

  setConfig(config) {
    if (!config?.power_entity || !config?.activity_entity) {
      throw new Error("ps5-card requires power_entity and activity_entity");
    }
    this.config = { name: DEFAULT_NAME, ...config };
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `<style>:host { display:block; }</style><div class="card"></div>`;
      this.card = this.shadowRoot.querySelector(".card");
      this.card.addEventListener("ll-custom", (event) => {
        if (event.detail?.ps5_card?.action === "open") this.openPopup();
      });
    }
    this._loadInnerCard();
  }

  set hass(value) {
    this._hass = value;
    if (this.innerCard) this.innerCard.hass = value;
    if (this.popup) this.renderPopup();
  }
  get hass() { return this._hass; }

  async _loadInnerCard() {
    if (this.innerCard || this._loading) return;
    this._loading = true;
    try {
      const helpers = await window.loadCardHelpers();
      const innerConfig = {
        type: "custom:mushroom-template-card",
        primary: this.config.name,
        secondary: `{{ state_attr('${this.config.activity_entity}', 'title_name') or states('${this.config.power_entity}') }}`,
        icon: "mdi:sony-playstation",
        entity: this.config.power_entity,
        picture: `{{ state_attr('${this.config.activity_entity}', 'title_image') }}`,
        badge_icon: `{{ 'mdi:controller' if is_state('${this.config.activity_entity}', 'playing') else 'mdi:sleep' if is_state('${this.config.activity_entity}', 'idle') else none }}`,
        tap_action: { action: "fire-dom-event", ps5_card: { action: "open" } },
        icon_tap_action: { action: "toggle" },
        hold_action: { action: "toggle" },
      };
      this.innerCard = helpers.createCardElement(innerConfig);
      this.card.append(this.innerCard);
      this.innerCard.addEventListener("click", (event) => {
        const clickedIcon = event.composedPath().some((node) => node?.tagName === "HA-TILE-ICON");
        if (!clickedIcon) this.openPopup();
      });
      this.innerCard.hass = this._hass;
    } catch (error) {
      this.card.textContent = `Unable to load Mushroom card: ${error?.message || error}`;
    } finally {
      this._loading = false;
    }
  }

  openPopup() {
    if (this.popup) return;
    this.popup = document.createElement("div");
    this.popup.className = `popup${this._hass?.themes?.darkMode === false ? " light" : ""}`;
    this.popup.innerHTML = `<style>${popupStyles}</style><section class="panel" role="dialog" aria-modal="true" aria-label="${escapeHtml(this.config.name)}"><header class="popup-header"><strong>${escapeHtml(this.config.name)}</strong><button class="close" type="button" aria-label="Close">×</button></header><div class="hero"></div></section>`;
    document.body.append(this.popup);
    this.popup.querySelector(".close").addEventListener("click", () => this.closePopup());
    this.popup.addEventListener("click", (event) => { if (event.target === this.popup) this.closePopup(); });
    this._keyHandler = (event) => { if (event.key === "Escape") this.closePopup(); };
    document.addEventListener("keydown", this._keyHandler);
    this.renderPopup();
  }

  renderPopup() {
    if (!this.popup || !this._hass) return;
    this.popup.classList.toggle("light", this._hass.themes?.darkMode === false);
    const power = this._hass.states[this.config.power_entity];
    const activity = this._hass.states[this.config.activity_entity];
    const state = power?.state;
    const online = state === "on" || state === "off";
    const awake = state === "on";
    const playing = awake && activity?.state === "playing";
    const image = playing && typeof activity?.attributes?.title_image === "string" && activity.attributes.title_image.startsWith("https://") ? activity.attributes.title_image : "";
    const players = Array.isArray(activity?.attributes?.players) ? activity.attributes.players : [];
    const title = playing ? (activity.attributes.title_name || "Your game") : awake ? "Ready when you are." : online ? "See you next session." : "Waiting for your console.";
    const status = playing ? "Playing" : awake ? "Online" : online ? "Rest mode" : "Offline";
    const eyebrow = playing ? "NOW PLAYING" : awake ? "READY TO PLAY" : online ? "TAKING A BREAK" : "CONSOLE STATUS";
    const subtitle = players.length ? players.join(" · ") : awake ? "Your next adventure is one tap away." : online ? "Wake your PS5 with the power button below." : "Check that your PS5 is connected to the network.";
    const statusClass = playing ? "playing" : awake ? "online" : online ? "resting" : "offline";
    this.popup.querySelector(".hero").innerHTML = `<div class="${image ? "ps5-backdrop" : "ps5-idle-glow"}" ${image ? `style="background-image:url('${escapeHtml(image)}')"` : ""}></div><div class="ps5-shade"></div><div class="topline"><span class="session">PLAYSTATION / SESSION</span><span class="pill ${statusClass}"><span class="dot"></span>${status}</span></div><div class="artwork">${image ? `<img class="cover" src="${escapeHtml(image)}" alt="">` : idleArtwork()}</div><div class="caption"><div class="eyebrow">${eyebrow}</div><h2>${escapeHtml(title)}</h2>${players.length ? `<div class="player"><ha-icon icon="mdi:account-circle-outline"></ha-icon><span>${escapeHtml(players.join(" · "))}</span></div>` : `<div class="player"><ha-icon icon="mdi:controller"></ha-icon><span>${escapeHtml(subtitle)}</span></div>`}</div><div class="actions"><button class="action primary" data-service="turn_on" ${state !== "off" ? "disabled" : ""}><span class="action-icon"><ha-icon icon="mdi:power"></ha-icon></span><strong>Power on</strong><small>${state === "off" ? "Start your session" : state === "on" ? "Already awake" : "Unavailable"}</small></button><button class="action" data-service="turn_off" ${state !== "on" ? "disabled" : ""}><span class="action-icon"><ha-icon icon="mdi:power-sleep"></ha-icon></span><strong>Rest mode</strong><small>${state === "on" ? "Pause your session" : state === "off" ? "Already resting" : "Unavailable"}</small></button></div>`;
    this.popup.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () => this.callPower(button.dataset.service)));
  }

  async callPower(service) {
    if (!this._hass) return;
    try { await this._hass.callService("switch", service, { entity_id: this.config.power_entity }); }
    catch (error) { this._showError(error); }
  }

  _showError(error) {
    const message = document.createElement("p");
    message.textContent = `Could not control PS5: ${error?.message || "Home Assistant returned an error"}`;
    message.style.cssText = "margin:12px 0 0;color:#ff9b9b;font-size:12px";
    this.popup?.querySelector(".hero")?.append(message);
  }

  closePopup() { this.popup?.remove(); this.popup = undefined; document.removeEventListener("keydown", this._keyHandler); }
  getCardSize() { return 2; }
  getGridOptions() { return { rows: 1, columns: 6, min_rows: 1, min_columns: 3 }; }

  static getConfigElement() { return document.createElement("ps5-card-editor"); }
  static getStubConfig() { return { name: DEFAULT_NAME, power_entity: "switch.ps5_132_power", activity_entity: "sensor.ps5_132_activity" }; }
}

class Ps5CardEditor extends HTMLElement {
  setConfig(config) {
    this.config = { ...Ps5Card.getStubConfig(), ...config };
    this.innerHTML = `<label style="display:block;margin:8px 0">Name<br><input data-key="name" value="${escapeHtml(this.config.name)}" style="width:100%;box-sizing:border-box"></label><label style="display:block;margin:8px 0">Power entity<br><input data-key="power_entity" value="${escapeHtml(this.config.power_entity)}" style="width:100%;box-sizing:border-box"></label><label style="display:block;margin:8px 0">Activity entity<br><input data-key="activity_entity" value="${escapeHtml(this.config.activity_entity)}" style="width:100%;box-sizing:border-box"></label>`;
    this.querySelectorAll("input").forEach((input) => input.addEventListener("input", () => {
      this.config[input.dataset.key] = input.value;
      this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this.config } }));
    }));
  }
}

customElements.define("ps5-card-editor", Ps5CardEditor);

customElements.define(CARD_TYPE, Ps5Card);
window.customCards = window.customCards || [];
window.customCards.push({ type: CARD_TYPE, name: "PS5 Card", description: "A PlayStation 5 status card with a built-in popup.", preview: true });

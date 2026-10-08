/* ps5-card v0.1.2 */
const CARD_TYPE = "ps5-card";
const DEFAULT_NAME = "PS5 Pro";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

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
.popup { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:12px; background:rgba(4,8,18,.68); backdrop-filter:blur(8px); }
.panel { position:relative; overflow:hidden; isolation:isolate; width:min(540px,100%); max-height:92dvh; overflow-y:auto; border-radius:28px; color:#eef4ff; background:#0a1020; box-shadow:0 24px 90px rgba(0,0,0,.65),0 0 45px rgba(27,65,151,.16); }
.popup-header { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; padding:16px 18px 0; }
.popup-header strong { font-size:17px; }.close { border:0; padding:6px; border-radius:50%; color:#a7b9df; background:transparent; cursor:pointer; font-size:25px; line-height:1; }.close:hover { background:rgba(255,255,255,.08); }
.hero { position:relative; padding:20px 24px 24px; }.topline { display:flex; justify-content:space-between; align-items:center; gap:10px; }.session { color:#c2d0ef; font-size:10px; letter-spacing:2.2px; font-weight:700; }.pill { display:inline-flex; align-items:center; gap:7px; padding:7px 10px; border:1px solid rgba(255,255,255,.13); border-radius:99px; background:rgba(255,255,255,.07); font-size:11px; font-weight:600; white-space:nowrap; }.pill .dot { width:6px; height:6px; }
.artwork { min-height:218px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:18px; }.cover { width:218px; height:218px; object-fit:contain; border-radius:14px; box-shadow:0 18px 42px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.18); }.console-icon { --mdc-icon-size:108px; color:#d9e6ff; filter:drop-shadow(0 0 24px #4384ff77); }.symbols { color:#8dacec; font-size:23px; letter-spacing:16px; margin-left:16px; }
.eyebrow { margin-bottom:9px; color:#83b2ff; font-size:10px; font-weight:800; letter-spacing:2.5px; }.caption h2 { margin:0; overflow-wrap:anywhere; font-size:27px; line-height:1.18; letter-spacing:-.6px; }.player { display:flex; align-items:center; gap:8px; margin-top:13px; color:#acbbd5; font-size:12px; line-height:1.5; }.player ha-icon { --mdc-icon-size:17px; color:#86a4d8; }
.actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:22px; }.action { min-height:74px; padding:14px; border:1px solid rgba(157,180,226,.14); border-radius:16px; color:#eff5ff; background:rgba(122,153,221,.08); text-align:left; cursor:pointer; }.action.primary { border-color:rgba(130,169,255,.22); background:linear-gradient(135deg,#285ee7,#1844bb); box-shadow:0 5px 16px rgba(21,61,159,.18); }.action:disabled { cursor:default; opacity:.5; }.action-icon { float:left; margin:10px 10px 0 0; font-size:24px; }.action strong, .action small { display:block; }.action strong { padding-top:3px; font-size:13px; }.action small { margin-top:4px; color:#b4c9fa; font-size:10px; }.action:not(.primary) small { color:#8f9fbd; }
@media (max-width:450px) { .panel { border-radius:24px; }.hero { padding:16px 20px 20px; }.artwork { min-height:190px; }.cover { width:190px; height:190px; }.caption h2 { font-size:23px; } }
`;

class Ps5Card extends HTMLElement {
  connectedCallback() {
    window.__ps5Cards = window.__ps5Cards || new Set();
    window.__ps5Cards.add(this);
  }

  disconnectedCallback() {
    window.__ps5Cards?.delete(this);
    this.closePopup();
  }

  setConfig(config) {
    if (!config?.power_entity || !config?.activity_entity) {
      throw new Error("ps5-card requires power_entity and activity_entity");
    }
    this.config = { name: DEFAULT_NAME, ...config };
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `<style>${styles}</style><div class="card" role="button" tabindex="0"></div>`;
      this.card = this.shadowRoot.querySelector(".card");
      this.card.addEventListener("click", () => this.openPopup());
      this.card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); this.openPopup(); }
      });
    }
  }

  set hass(value) { this._hass = value; this.render(); if (this.popup) this.renderPopup(); }
  get hass() { return this._hass; }

  render() {
    if (!this.card || !this._hass) return;
    const power = this._hass.states[this.config.power_entity];
    const activity = this._hass.states[this.config.activity_entity];
    const state = power?.state;
    const available = state === "on" || state === "off";
    const playing = state === "on" && activity?.state === "playing";
    const title = playing ? (activity.attributes.title_name || "Your game") : this.config.name;
    const status = playing ? "Playing" : state === "on" ? "Online" : available ? "Rest mode" : "Offline";
    this.card.className = `card ${available ? state === "on" ? "awake" : "resting" : "offline"}`;
    this.card.innerHTML = `<div class="content"><div class="icon"><ha-icon icon="mdi:sony-playstation"></ha-icon></div><div class="copy"><div class="eyebrow">PLAYSTATION / SESSION</div><div class="title">${escapeHtml(title)}</div><div class="subtitle">${escapeHtml(playing ? (activity.attributes.players || []).join(" · ") || "Now playing" : this.config.name)}</div></div><div class="status"><span class="dot"></span>${status}</div></div>`;
  }

  openPopup() {
    if (this.popup) return;
    this.popup = document.createElement("div");
    this.popup.className = "popup";
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
    const power = this._hass.states[this.config.power_entity];
    const activity = this._hass.states[this.config.activity_entity];
    const state = power?.state;
    const online = state === "on" || state === "off";
    const awake = state === "on";
    const playing = awake && activity?.state === "playing";
    const image = playing && typeof activity.attributes.title_image === "string" && activity.attributes.title_image.startsWith("https://") ? activity.attributes.title_image : "";
    const players = playing && Array.isArray(activity.attributes.players) ? activity.attributes.players : [];
    const title = playing ? (activity.attributes.title_name || "Your game") : awake ? "Ready when you are." : online ? "See you next session." : "Waiting for your console.";
    const status = playing ? "Playing" : awake ? "Online" : online ? "Rest mode" : "Offline";
    const eyebrow = playing ? "NOW PLAYING" : awake ? "READY TO PLAY" : online ? "TAKING A BREAK" : "CONSOLE STATUS";
    const subtitle = players.length ? players.join(" · ") : awake ? "Your next adventure is one tap away." : online ? "Wake your PS5 with the power button below." : "Check that your PS5 is connected to the network.";
    this.popup.querySelector(".hero").innerHTML = `<div class="${image ? "ps5-backdrop" : "ps5-idle-glow"}" ${image ? `style="background-image:url('${escapeHtml(image)}')"` : ""}></div><div class="ps5-shade"></div><div class="topline"><span class="session">PLAYSTATION / SESSION</span><span class="pill"><span class="dot"></span>${status}</span></div><div class="artwork">${image ? `<img class="cover" src="${escapeHtml(image)}" alt="">` : `<ha-icon class="console-icon" icon="mdi:sony-playstation"></ha-icon><div class="symbols">△ ○ × □</div>`}</div><div class="caption"><div class="eyebrow">${eyebrow}</div><h2>${escapeHtml(title)}</h2><div class="player"><ha-icon icon="mdi:${players.length ? "account-circle-outline" : "controller"}"></ha-icon><span>${escapeHtml(subtitle)}</span></div></div><div class="actions"><button class="action primary" data-service="turn_on" ${state !== "off" ? "disabled" : ""}><span class="action-icon">⏻</span><strong>Power on</strong><small>${state === "off" ? "Start your session" : state === "on" ? "Already awake" : "Unavailable"}</small></button><button class="action" data-service="turn_off" ${state !== "on" ? "disabled" : ""}><span class="action-icon">◐</span><strong>Rest mode</strong><small>${state === "on" ? "Pause your session" : state === "off" ? "Already resting" : "Unavailable"}</small></button></div>`;
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
window.addEventListener("ll-custom", (event) => {
  const detail = event.detail || {};
  const action = detail.action || detail;
  const request = action.ps5_card;
  if (request?.action !== "open") return;
  const entity = request.power_entity;
  [...(window.__ps5Cards || [])].find((card) => !entity || card.config.power_entity === entity)?.openPopup();
});
window.customCards = window.customCards || [];
window.customCards.push({ type: CARD_TYPE, name: "PS5 Card", description: "A PlayStation 5 status card with a built-in popup.", preview: true });

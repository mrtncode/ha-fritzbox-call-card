export class FritzboxVoicemail {
  constructor(card) {
    this.card = card;
    this.audio = null;
    this.currentlyPlayingIndex = null;
    this.root = null; 
  }

  get entity() {
    return (this.card.config?.voicemail_entity && this.card._hass) ? this.card._hass.states[this.card.config.voicemail_entity] || null : null;
  }

  get messages() {
    return this.entity?.attributes?.messages || [];
  }

  async deleteMessage(index) {
    if (!confirm("Are you sure you want to delete this voicemail?")) return;
    try {
      this.stopCurrentAudio();
      await this.card._hass.callService("fritzbox_voicemail", "delete_voicemail_message", { delete_mode: "specific", message_index: Number(index) });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteAll() {
    if (!confirm("Are you sure you want to delete ALL voicemails?")) return;
    try {
      this.stopCurrentAudio();
      await this.card._hass.callService("fritzbox_voicemail", "delete_voicemail_message", { delete_mode: "all" });
    } catch (err) {
      console.error(err);
    }
  }

  render(baseFontSize = 13) {
    const base = Number.isFinite(baseFontSize) ? baseFontSize : 13;
    const scaledText = (multiplier, min = 9) => `${Math.max(min, Math.round(base * multiplier))}px`;

    if (!this.messages.length) return `<div style="padding:4px 0; font-size:${scaledText(1)}; color:var(--secondary-text-color);">No messages</div>`;
    return `
      <div class="fbc-voicemail-container" style="display:flex; flex-direction:column; gap:4px; margin-bottom:4px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--divider-color, #eee); padding-bottom:4px;">
          <span style="font-size:${scaledText(0.92)}; font-weight:bold; color:var(--secondary-text-color);">Voicemails</span>
          <button class="fbc-voicemail-delete-all" style="border:none; background:none; cursor:pointer; color:var(--error-color, #e53935); display:flex; align-items:center; padding:2px; font-size:${scaledText(0.85)}; font-weight:500;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>Clear All
          </button>
        </div>
        <ul style="list-style:none; padding:0; margin:0; max-height:180px; overflow-y:auto;">
          ${this.messages.map((msg) => {
            const isCur = String(msg.Index) === String(this.currentlyPlayingIndex);
            return `
              <li style="padding:6px 0; border-bottom:1px solid var(--divider-color, #eee); display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; align-items:center; justify-content:space-between; width:100%; min-width:0;">
                  <div style="min-width:0; flex-grow:1;">
                    <strong style="font-size:${scaledText(0.92)}; color:var(--primary-text-color); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${msg.Name || msg.Number || "Unknown"}</strong>
                    <small style="font-size:${scaledText(0.77)}; color:var(--secondary-text-color); display:block;">${msg.Date || ""}</small>
                  </div>
                  <button class="fbc-voicemail-delete" data-index="${msg.Index}" style="border:none; background:none; cursor:pointer; color:var(--secondary-text-color); padding:4px; display:flex; align-items:center;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
                ${msg.Index !== undefined ? `
                  <div class="fbc-audio-player-row" data-index="${msg.Index}" style="display:flex; align-items:center; gap:8px; width:100%;">
                    <button class="fbc-voicemail-toggle" data-index="${msg.Index}" style="border:none; background:var(--primary-color, #1e88e5); color:#fff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; padding:0; flex-shrink:0;">
                      ${isCur && !this.audio?.paused ? 
                        `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="4" height="16"/><rect x="16" y="4" width="4" height="16"/></svg>` : 
                        `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="margin-left:1px;"><polygon points="5 3 19 12 5 21"/></svg>`
                      }
                    </button>
                    <div style="flex-grow:1; display:flex; flex-direction:column;">
                      <input type="range" class="fbc-audio-slider" data-index="${msg.Index}" min="0" max="100" value="0" step="0.1" ${!isCur ? "disabled" : ""} style="width:100%; accent-color:var(--primary-color); cursor:pointer; margin:0; height:14px;">
                      <div style="display:flex; justify-content:space-between; font-size:${scaledText(0.69)}; color:var(--secondary-text-color); font-family:monospace; line-height:1;">
                        <span class="fbc-audio-current-time" data-index="${msg.Index}">0:00</span>
                        <span class="fbc-audio-duration" data-index="${msg.Index}" data-initial=""></span>
                      </div>
                    </div>
                  </div>
                ` : ""}
              </li>
            `;
          }).join("")}
        </ul>
      </div>
    `;
  }

  attachEvents(root) {
    this.root = root;
    root.querySelectorAll(".fbc-voicemail-delete").forEach(b => b.onclick = () => this.deleteMessage(b.dataset.index));
    const delAll = root.querySelector(".fbc-voicemail-delete-all");
    if (delAll) delAll.onclick = () => this.deleteAll();
    root.querySelectorAll(".fbc-voicemail-toggle").forEach(b => b.onclick = () => this.handlePlayPause(b.dataset.index));
    root.querySelectorAll(".fbc-audio-slider").forEach(s => s.oninput = (e) => this.handleSeek(e, s.dataset.index));
  }

  stopCurrentAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.ontimeupdate = this.audio.onloadedmetadata = this.audio.onended = null;
      this.audio = null;
    }
  }

  async handlePlayPause(index) {
    if (String(this.currentlyPlayingIndex) === String(index) && this.audio) {
      if (this.audio.paused) {
        await this.audio.play();
        this.updateButtonUI(index, "playing");
      } else {
        this.audio.pause();
        this.updateButtonUI(index, "paused");
      }
      return;
    }

    if (this.currentlyPlayingIndex !== null) {
      this.resetTrackVisuals(this.currentlyPlayingIndex);
    }
    this.stopCurrentAudio();

    this.currentlyPlayingIndex = index;
    this.updateButtonUI(index, "loading"); 

    try {
      const mediaSourceId = `media-source://fritzbox_voicemail/${index}`;
      const resolvedMedia = await this.card._hass.callWS({
        type: "media_source/resolve_media",
        media_content_id: mediaSourceId,
      });

      if (!resolvedMedia?.url) throw new Error("No playback URL resolved");

      const audioUrl = window.location.origin + resolvedMedia.url;
      this.audio = new Audio(audioUrl);
      this.audio.type = resolvedMedia.mime_type || "audio/wav";

      this.audio.onloadedmetadata = () => {
        const durationSpan = this.root.querySelector(`.fbc-audio-duration[data-index="${index}"]`);
        if (durationSpan) durationSpan.textContent = this.formatTime(this.audio.duration);
      };

      this.audio.ontimeupdate = () => {
        if (!this.audio) return;
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        
        const slider = this.root.querySelector(`.fbc-audio-slider[data-index="${index}"]`);
        const currentSpan = this.root.querySelector(`.fbc-audio-current-time[data-index="${index}"]`);
        
        if (slider) slider.value = progress || 0;
        if (currentSpan) currentSpan.textContent = this.formatTime(this.audio.currentTime);
      };

      this.audio.onended = () => {
        this.resetTrackVisuals(index);
        this.stopCurrentAudio();
        this.currentlyPlayingIndex = null;
      };

      const activeSlider = this.root.querySelector(`.fbc-audio-slider[data-index="${index}"]`);
      if (activeSlider) activeSlider.disabled = false;

      await this.audio.play();
      this.updateButtonUI(index, "playing");

    } catch (err) {
      console.error("Audio engine failed:", err);
      this.resetTrackVisuals(index);
      this.currentlyPlayingIndex = null;
    }
  }

  handleSeek(event, index) {
    if (String(this.currentlyPlayingIndex) === String(index) && this.audio && this.audio.duration) {
      const seekPercentage = parseFloat(event.target.value);
      this.audio.currentTime = (seekPercentage / 100) * this.audio.duration;
    }
  }

  updateButtonUI(index, state) {
      const btn = this.root.querySelector(`.fbc-voicemail-toggle[data-index="${index}"]`);
      if (!btn) return;

      if (state === "playing") {
        btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="4" height="16"/><rect x="16" y="4" width="4" height="16"/></svg>`;
      } else if (state === "loading") {
        // Inline-Styles direkt auf dem SVG erzwingen die Rotation im Center des Icons
        btn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" 
            style="animation: fbc-spin 1s linear infinite; transform-origin: center;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-linecap="round"></path>
            <style>
              @keyframes fbc-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </svg>`;
      } else {
        // Default / paused state
        btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="margin-left:1px;"><polygon points="5 3 19 12 5 21"/></svg>`;
      }
    }
    
  resetTrackVisuals(index) {
    this.updateButtonUI(index, "paused");
    const slider = this.root.querySelector(`.fbc-audio-slider[data-index="${index}"]`);
    const currentSpan = this.root.querySelector(`.fbc-audio-current-time[data-index="${index}"]`);
    const durationSpan = this.root.querySelector(`.fbc-audio-duration[data-index="${index}"]`);
    
    if (slider) {
      slider.value = 0;
      slider.disabled = true;
    }
    if (currentSpan) currentSpan.textContent = "0:00";
    
    if (durationSpan) {
      durationSpan.textContent = durationSpan.dataset.initial || "0:00";
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
}
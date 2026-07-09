export class FritzboxVoicemail {
  constructor(card) {
    this.card = card;
    this.audio = null;
    this.currentlyPlayingIndex = null;
    this.root = null; 
  }

  get entity() {
    const entityId = this.card.config?.voicemail_entity;

    if (!entityId || !this.card._hass) {
      return null;
    }

    return this.card._hass.states[entityId] || null;
  }

  get messages() {
    return this.entity?.attributes?.messages || [];
  }

  async deleteMessage(index) {
    try {
      this.stopCurrentAudio();
      await this.card._hass.callService(
        "fritzbox_voicemail",
        "delete_voicemail_message",
        {
          delete_mode: "specific",
          message_index: Number(index),
        },
      );
    } catch (err) {
      console.error("Failed to delete voicemail message", err);
    }
  }

  async deleteAll() {
    try {
      this.stopCurrentAudio();
      await this.card._hass.callService(
        "fritzbox_voicemail",
        "delete_voicemail_message",
        {
          delete_mode: "all",
        },
      );
    } catch (err) {
      console.error("Failed to delete all voicemail messages", err);
    }
  }

  render() {
    if (!this.messages.length) {
      return `
        <div style="padding:8px 0; color: var(--secondary-text-color);">
          No messages
        </div>
      `;
    }

    return `
      <div class="fbc-voicemail-container">
        <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
          <button class="fbc-voicemail-delete-all" style="border:none; background:none; cursor:pointer; color: var(--primary-text-color);">
            🗑 All
          </button>
        </div>

        <ul style="list-style:none; padding:0; margin:0;">
          ${this.messages
            .map((msg) => {
              const isCurrent = String(msg.Index) === String(this.currentlyPlayingIndex);
              
              const initialDuration = ""

              return `
            <li style="padding:12px 0; border-bottom:1px solid var(--divider-color); display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <div>
                  <strong style="color: var(--primary-text-color);">
                    ${msg.Name || msg.Number || "Unknown"}
                  </strong>
                  <br>
                  <small style="color: var(--secondary-text-color);">
                    ${msg.Date || ""}
                  </small>
                </div>

                <button class="fbc-voicemail-delete" data-index="${msg.Index}" style="border:none; background:none; cursor:pointer; color: var(--error-color); font-size: 1.1em;">
                  🗑
                </button>
              </div>

              ${msg.Index !== undefined ? `
                <div class="fbc-audio-player-row" data-index="${msg.Index}" style="display:flex; align-items:center; gap:10px; width:100%; margin-top:4px;">
                  <button class="fbc-voicemail-toggle" data-index="${msg.Index}" style="border:none; background: var(--primary-color); color: var(--text-primary-color, #fff); border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:0.9em; box-shadow: var(--ha-card-box-shadow, none);">
                    ${isCurrent && !this.audio?.paused ? "⏸" : "▶️"}
                  </button>
                  
                  <div style="flex-grow:1; display:flex; flex-direction:column; gap:2px;">
                    <input type="range" class="fbc-audio-slider" data-index="${msg.Index}" min="0" max="100" value="0" step="0.1" ${!isCurrent ? "disabled" : ""} style="width:100%; accent-color: var(--primary-color); cursor: pointer; margin:0;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75em; color: var(--secondary-text-color); font-family: monospace;">
                      <span class="fbc-audio-current-time" data-index="${msg.Index}">0:00</span>
                      <!-- Displaying pre-loaded message attribute directly before playback starts -->
                      <span class="fbc-audio-duration" data-index="${msg.Index}" data-initial="${initialDuration}">${initialDuration}</span>
                    </div>
                  </div>
                </div>
              ` : ""}
            </li>
          `;
            })
            .join("")}
        </ul>
      </div>
    `;
  }

  attachEvents(root) {
    this.root = root;

    root.querySelectorAll(".fbc-voicemail-delete").forEach((button) => {
      button.onclick = () => this.deleteMessage(button.dataset.index);
    });

    const deleteAll = root.querySelector(".fbc-voicemail-delete-all");
    if (deleteAll) {
      deleteAll.onclick = () => this.deleteAll();
    }

    root.querySelectorAll(".fbc-voicemail-toggle").forEach((button) => {
      button.onclick = () => this.handlePlayPause(button.dataset.index);
    });

    root.querySelectorAll(".fbc-audio-slider").forEach((slider) => {
      slider.oninput = (e) => this.handleSeek(e, slider.dataset.index);
    });
  }

  stopCurrentAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.ontimeupdate = null;
      this.audio.onloadedmetadata = null;
      this.audio.onended = null;
      this.audio = null;
    }
  }

  async handlePlayPause(index) {
    if (String(this.currentlyPlayingIndex) === String(index) && this.audio) {
      if (this.audio.paused) {
        await this.audio.play();
        this.updateButtonUI(index, "⏸");
      } else {
        this.audio.pause();
        this.updateButtonUI(index, "▶️");
      }
      return;
    }

    if (this.currentlyPlayingIndex !== null) {
      this.resetTrackVisuals(this.currentlyPlayingIndex);
    }
    this.stopCurrentAudio();

    this.currentlyPlayingIndex = index;
    this.updateButtonUI(index, "⏳"); 

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
      this.updateButtonUI(index, "⏸");

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

  updateButtonUI(index, symbol) {
    const btn = this.root.querySelector(`.fbc-voicemail-toggle[data-index="${index}"]`);
    if (btn) btn.textContent = symbol;
  }

  resetTrackVisuals(index) {
    this.updateButtonUI(index, "▶️");
    const slider = this.root.querySelector(`.fbc-audio-slider[data-index="${index}"]`);
    const currentSpan = this.root.querySelector(`.fbc-audio-current-time[data-index="${index}"]`);
    const durationSpan = this.root.querySelector(`.fbc-audio-duration[data-index="${index}"]`);
    
    if (slider) {
      slider.value = 0;
      slider.disabled = true;
    }
    if (currentSpan) currentSpan.textContent = "0:00";
    
    // Revert duration string to its initial attribute value saved on data tag
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

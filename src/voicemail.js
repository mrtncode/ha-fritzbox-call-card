export class FritzboxVoicemail {
  constructor(card) {
    this.card = card;
    this.audio = null; // Holds the current HTMLAudioElement instance
    this.currentlyPlayingIndex = null; // Track what is playing for UI states
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
        <div style="padding:8px 0;">
          No messages
        </div>
      `;
    }

    return `
      <div>
        <div style="
          display:flex;
          justify-content:flex-end;
          margin-bottom:8px;
        ">
          <button
            class="fbc-voicemail-delete-all"
            style="
              border:none;
              background:none;
              cursor:pointer;
            ">
            🗑 All
          </button>
        </div>

        <ul style="list-style:none;padding:0;margin:0;">
          ${this.messages
            .map(
              (msg) => `
            <li style="
              padding:10px 0;
              border-bottom:1px solid #eee;
              display:flex;
              align-items:center;
              justify-content:space-between;
            ">
              <div>
                <strong>
                  ${msg.Name || msg.Number || "Unknown"}
                </strong>

                <br>

                <small>
                  ${msg.Date || ""}
                  ${msg.Duration ? ` · ${msg.Duration}` : ""}
                </small>

                ${
                  msg.Index !== undefined
                    ? `
                    <div>
                      <button
                        class="fbc-voicemail-play"
                        data-index="${msg.Index}"
                        style="
                          border:none;
                          background:none;
                          cursor:pointer;
                        ">
                        ▶️ Play
                      </button>
                    </div>
                    `
                    : ""
                }
              </div>

              <button
                class="fbc-voicemail-delete"
                data-index="${msg.Index}"
                style="
                  border:none;
                  background:none;
                  cursor:pointer;
                ">
                🗑
              </button>
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  attachEvents(root) {
    root.querySelectorAll(".fbc-voicemail-delete")
      .forEach((button) => {
        button.onclick = () => {
          this.deleteMessage(button.dataset.index);
        };
      });

    const deleteAll = root.querySelector(
      ".fbc-voicemail-delete-all",
    );

    if (deleteAll) {
      deleteAll.onclick = () => this.deleteAll();
    }

    root.querySelectorAll(".fbc-voicemail-play")
      .forEach((button) => {
        button.onclick = () => {
          this.play(button.dataset.index);
        };
      });
  }

  /**
   * Resolves the media source via HA WebSocket and plays it using Browser Audio API
   */
  async play(mediaContentId) {
    console.log("Playing voicemail index:", mediaContentId);

    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    try {
      const mediaSourceId = `media-source://fritzbox_voicemail/${mediaContentId}`;

      const resolvedMedia = await this.card._hass.callWS({
        type: "media_source/resolve_media",
        media_content_id: mediaSourceId,
      });

      if (!resolvedMedia || !resolvedMedia.url) {
        throw new Error("Could not resolve media URL from backend.");
      }

      const audioUrl = window.location.origin + resolvedMedia.url;
      console.log("Resolved streaming path:", audioUrl);

      this.audio = new Audio(audioUrl);
      this.audio.type = resolvedMedia.mime_type || "audio/wav";
      

      await this.audio.play();
      this.currentlyPlayingIndex = mediaContentId;

      this.audio.onended = () => {
        this.currentlyPlayingIndex = null;
        console.log("Audio playback finished.");
      };

    } catch (err) {
      console.error("Failed to play voicemail audio:", err);
      this.currentlyPlayingIndex = null;
    }
  }
}

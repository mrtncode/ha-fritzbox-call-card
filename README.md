
[![HACS validation](https://img.shields.io/github/actions/workflow/status/mrtncode/ha-fritzbox-call-card/validate.yml?label=HACS%20Validation)](https://github.com/mrtncode/ha-fritzbox-call-card/actions?query=workflow%3Avalidate)
![Downloads](https://img.shields.io/github/downloads/mrtncode/ha-fritzbox-call-card/total?label=Downloads&color=blue) 
[![GitHub release](https://img.shields.io/github/release/mrtncode/ha-fritzbox-call-card?include_prereleases=&sort=semver&color=blue)](https://github.com/mrtncode/ha-fritzbox-call-card/releases/)
![stars](https://img.shields.io/github/stars/mrtncode/ha-fritzbox-call-card)

---


# Fritz!Box Calls history Card
Custom dashboard card for the Home Assistant [Fritz!Box Callmonitor integration](<https://www.home-assistant.io/integrations/fritzbox_callmonitor/)>)

The card shows automatically the call history from the Fritz!Box Callmonitor. No automations or similar needed. The card fetches the data directly from the HA history.
Translations available for English and German. Other translations may follow :)

## Features
- ### Automatically fetch the calls history
- ### Support for different call types: missing call, outgoing call and incoming call
- ### Nice visualization :)
---


## Installation

### HACS (Recommended)

- Add this repository to HACS. To do so, use the following link.

 [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mrtncode&repository=ha-fritzbox-call-card&category=plugin)



<details>
  <summary> <b>Manual Installation via Hacs</b></summary>  

1.  Open HACS in Home Assistant  and click the three dots in the top right corner.
2.  Select "Custom repositories".
3.  Add the URL from the GitHub repository and select "Dashboard" as the category.
4.  Click "add".
5.  The "Fritzbox Call Card" should now be available in HACS. Click "install".
6.  The resource will be added to your dashboard configuration automatically.
</details>

<details>
  <summary> <b>Manual Installation in HA</b></summary>  

### Manual Installation

1.  Download the `dist/fritzbox-call-card.js` file from the repo.
2.  Place the `fritzbox-call-card.js` in `config/www/fritzbox-call-card/`.
3.  Add the resource to your Lovelace configuration through the Home Assistant UI:
    a. Go to "Settings" -> "Dashboards".
    b. Click on the three dots in the top right corner and select "Resources".
    c. Click on "+ ADD RESOURCE".
    d. Enter `/local/fritzbox-call-card/fritzbox-call-card.js` as the URL and select "JavaScript Module" as the Resource type.
    e. Click "CREATE".
4.  Restart Home Assistant.
</details>


---
# Development

## Dev-Server 
- npm run build -- --watch (automatically rebuilding)
- npm run preview to serve the built file
HA -> Add dashboard ressource -> http://localhost:4173/fritzbox-call-card.js

## Production build
npm run build
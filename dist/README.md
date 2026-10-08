# PS5 Card for Home Assistant

A standalone Lovelace card for PS5 MQTT. It uses the installed Mushroom card for the compact dashboard tile and provides its own responsive PlayStation-themed popup. Browser Mod and Button Card are not required.

## Installation

1. In HACS, open **Custom repositories**.
2. Add this repository URL as type **Dashboard**.
3. Install **PS5 Card**.
4. Add the resource automatically supplied by HACS, or add `/hacsfiles/ps5-card/ps5-card.js` as a JavaScript module resource.

## Configuration

```yaml
type: custom:ps5-card
name: PS5 Pro
power_entity: switch.ps5_132_power
activity_entity: sensor.ps5_132_activity
```

The activity sensor is expected to be supplied by PS5 MQTT and may expose `title_name`, `title_image`, and `players` attributes.

Mushroom must be installed through HACS because the card intentionally uses its standard tile styling.

## Development

```bash
npm run check
npm run build
```

The HACS artifact is `dist/ps5-card.js`.

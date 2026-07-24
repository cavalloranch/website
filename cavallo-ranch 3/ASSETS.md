# Cavallo Ranch — Asset Manifest

Every image path referenced by the site, and where to put the file.
Drop exports into these exact paths and the site works with no code changes.

## Logo — `assets/logo/`

| Filename | Source in Dropbox |
|---|---|
| `cavallo-logo-sand.png` | `6 - Longley Stables/Marketing/Logo/CavalloRanch_Logos/Desert Sand/Desert Sand Logo.png` |
| `cavallo-logo-white.png` | `6 - Longley Stables/Marketing/Logo/CavalloRanch_Logos/White/CavalloRanch_Logo_RGB_White-01.png` |

Header uses Desert Sand; footer uses White (on the charcoal band).
Export at ~2x the display height — header renders at 42px, so ~90px tall PNG with transparency.

Optional: also add `favicon.png` (512×512, square crop of the mark) at the site root.

## Video — `assets/video/`

| Filename | Notes |
|---|---|
| `hero-loop.mp4` | From `Cavallo Multimedia/Website Video`. H.264, 1920×1080, **no audio track**, 10–20s seamless loop. Target under 8 MB — compress hard; it's a background loop, not a feature film. |

Also export a still frame from the loop as `assets/images/hero-poster.jpg` — it displays while the video loads and on devices that block autoplay.

Consider adding a WebM version (`hero-loop.webm`) for smaller file size; add a second `<source>` line in `index.html` above the mp4 if you do.

## Images — `assets/images/`

All JPG, sRGB. Export at roughly 2x display size, then compress to ~200–400 KB each.

### Home (`/`)
| Filename | Content | Suggested size |
|---|---|---|
| `hero-poster.jpg` | Still from hero video | 1920×1080 |
| `og-cavallo-ranch.jpg` | Social share image | 1200×630 |
| `home-01.jpg` | Villa exterior at dusk (wide) | 1600×1067 |
| `home-02.jpg` | Infinity pool over lake (square) | 1000×1000 |
| `home-03.jpg` | Covered patio / outdoor lounge (square) | 1000×1000 |
| `home-04.jpg` | Interior living space (square) | 1000×1000 |
| `home-05.jpg` | Polo field with mountains (square) | 1000×1000 |
| `feature-experience.jpg` | Guests doing activities | 1400×1050 |
| `feature-stay.jpg` | Bedroom suite | 1400×1050 |
| `feature-valley.jpg` | Golf course / valley landscape | 1400×1050 |
| `concierge.jpg` | Private chef plating | 1400×1050 |

### Experience (`/experience`)
| Filename | Content |
|---|---|
| `experience-hero.jpg` | Wide shot of grounds in use |
| `exp-equestrian.jpg` | Polo field / horses |
| `exp-sports.jpg` | Tennis, bocce, or volleyball |
| `exp-pool.jpg` | Infinity pool |
| `exp-dining.jpg` | Outdoor kitchen and bar |
| `exp-hang.jpg` | Covered patio lounge |
| `exp-concierge.jpg` | Chef or concierge service |

### Stay (`/stay`)
| Filename | Content |
|---|---|
| `stay-hero.jpg` | Best bedroom shot, wide |
| `room-01.jpg` … `room-08.jpg` | One per bedroom, **portrait 3:4** |
| `tour-01.jpg` | Great room (wide) |
| `tour-02.jpg` … `tour-05.jpg` | Kitchen, patio, pool deck, grounds (square) |

Room names in `stay/index.html` are placeholders ("Suite One" … "Suite Eight") — rename to your actual suite names and correct the bed configurations.

### Events (`/events`)
| Filename | Content |
|---|---|
| `events-hero.jpg` | Event setup on the grounds |
| `event-01.jpg`, `event-02.jpg` | Ceremony, reception (3:2 landscape) |
| `event-03.jpg` … `event-05.jpg` | Cocktail hour, details, evening (square) |
| `events-concierge.jpg` | Chef / catering |

### Local Attractions (`/local-attractions`)
| Filename | Content |
|---|---|
| `attractions-hero.jpg` | Valley or desert landscape |

**Best source folder for most of these:** `6 - Longley Stables/Images/Cavallo FINAL selects (85)`

## Placeholder check

Before launch, confirm you've replaced or verified:
- [ ] All eight room names and bed configs on `/stay`
- [ ] Drive times on `/local-attractions` (I estimated these — verify each)
- [ ] `info@cavalloranch.com` — the live site obfuscates the address, so confirm it's correct
- [ ] Contact form wired to a real handler (currently client-side only)
- [ ] `/terms-and-conditions/` page exists (linked from the contact form consent text)

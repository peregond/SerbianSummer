# Постельные CG · сториборды под inpaint

Генератор Cursor режет откровенные кадры (см. `artwork/romance-wardrobe/AUDIT.md`, `artwork/nikola-early-night/INPAINT.md`). Для 14 партнёров (кроме Николы) в `public/assets/{person}-night-{beat}-v1.webp` лежат **сториборды**: силуэт, лампа, чёрная плашка зоны inpaint.

Никола продолжает использовать готовый набор `nikola-*-v1` из ранней ночи у реки.

## Биты (как у Николы)

| beat | Назначение |
|---|---|
| `seductive` | Взгляд в белье |
| `door` | У двери |
| `briefs` | На кровати в белье |
| `touch` | Касание |
| `ready` | Готовность (джоки / бельё в сторону) |
| `sex` | Секс |
| `climax` | Крупный план |
| `cum-inside` / `cum-cloth` / `cum-chest` | Финиш |
| `afterglow` | После |

Персонажи: `milica`, `dragan`, `jelena`, `asya`, `luka`, `ana`, `stefan`, `marko`, `vuk`, `lazar`, `teodora`, `ivana`, `strahinya`, `milos`.

## Как дорисовать

1. Открой WebP-заглушку в img2img / inpaint (ComfyUI: `tools/comfy_one.py` / локальный туннель).
2. Замаскируй **только чёрный прямоугольник**.
3. Промпт: `artwork/adult-evenings/PROMPTS.json` → `inpaint_template` + описание персонажа и бита.
4. Сохрани тем же именем в `public/assets/`, затем `node scripts/generate-art-catalog.mjs`.

Тексты сцен: `public/adult-cast.js`, `public/adult-evenings.js`. Перегенерация заглушек: `python3 tools/art/make-adult-storyboards.py`.

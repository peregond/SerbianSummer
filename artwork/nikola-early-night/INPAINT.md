# Никола · ранняя ночь — заглушки под inpaint

Генератор Cursor режет откровенные кадры. Поэтому часть ассетов — **сториборд с чёрными плашками**: поза, свет, лицо и композиция уже есть; закрытые зоны нужно дорисовать в другом ИИ (inpaint / img2img).

## Готовые (белые трусы / шорты, без джинсов)

| Файл | Статус |
|---|---|
| `belgrade-park-evening-v1.webp` | Фон парка — готов |
| `nikola-apartment-night-v1.webp` | Фон квартиры — готов |
| `nikola-park-shy-wanting-v1.webp` | Смущённый / хочет — белые трусы |
| `nikola-park-nervous-laugh-v1.webp` | Нервный смех — белые трусы |
| `nikola-bedroom-seductive-v1.webp` | Соблазнительный взгляд — белые трусы |
| `nikola-door-kiss-v1.webp` | У двери — белые трусы |
| `nikola-briefs-lookdown-v1.webp` | На кровати, взгляд вниз — белые трусы |
| `nikola-bed-moan-v1.webp` | Стон на кровати — белые трусы |
| `nikola-climax-face-v1.webp` | Крупный план оргазма |
| `nikola-afterglow-smile-v1.webp` | После, улыбка — белые трусы |

## Заглушки с чёрными плашками (дорисовать)

| Файл | Что должно быть под плашкой | Референс лица |
|---|---|---|
| `nikola-briefs-bulge-v1.webp` | Белые CK briefs, рельеф стояка | `nikola-dream-bare-buzz-v3.webp` |
| `nikola-briefs-touch-v1.webp` | Ладонь на натянутых briefs | то же |
| `nikola-jock-ready-v1.webp` | Белые CK jockstraps, открытый зад | то же |
| `nikola-jock-fuck-v1.webp` | Проникновение, джоки сдвинуты (часть уже сценa с силуэтом) | то же |
| `nikola-cum-inside-v1.webp` | Финиш внутрь, сперма из него | то же |
| `nikola-cum-jock-v1.webp` | Финиш на белые джоки / пояс | то же |
| `nikola-cum-chest-v1.webp` | Финиш на грудь (частично цензура) | то же |
| `nikola-afterglow-v1.webp` | После, нижняя часть тела | то же |

## Как дорисовать

1. Открой WebP/JPG заглушки в img2img или inpaint.
2. Замаскируй **только чёрные прямоугольники**.
3. Промпт-заготовка (EN): см. `PROMPTS.json`.
4. Сохрани результат тем же именем в `public/assets/`, затем `node scripts/generate-art-catalog.mjs`.

Текст сцен уже в `public/nikola-early-night.js` и не зависит от готовности арта.

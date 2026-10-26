# Расширение фонов и эмоций

Четыре новых вертикальных фона: `police-station-break`, `belgrade-park-bench`, `belgrade-kiosk-street`, `belgrade-kitchen-evening`. Это художественные локации Белграда, без привязки к конкретному реальному отделению или адресу. Сопоставление с 11 сценами находится в `public/art-expansion.js`: встречи у забора отделения, отдых в сквере, дела у остановки и вечерние разговоры на кухне. Меняются только поля фона; ID сцен, порядок реплик, переходы и эффекты сохранены.

В мастерскую добавлены 20 обычных реакций `public/assets/workshop/*-{shy,surprised}-draft.webp`: смущение и удивление у Милицы, Драгана, Йелены, Аси, Луки, Лазара, Теодоры, Иваны, Страхини и Милоша. У Николы эти эмоции уже есть. Лица и повседневная одежда взяты из актуальных портретов; каждая эмоция имеет свой жест. Новые портреты пока доступны как эскизы, без изменения эмоциональных назначений реплик.

Создано встроенным image_gen; полные промпты и референсы — `artwork/expanded-art/PROMPTS.json`. PNG-мастеры сохраняются вне checkout в `/workspace/character-art/expanded-art/`, WebP сохраняют прозрачность портретов. Новые фоны сопровождаются русскими и английскими описаниями.

# Летние фантазийные образы для мастерской

Добавлены 9 вариантов `public/assets/workshop/*-dream-summer-flirty-draft.webp`: Никола, Драган, Лука, Лазар и Милош с обнажённым торсом; Милица, Йелена, Ася и Ивана в непрозрачных коротких топах. Лица, взрослый возраст и особенности внешности сохранены по существующим портретам, позы различаются. Изображения созданы встроенным image_gen и показаны в мастерской как эскизы с меткой «Фантазия». В игровые сцены они не подключены.

Набор дополнен летними портретами Теодоры и Страхини (`*-dream-summer-friendly-draft.webp`): Теодора в свободном льняном топе и шортах со шляпой, Страхиня в спортивной безрукавке и пляжных шортах с полотенцем. Теперь летний вариант есть у всех 11 персонажей. Ранее отклонённые варианты заменены обычными летними образами. Их промпты — `artwork/summer-completion/PROMPTS.json`; промпты первых девяти изображений — `artwork/summer-variants/PROMPTS.json`. PNG-мастеры находятся вне checkout в `/workspace/character-art/summer-variants/`; WebP сохраняют прозрачность.

# Эскизы новых персонажей для мастерской

Дополнен набор: по три эмоциональных портрета (thoughtful, laughing, flirty) для Лазара, Теодоры, Иваны, Страхини и Милоша. Эмоции отличаются жестами, положением рук и поворотом корпуса, при сохранении лица и одежды по исходному портрету. Для Милоша также подготовлен отдельный casual-friendly и новый masked-friendly-v2: чёрная балаклава с тремя отдельными отверстиями и художественный образ сербской riot-полиции в защитной экипировке. Всего добавлено 17 WebP с прозрачностью. Парный лист Милоша сохранён как прежняя версия, новые служебный и повседневный образы показаны отдельно.

Все изображения созданы встроенным image_gen; точные промпты и исходные референсы перечислены в `artwork/character-emotions/PROMPTS.json`. Выбранные PNG-мастеры сохранены вне checkout в `/workspace/character-art/emotions/`, оригинальные результаты генерации не удалены. В игре эти изображения пока не подключены: они доступны как эскизы в мастерской.

`public/assets/workshop/{lazar,teodora,ivana,strahinja}-draft.webp` и `milos-two-looks-draft.webp` — новые изображения, созданные встроенным image_gen для Лазара, Теодоры, Иваны, Страхини и Милоша. PNG-оригиналы сохранены в облачной среде вне checkout (`/workspace/character-art/`); в репозиторий включены WebP с сохранённой прозрачностью. Милош изображён в двух обликах на одном листе: в форме и балаклаве, а также без формы. Внешность предложена по ролям в сценарии; это эскизы, пока не подключённые к репликам.

Художественное направление: полуреалистичная рисованная романтическая новелла, мягкий летний свет, взрослые пропорции, разные лица и причёски современных жителей Сербии. Подготовлены приветливые базовые выражения; дальнейшие эмоции требуют отдельных изображений с сохранением внешности.

# Музыка знакомства 0.8

`public/assets/encounter-theme.m4a`: оригинальная синтезированная тема 85,29 секунды, 70 BPM, мягкие клавиши, переборы и фоновые аккорды. Без чужих записей и цитирования мелодий. Генератор и WAV-мастер: `../artwork/music/compose_encounter.py`, `serbian-summer-encounter.wav`. AAC 128 кбит/с, loudnorm I=-19/TP=-2/LRA=8. Сцены кофе и пекарни переключаются на неё с плавным переходом 650 мс через Web Audio; без Web Audio используется обычная смена трека.

# Типографика 0.7.1

Основной текст и интерфейс: Onest variable 100–900. Заголовки: Lora variable 400–700, включая настоящее курсивное начертание. Полные локальные TTF из Google Fonts, без внешнего запроса во время игры. Лицензии SIL OFL включены в `public/assets/fonts/onest-LICENSE.txt` и `lora-LICENSE.txt`.

Источники: [Onest](https://github.com/google/fonts/tree/main/ofl/onest), [Lora](https://github.com/google/fonts/tree/main/ofl/lora). Предыдущие файлы шрифтов оставлены для совместимости старого кэша, текущая CSS их не использует.

# Новые иллюстрации 0.7

Встроенным ImageGen созданы четыре фона крупных планов: столик кафе, витрина пекарни, окно комнаты и дверь во двор. Игровые WebP — `public/assets/`; мастеры и точные промпты — `../artwork/mobile-v7/PROMPTS.md`.

Добавлены 12 прозрачных реакций: задумчивость, смех и флирт для Милицы, Николы после смены, Драгана и Йелены. Мастеры и промпты — `../artwork/reactions-v7/CONTACT-PROMPTS.md` и `HOST-PROMPTS.md`. В игре эмоции подбираются по реплике и чередуются при одинаковом настроении; это набор реакций, а не отдельная иллюстрация на каждую строку.

# Иллюстрации и художественное направление

## Глава 1 и карта — 0.6

Встроенный ImageGen: дорога через Белград, двор, временная комната, вечерняя набережная, три вымышленных районных интерьера, Никола после смены, Драган и Йелена. Игровые файлы — `public/assets/{belgrade-drive,belgrade-courtyard,first-room,riverside-evening,dorcol-apartment,vracar-apartment,new-belgrade-apartment,nikola-evening,dragan,jelena}.webp`. PNG-мастеры и точные промпты — `../artwork/chapter-one/PROMPTS.md` и `../artwork/hosts/PROMPTS.md`. Фоны нативно 941×1672, затем масштабированы до 1080×1920 без искажения; архитектура художественная.

Карта — кодовый SVG/HTML, схема взаимного расположения районов и рек, не навигационная карта. Географическая основа: муниципальные материалы Нового Белграда о слиянии Савы и Дуная; сюжетные квартиры и персонажи не описывают реальную аренду.

## Реакции Николы, версия 0.5

Добавлены `public/assets/nikola-shy.webp`, `nikola-laughing.webp`, `nikola-flirty.webp`: три реакции в рабочей форме на комплимент, шутку и флирт. Сгенерированы встроенным ImageGen из того же исходного персонажа; настоящая прозрачность сохранена. PNG-мастеры и точные промпты: `../artwork/nikola/work-reactions/PROMPTS.md`. Незначительные различия нарисованных деталей между эмоциями возможны.

## Музыка и иконки, версия 0.3

`public/assets/prologue-theme.m4a` — новая оригинальная инструментальная композиция, синтезированная локально: 78 BPM, 32 такта, перебор струнных, мягкие клавиши, фоновые аккорды и бас. Нет сторонних записей, сэмплов или намеренных цитат мелодий. Исходный генератор и WAV-мастер сохранены в `../artwork/music/`. Длительность 102,5 секунды, AAC 128 кбит/с; в игре включается повтор. Обработка ffmpeg: loudnorm I=-19, TP=-2, LRA=8.

Иконки `icon.svg`, `icon-192.png`, `icon-512.png` нарисованы кодом: монограмма «СЛ», солнце, коралловый и бирюзовый цвета интерфейса.

## Обновление 0.2: пользовательские фоны и эмоции

Текущая версия использует девять кадров аэропорта пользователя вместо первоначальных общих фонов. Все восемь целых изображений прошли аккуратную перерисовку встроенным ImageGen; такси создано заново, поскольку полученный PNG был обрезан и не декодировался. Прежние `airport.webp` и `cafe.webp` оставлены как архивные ресурсы, постановка главы их больше не использует.

Игровые файлы: `airport-apron.webp`, `arrivals-corridor.webp`, `escalator.webp`, `sunlit-passage.webp`, `terminal-counters.webp`, `baggage-claim.webp`, `arrivals-hall.webp`, `airport-cafe.webp`, `taxi-pickup.webp` в `public/assets/`. Для Николы добавлены `nikola-friendly.webp`, `nikola-thoughtful.webp`, `nikola-surprised.webp` и три `nikola-dream-*.webp`. Альфа-канал спрайтов сохранён, наружные прозрачные поля убраны для одинакового кадрирования.

Обычные эмоции взяты из предоставленной пользователем подборки. По уточнению пользователя три варианта отредактированы встроенным ImageGen без поло и фартука; они показаны исключительно как краткая необязательная фантазия героя или героини и обозначены в игре подписью «Воображение». Возврат к реальному Николе восстанавливает рабочую форму.

Исходники, мастеры и точные промпты находятся вне веб-пакета: `../artwork/airport/PROMPTS.md` и `../artwork/nikola/PROMPT.md`. Мастеры 2160×3840 получены масштабированием перерисованных изображений; нативный результат ImageGen — 941×1672.

Ниже сохранён первоначальный артбриф версии 0.1.

Изображения созданы встроенным инструментом ImageGen. Финальные игровые файлы сохранены в `public/assets/`; исходные генерации сохранены инструментом отдельно и не удалялись. В игре используется WebP с сохранением прозрачности спрайтов. Генерация — встроенный инструмент, не API/CLI.

## Финальные файлы

- `public/assets/airport.webp` — живописный зал аэропорта в тёплом летнем свете.
- `public/assets/cafe.webp` — столик у большого окна аэропорта.
- `public/assets/milica.webp` — Милица, взрослый персонаж с кофе и блокнотом, прозрачный фон.
- `public/assets/bakery.webp` — художественная интерпретация пекарни у терминала.
- `public/assets/nikola.webp` — Никола в чёрной форме с фирменной надписью, прозрачный фон. Ранняя версия в обычной рубашке в игру не включена.

## Промпты для финального направления

Общий стиль: original semi-realistic hand-painted visual novel illustration with subtle anime influence, natural adult proportions and believable architecture, delicate drawn contours, textured painterly shading, warm Balkan summer window light, no game UI, no watermark.

**Аэропорт:** portrait 2:3 background of Belgrade airport arrivals, glass facade, warm late-afternoon sky, coffee machine to the side, metal benches, believable perspective and open center for an overlaid character. No foreground people, no lettering or logos.

**Кафе:** portrait 2:3 airport cafe by a huge window, empty small table with two chairs, water and coffee, distant airplanes, quiet golden summer light, painted visual-novel background, open middle area for a character. No foreground people or UI.

**Милица:** one original Serbian woman age 27, natural warm brown eyes, dark chestnut hair, small earrings, ivory linen shirt over a burgundy top, faded blue jeans, canvas tote and sketchbook, coffee cup, relaxed slight smile. Adult semi-realistic anime visual-novel illustration, head through upper thighs, genuine transparent alpha background.

**Пекарня:** portrait 2:3 view toward a bakery counter at an airport public area, glass pastry display, golden crescent rolls and croissants, paper bags, warm wood, cream tiles, brass details and terminal glass. Clearly painted, softly textured, subtle anime influence, believable architecture. No foreground people, text, logo or interface.

**Никола, финальная редакция:** keep the same handsome adult 29-year-old man, very tall athletic muscular build, warm light and semi-realistic painted style. Mature individual face, strong nose, dark brows, brown eyes, neat dark haircut and short stubble. Replace casual clothes and objects with a fitted black short-sleeve work polo, charcoal bib apron and black work cap, cream lettering “ХЛЕБ” and “& КИФЛЕ”, small “NIKOLA” badge. No open chest, watch, bag or phone. Hold a bakery paper bag with a crescent roll. Head to upper thighs fully inside frame, natural hands, genuine transparent background. The earlier Nikola image was used as the edit target; Milica established the rendering style.

## Промпт для пользовательских фотографий аэропорта

Перерисуй приложенную фотографию в фон для визуальной новеллы «Сербское лето». Полуреалистичная цифровая иллюстрация с мягким влиянием аниме, естественная перспектива, деликатные контуры и тонкая фактура кисти. Сохрани реальную планировку, архитектуру, основные объекты и точку съёмки. Летний Белград, естественные тёплые света и приглушённые голубые тени, исходное время суток. Вертикальная композиция 9:16 для iPhone, без растягивания архитектуры; при необходимости аккуратно дорисуй края. Оставь место для персонажа по центру и не помещай важные детали в нижнюю четверть под диалогом. Без игрового интерфейса, новых надписей, крупных людей на переднем плане и водяных знаков. Избегай мультяшного упрощения, кислотных цветов, чрезмерного свечения, фотографии и 3D-рендера.

Если приложено второе изображение: первое — источник композиции и архитектуры; второе — единый эталон рисовки, палитры и фактуры. Не переносить планировку и предметы из эталона.


## 0.13.1: лицо Луки по референсу

Четыре прозрачных спрайта `luka-reference-{friendly,thoughtful,laughing,flirty}-v3.webp` созданы встроенным image_gen по предоставленному пользователем портрету и прежнему игровому спрайту. Фотография задаёт внешность лица, прежний спрайт — позу, одежду и стиль рисовки. Мастеры, источники и точные промпты находятся в `../artwork/luka-reference-0.13.1/`; исходный портрет в публичную сборку не включён. Старые варианты Луки сохранены. Регистрация: `public/luka-redesign.js`.

## 0.13.0: главы 5–6 и спортивный Лука

Встроенный image_gen: шесть фонов (`document-desk`, `registry-lobby`, `belgrade-morning-cafe`, `courtyard-cinema`, `courtyard-after-film`, `belgrade-night-walk`) и четыре прозрачные реакции Луки `luka-sport-{friendly,thoughtful,laughing,flirty}-v2`. Выбранные PNG-мастеры, полная цепочка промптов и список источников сохранены в `../artwork/chapters-5-6-0.13.0/`. Игровые WebP получены перекодированием, альфа сохранена. Старые изображения Луки не удалены. Иллюстрации локаций художественные; документы не содержат персональных данных. Регистрация новых реакций — `public/luka-redesign.js`.

## 0.12.0: новые знакомства и образ Николы

Все новые иллюстрации созданы встроенным image_gen. Исходники и наборы промптов: ../artwork/chapter-four-0.12.0/ и ../artwork/nikola-buzz-0.12.0/ относительно папки game. Игровые копии WebP в public/assets; альфа персонажей сохранена. Иконки подготовлены из нового квадратного портрета Николы в размерах 32/180/192/512px.

При редизайне старые исходники не перезаписывались. Текущие 15 файлов Николы назначаются registerNikolaRedesign; фон заставки ensemble-poster-buzz-v3. Разметка четырёх голов постера сохранена в art-framing.js.

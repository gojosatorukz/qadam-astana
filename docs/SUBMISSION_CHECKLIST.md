# Сдача Qadam — Smart City VNext

Команда **Qadam**, один участник. Регистрация отправлена. Рабочий дедлайн Smart City, подтверждённый участником: **20 октября 2026, 23:59 Asia/Almaty (UTC+5)**. Состояние формы и актуальный канал сверяются перед отправкой. Перенос Google-трека сам по себе не подтверждает перенос других секций.

[Официальная страница и формы](https://gdg.community.dev/events/details/google-gdg-astana-presents-build-with-ai-hackathon-2026/) · [Файл кейсов](https://drive.google.com/file/d/1d3w6aU0r9fpHGLAyI4-pqVRWaJSFHPWw/view)

Это операторский чек-лист. Отмеченное выполнение относится к описанной проверке; подготовленный draft не считается отправленной заявкой. Кодовый freeze VNext — `d0b5b1462ffd48111bcf354be8baf98e85681bae`. Последующий doc-only commit архива и фактические SHA256 фиксируются в финальном manifest; неизвестный GitHub SHA заранее не указывается.

## Единый комплект

- [x] Публичные [GitHub](https://github.com/gojosatorukz/qadam-astana) и [сайт](https://qadam-astana-walk.pubg-bekzat.chatgpt.site) созданы; VNext опубликован на том же URL.
- [x] Подготовлена полностью новая [90-секундная запись VNext](https://youtu.be/u8qfP-Jfxq8) и ручные RU-субтитры, 23 фрагмента.
- [ ] Владелец завершил сохранение YouTube Unlisted; новый ролик и captions открываются без сессии автора.
- [ ] Последующий doc-only source commit зафиксирован официальным helper без изменений frozen application code.
- [ ] `qadam-source.zip` и `source-manifest.json` соответствуют этому commit; extracted source и SHA256 проверены.
- [ ] PDF-презентация до 10 MB, PPTX, speaker notes и сценарий показывают тот же реализованный VNext.
- [ ] MP4/SRT, preview, информация о подаче и общий bundle согласованы с новой YouTube-ссылкой и manifest.
- [ ] Все финальные публичные файлы загружены на GitHub; проверены содержимое/хеши, ссылки и доступ без авторской сессии.
- [x] Документированы [сценарии](TEST_SCENARIOS.md), [архитектура](DECISIONS.md), [исторический benchmark](EVALUATION.md), [новый QA](VNEXT_RELEASE.md), [ответы жюри](JURY_QA.md).
- [ ] Рабочий сайт, репозиторий либо архив кода и разрешённые дополнительные материалы приложены в draft-форме. Если используются дополнительные файлы, сверены текущие ограничения формы на число/размер.

## Подтверждённые проверки приложения

- [x] Снимок OSM и provenance сохранены; неизвестные поля не заполнены догадками. Редакционный слой: 10 canonical / 11 OSM IDs / 19 sourced facts.
- [x] Чистый standalone `npm ci` из официального registry: 688 пакетов за 45 с, Node 24.12.0 / npm 11.6.2, исходники и lockfile не изменены; TypeScript PASS; **259/259 тестов**.
- [x] Standalone facts importer `--check` PASS без соседнего research и ранее установленных node_modules.
- [x] Анонимный опубликованный HTTP smoke **5/5**: schema 890, manual 85/55, invalid calendar 400, outside-coverage и football clarification; эти control paths не запускают AI.
- [x] Отдельный направленный production browser QA: Gemini main 85/55, альтернативный 55, время 45 → 45/31, Mega confirmation 57/77, refinement без abandoned football, no-data partial и manual empty с действиями.
- [x] Pin/search, favorites clear, custom 12:15, mobile 390 без overflow, выбор/карта, fit/abort и RU/EN/KK проверены в целевых сценариях.
- [x] Внешнее ограничение записано: один Mega tile load failed, последующая кафе-карта загрузилась; надёжность OSM-тайлов/полевых переходов не обещается.
- [x] Исторические **30/30 oracle integration** остаются проверкой инвариантов, не 30 Gemini-вызовами и не AI accuracy.
- [x] Frozen intent-прогон сохранён: **26/30 exact**, baseline 7/30; **27 API + 3 manual**, две 429 включены; development 9 / first-seen 21 и ошибки остаются в исходных evidence.
- [ ] Финальные PDF, видео и source прочитаны как комплект; нет непроведённых общих accuracy/latency claims. Матрица 34 сценариев аудита не выдана за 34 успешных live-проверки; отсутствие пользовательского исследования не скрыто.

## Перед окончательным действием

- [ ] Выбрана Smart City. Одновременное участие в двух секциях не считается подтверждённым.
- [ ] Qadam и актуальные ссылки совпадают в форме, README, PDF, видео и manifest.
- [ ] Сайт работает без localhost, public links и external playback проверены отдельно.
- [ ] В финальном архиве нет ключей, `.env.local`, runtime, node_modules, личных контактов/истории или приватных research screenshots. `.env.example` — только пустой публичный шаблон.
- [ ] Публичные evidence содержат искусственные запросы и публичные preset/OSM данные; точная частная геолокация не раскрыта.
- [ ] Есть © OpenStreetMap contributors / ODbL, ограничения источников, внешний dependency caveat и privacy: favorites хранят только выбранные публичные POI IDs.
- [ ] После проверки draft пользователь **отдельно прямо разрешил финальную отправку**.
- [ ] Только после этого форма отправлена и сохранено подтверждение с окончательными ссылками.

Финал заявлен на 22 октября; точное время сверяется у организаторов. Публичный сайт сохраняет канонический URL; GitHub Pages не запускает серверные API. [Развёртывание](DEPLOYMENT.md). Подготовка и загрузка нового пакета сами по себе не разрешают отправлять заявку.

# Сдача Qadam — Smart City v4

Команда **Qadam**, один участник. Регистрация отправлена. Рабочий дедлайн Smart City, подтверждённый участником: **20 октября 2026, 23:59 Asia/Almaty (UTC+5)**. Состояние формы и актуальный канал сверяются перед отправкой. Перенос Google-трека сам по себе не подтверждает перенос других секций.

[Официальная страница и формы](https://gdg.community.dev/events/details/google-gdg-astana-presents-build-with-ai-hackathon-2026/) · [Файл кейсов](https://drive.google.com/file/d/1d3w6aU0r9fpHGLAyI4-pqVRWaJSFHPWw/view)

## Материалы

- [x] Публичные [GitHub](https://github.com/gojosatorukz/qadam-astana) и [демо](https://qadam-astana-walk.pubg-bekzat.chatgpt.site) созданы.
- [ ] GitHub/source.zip обновлены именно до финального v4 с текущими тестами и docs.
- [ ] PDF-презентация до 10 MB соответствует v4.
- [ ] Дополнительные демофайлы, если нужны: до 5 файлов, каждый до 100 MB.
- [x] [YouTube по ссылке](https://youtu.be/SeL_Ts7Z1YU) — новая 90-секундная запись v4 с ручными русскими субтитрами.
- [ ] Видео обновлено под финальный intent/closed-generation UI; открывается без сессии автора.
- [x] Документированные [сценарии](TEST_SCENARIOS.md), [архитектура/питч](DECISIONS.md), [проверка](EVALUATION.md), [ответы жюри](JURY_QA.md).
- [ ] Рабочее интерактивное демо и репозиторий либо архив кода приложены в форме.

## Проверки

- [x] Автосбор, сохранённые данные и provenance; неизвестные поля не заполнены догадками.
- [x] Чистый npm ci из официального registry: 688 пакетов за 34 с, lockfile без изменений; tsc pass; **167/167 тестов**.
- [x] No-key HTTP 8/8: ручные кнопки работают; текст RU/KK/EN требует уточнения; 20 минут могут дать empty; timezone-less now даёт 400.
- [x] **30/30 oracle integration** инвариантов. Это не 30 вызовов Gemini и не AI accuracy.
- [x] Замороженный реальный intent-прогон: **26/30 exact**, baseline 7/30; **27 API + 3 manual**, две 429 включены. Ограничения development 9/first-seen 21 и все ошибки опубликованы в evidence.
- [ ] Финальный опубликованный v4: health/POST, intent.mode, generationMode, источники и trace проверены отдельно.
- [ ] Desktop/mobile, три языка, даты, dialog/focus, тайлы, строгие фильтры и empty/partial/clarification просмотрены в финальном UI.
- [ ] PDF, видео и source соответствуют последнему коду; нет непроведённых общих accuracy/latency claims.

## Перед отправкой

- [ ] Выбрана Smart City. Одновременное участие в двух секциях не считается подтверждённым.
- [ ] Qadam совпадает в форме, репозитории, PDF и видео.
- [ ] Ссылки открываются без личной сессии автора; демо не зависит от localhost.
- [ ] В архиве нет ключей, `.env.local`, runtime, node_modules, личных контактов/треков или приватных research screenshots.
- [ ] Публичные evidence включают только искусственные gold-запросы и публичные preset/OSM данные.
- [ ] Есть © OpenStreetMap contributors / ODbL, ограничения источников и privacy.
- [ ] Форма действительно отправлена; сохранены подтверждение и окончательные ссылки.

Финал заявлен на 22 октября; точное время сверить у организаторов. Публичный сайт сохраняет канонический URL при новых версиях; GitHub Pages не запускает серверные API. [Развёртывание](DEPLOYMENT.md).

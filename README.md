# Кофейня "Теплый Зерновой"

Статический многостраничный сайт на HTML/CSS/JS.

## Локальный запуск

```bash
py -m http.server 5500
```

Открыть: `http://127.0.0.1:5500`

## Публикация для любого устройства (через интернет)

### Вариант 1: Vercel (рекомендуется)
1. Загрузите папку `coffee-shop` в репозиторий GitHub.
2. На [Vercel](https://vercel.com/) нажмите **New Project** и выберите репозиторий.
3. Build Command не нужен, Output Directory: `.` (или оставить по умолчанию).
4. Нажмите **Deploy**.

Файл `vercel.json` уже добавлен.

### Вариант 2: Netlify
1. На [Netlify](https://www.netlify.com/) нажмите **Add new site** -> **Import an existing project**.
2. Выберите репозиторий с папкой `coffee-shop`.
3. Publish directory: `.`.
4. Нажмите **Deploy site**.

Файл `netlify.toml` уже добавлен.

После деплоя сайт открывается по публичной ссылке с любого устройства.

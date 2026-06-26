NYAMI MUSIC v61 — Mobile adaptation + active logo, no design rewrite

Что сделано:
- добавлен новый современный SVG-логотип assets/logo/nyami-logo-v61.svg;
- логотип вставлен внутрь существующего .brand-mark;
- клик по .brand возвращает на главную;
- Enter/Space на логотипе тоже возвращает на главную;
- добавлена мобильная адаптация отдельным слоем mobile-logo-v61.css;
- добавлен отдельный JS-слой logo-home-v61.js;
- manifest.webmanifest обновлён новым логотипом;
- sw.js обновлён под новый cache.

Важно:
- style.css не изменялся;
- desktop-layout не переписывался;
- плееры, карточки, профиль и меню визуально не менялись глобально;
- мобильные правки изолированы в mobile-logo-v61.css.

Проверка:
- python -m py_compile server.py;
- node --check для всех JS-файлов.

/*
  Основний JavaScript-файл проєкту Nyami Music.
  Усі основні блоки нижче прокоментовані українською,
  щоб було простіше читати, змінювати й вчитися на цьому коді.
*/

// Словник інтерфейсу для двох мов: української та англійської.
const i18n = {
  uk: {
    "meta.title": "Nyami Music",
    "brand.subtitle": "мʼяка музична кімната",
    "nav.aria": "Головне меню",
    "nav.home": "Головна",
    "nav.search": "Пошук",
    "nav.library": "Моя музика",
    "nav.radio": "Радіо вайби",
    "nav.liked": "Улюблене",
    "sidebar.playlists": "Плейлисти",
    "buttons.createPlaylist": "Створити плейлист",
    "buttons.profile": "Профіль",
    "buttons.settings": "Налаштування",
    "buttons.nightTheme": "Нічна тема",
    "buttons.random": "Випадковий трек",
    "buttons.changeTheme": "Змінити настрій",
    "buttons.like": "Лайк",
    "buttons.repeat": "Повтор",
    "buttons.prev": "Назад",
    "buttons.play": "Відтворити",
    "buttons.next": "Далі",
    "buttons.shuffle": "Перемішати",
    "buttons.queue": "Черга",
    "buttons.all": "Усе",
    "playlist.night.title": "夜のメロディー",
    "playlist.night.desc": "нічний вайб",
    "playlist.alt.title": "alt cotton",
    "playlist.alt.desc": "альт настрій",
    "playlist.sleep.title": "сонний плед",
    "playlist.sleep.desc": "мʼякий сон",
    "create.title": "Створи свій куточок",
    "create.desc": "Збери плейлист під настрій.",
    "create.button": "Створити",
    "search.placeholder": "Що хочеш послухати, ня?",
    "profile.name": "Денис",
    "hero.pill": "плейлист дня ♡",
    "hero.title": "Місячне світло",
    "hero.desc": "Мʼякі треки для нічних думок, спокійного коду і затишної сіро‑фіолетової атмосфери.",
    "hero.listen": "▶ Слухати",
    "hero.playing": "⏸ Грає",
    "hero.floating": "neko mode",
    "moods.aria": "Категорії настрою",
    "mood.all.title": "Для тебе",
    "mood.all.desc": "усе мʼяке",
    "mood.new.title": "Нові релізи",
    "mood.new.desc": "свіжий вайб",
    "mood.alt.title": "Альт вайб",
    "mood.alt.desc": "ніжно і дивно",
    "mood.sleep.title": "Чіл і сон",
    "mood.sleep.desc": "тихіше, мʼякше",
  "mood.all.tag": "soft mix",
  "mood.new.tag": "fresh picks",
  "mood.alt.tag": "alt mood",
  "mood.sleep.tag": "night calm",
  "moods.pill": "атмосфера",
  "moods.title": "Обери настрій",
  "moods.subtitle": "Швидкий доступ до різних музичних вайбів у м’якому оформленні.",
    "tracks.defaultTitle": "Нещодавно слухали ♡",
    "tracks.defaultSubtitle": "Обери трек і перевір плеєр",
    "tracks.filteredSubtitle": "Фільтр активний — можна шукати всередині нього",
    "tracks.likedTitle": "Улюблене ♡",
    "tracks.likedSubtitle": "Поки показуємо лайки в загальному списку",
    "tracks.header.track": "Трек",
    "tracks.header.artist": "Виконавець",
    "tracks.header.vibe": "Вайб",
    "tracks.header.time": "Час",
    "tracks.empty": "Нічого не знайдено. Спробуй інший запит ♡",
    "right.nowPlaying": "зараз грає",
    "right.coverAlt": "Обкладинка поточного треку",
    "right.modeTitle": "Комфортний режим",
    "right.modeDesc": "Без агресії. Тільки мʼякий лавандовий шум.",
    "right.tip": "Не сумуй, ти промінчик світла. Код теж вийде.",
    "toast.ready": "Готово",
    "toast.menuLater": "Меню треку додамо пізніше",
    "toast.autoplayBlocked": "Натисни play ще раз — браузер блокує автозапуск",
    "toast.likeAdded": "Додано в улюблене ♡",
    "toast.likeRemoved": "Прибрано з улюбленого",
    "toast.shuffleOn": "Shuffle увімкнено",
    "toast.shuffleOff": "Shuffle вимкнено",
    "toast.repeatOn": "Повтор увімкнено",
    "toast.repeatOff": "Повтор вимкнено",
    "toast.themeNight": "Нічна тема",
    "toast.themeLight": "Світла тема",
    "toast.playlistOpened": "Плейлист відкрито",
    "toast.likedLater": "Окрему сторінку улюбленого додамо пізніше",
    "toast.createPlaylistLater": "Створення плейлистів буде наступним блоком",
    "toast.modalLater": "Модальне вікно створимо на наступному кроці",
    "vibe.night": "ніч",
    "vibe.alt": "альт",
    "vibe.new": "нове",
    "vibe.dream": "сон"
  },
  en: {
    "meta.title": "Nyami Music",
    "brand.subtitle": "soft music room",
    "nav.aria": "Main menu",
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.library": "My Music",
    "nav.radio": "Radio Vibes",
    "nav.liked": "Liked",
    "sidebar.playlists": "Playlists",
    "buttons.createPlaylist": "Create playlist",
    "buttons.profile": "Profile",
    "buttons.settings": "Settings",
    "buttons.nightTheme": "Night theme",
    "buttons.random": "Random track",
    "buttons.changeTheme": "Change mood",
    "buttons.like": "Like",
    "buttons.repeat": "Repeat",
    "buttons.prev": "Previous",
    "buttons.play": "Play",
    "buttons.next": "Next",
    "buttons.shuffle": "Shuffle",
    "buttons.queue": "Queue",
    "buttons.all": "All",
    "playlist.night.title": "夜のメロディー",
    "playlist.night.desc": "night vibe",
    "playlist.alt.title": "alt cotton",
    "playlist.alt.desc": "alt mood",
    "playlist.sleep.title": "sleepy blanket",
    "playlist.sleep.desc": "soft sleep",
    "create.title": "Create your corner",
    "create.desc": "Build a playlist for your mood.",
    "create.button": "Create",
    "search.placeholder": "What do you want to hear, nya?",
    "profile.name": "Denys",
    "hero.pill": "playlist of the day ♡",
    "hero.title": "Moonlight",
    "hero.desc": "Soft tracks for late-night thoughts, calm coding, and a cozy gray-purple atmosphere.",
    "hero.listen": "▶ Listen",
    "hero.playing": "⏸ Playing",
    "hero.floating": "neko mode",
    "moods.aria": "Mood categories",
    "mood.all.title": "For you",
    "mood.all.desc": "all things soft",
    "mood.new.title": "New releases",
    "mood.new.desc": "fresh vibe",
    "mood.alt.title": "Alt vibe",
    "mood.alt.desc": "gentle and strange",
    "mood.sleep.title": "Chill & sleep",
    "mood.sleep.desc": "quieter, softer",
  "mood.all.tag": "soft mix",
  "mood.new.tag": "fresh picks",
  "mood.alt.tag": "alt mood",
  "mood.sleep.tag": "night calm",
  "moods.pill": "atmosphere",
  "moods.title": "Choose a mood",
  "moods.subtitle": "Quick access to different music vibes in a soft visual style.",
    "tracks.defaultTitle": "Recently played ♡",
    "tracks.defaultSubtitle": "Choose a track and test the player",
    "tracks.filteredSubtitle": "Filter is active — search works inside it",
    "tracks.likedTitle": "Liked ♡",
    "tracks.likedSubtitle": "For now, likes are shown in the main list",
    "tracks.header.track": "Track",
    "tracks.header.artist": "Artist",
    "tracks.header.vibe": "Vibe",
    "tracks.header.time": "Time",
    "tracks.empty": "Nothing found. Try another search ♡",
    "right.nowPlaying": "now playing",
    "right.coverAlt": "Current track cover",
    "right.modeTitle": "Comfort mode",
    "right.modeDesc": "No aggression. Only soft lavender noise.",
    "right.tip": "Don’t be sad, you’re a little ray of light. The code will work too.",
    "toast.ready": "Done",
    "toast.menuLater": "Track menu will be added later",
    "toast.autoplayBlocked": "Press play again — the browser blocked autoplay",
    "toast.likeAdded": "Added to liked ♡",
    "toast.likeRemoved": "Removed from liked",
    "toast.shuffleOn": "Shuffle on",
    "toast.shuffleOff": "Shuffle off",
    "toast.repeatOn": "Repeat on",
    "toast.repeatOff": "Repeat off",
    "toast.themeNight": "Night theme",
    "toast.themeLight": "Light theme",
    "toast.playlistOpened": "Playlist opened",
    "toast.likedLater": "Separate liked page will be added later",
    "toast.createPlaylistLater": "Playlist creation is the next block",
    "toast.modalLater": "We’ll build the modal window in the next step",
    "vibe.night": "night",
    "vibe.alt": "alt",
    "vibe.new": "new",
    "vibe.dream": "dream"
  }
};

Object.assign(i18n.uk, {
  "search.title": "Пошук ♡",
  "search.subtitle": "Введи назву, виконавця або вайб — список оновиться плавно.",
  "library.title": "Моя музика ♡",
  "library.subtitle": "Твої плейлисти, улюблені треки і мʼякі добірки.",
  "radio.title": "Радіо вайби ✧",
  "radio.subtitle": "Швидка добірка свіжих і випадкових треків.",
  "tracks.likedSubtitle": "Тут залишаються тільки треки, які ти лайкнув.",
  "library.defaultMix": "Готовий мікс",
  "library.customMix": "Твій плейлист",
  "library.likedCard": "Улюблені треки",
  "library.likedDesc": "Усе, що ти позначив сердечком.",
  "library.emptyCustom": "Поки немає власних плейлистів. Створи перший.",
  "modal.pill": "новий плейлист",
  "modal.title": "Створити плейлист",
  "modal.desc": "Назви свій вайб і вибери настрій.",
  "modal.close": "Закрити",
  "modal.nameLabel": "Назва",
  "modal.namePlaceholder": "наприклад: кодинг під пледом",
  "modal.moodLabel": "Настрій",
  "modal.noteLabel": "Опис",
  "modal.notePlaceholder": "коротко опиши атмосферу плейлиста",
  "modal.previewTitle": "Маленький куточок музики",
  "modal.previewDesc": "Плейлист збережеться в браузері.",
  "modal.cancel": "Скасувати",
  "modal.create": "Створити",
  "toast.playlistCreated": "Плейлист створено ♡",
  "toast.noPlaylistName": "Спочатку введи назву плейлиста",
  "toast.libraryOpened": "Бібліотеку відкрито",
  "toast.searchOpened": "Пошук відкрито"
});

Object.assign(i18n.en, {
  "search.title": "Search ♡",
  "search.subtitle": "Type a title, artist, or vibe — the list updates smoothly.",
  "library.title": "My Music ♡",
  "library.subtitle": "Your playlists, liked tracks, and soft collections.",
  "radio.title": "Radio Vibes ✧",
  "radio.subtitle": "A quick set of fresh and random tracks.",
  "tracks.likedSubtitle": "Only the tracks you liked stay here.",
  "library.defaultMix": "Ready mix",
  "library.customMix": "Your playlist",
  "library.likedCard": "Liked tracks",
  "library.likedDesc": "Everything you marked with a heart.",
  "library.emptyCustom": "No custom playlists yet. Create the first one.",
  "modal.pill": "new playlist",
  "modal.title": "Create playlist",
  "modal.desc": "Name your vibe and choose a mood.",
  "modal.close": "Close",
  "modal.nameLabel": "Name",
  "modal.namePlaceholder": "for example: coding under a blanket",
  "modal.moodLabel": "Mood",
  "modal.noteLabel": "Description",
  "modal.notePlaceholder": "briefly describe the playlist atmosphere",
  "modal.previewTitle": "A tiny music corner",
  "modal.previewDesc": "The playlist will be saved in this browser.",
  "modal.cancel": "Cancel",
  "modal.create": "Create",
  "toast.playlistCreated": "Playlist created ♡",
  "toast.noPlaylistName": "Enter a playlist name first",
  "toast.libraryOpened": "Library opened",
  "toast.searchOpened": "Search opened"
});


Object.assign(i18n.uk, {
  "search.assistantPill": "розумний пошук",
  "search.assistantTitle": "Шукай не тільки назву",
  "search.assistantDesc": "Вводь виконавця, вайб або натисни готовий тег.",
  "search.chipAlt": "альт",
  "search.chipSleep": "сон",
  "search.chipNight": "ніч",
  "search.chipDream": "мрії",
  "toast.searchCleared": "Пошук очищено",
  "toast.searchChip": "Пошук за вайбом"
});

Object.assign(i18n.en, {
  "search.assistantPill": "smart search",
  "search.assistantTitle": "Search beyond the title",
  "search.assistantDesc": "Type an artist, vibe, or tap a ready tag.",
  "search.chipAlt": "alt",
  "search.chipSleep": "sleep",
  "search.chipNight": "night",
  "search.chipDream": "dream",
  "toast.searchCleared": "Search cleared",
  "toast.searchChip": "Searching by vibe"
});

Object.assign(i18n.uk, {
  "search.popoverPill": "живий пошук",
  "search.popoverTitle": "Швидкий пошук",
  "search.close": "Закрити пошук",
  "search.liveResults": "Результати",
  "search.history": "Історія",
  "search.clearHistory": "Очистити",
  "search.noHistory": "Історія поки порожня",
  "search.noResultsShort": "Нічого не знайшлось",
  "search.pressEnter": "Enter — відкрити перший результат",
  "toast.historyCleared": "Історію пошуку очищено"
});

Object.assign(i18n.en, {
  "search.popoverPill": "live search",
  "search.popoverTitle": "Quick search",
  "search.close": "Close search",
  "search.liveResults": "Results",
  "search.history": "History",
  "search.clearHistory": "Clear",
  "search.noHistory": "No search history yet",
  "search.noResultsShort": "No matches found",
  "search.pressEnter": "Enter — open the first result",
  "toast.historyCleared": "Search history cleared"
});


Object.assign(i18n.uk, {
  "buttons.playPlaylist": "▶ Слухати плейлист",
  "buttons.backLibrary": "← До бібліотеки",
  "buttons.deletePlaylist": "Видалити",
  "buttons.openPlaylist": "Відкрити плейлист",
  "playlist.detailTag": "плейлист",
  "playlist.customTag": "твій плейлист",
  "playlist.readyTag": "готова добірка",
  "playlist.tracksCount": "{count} треків",
  "playlist.oneTrack": "1 трек",
  "playlist.empty": "У цьому плейлисті поки немає треків під вибраний настрій.",
  "library.createTitle": "Новий плейлист",
  "library.createDesc": "Створи окремий музичний куточок під свій вайб.",
  "library.createButton": "+ Створити плейлист",
  "toast.playlistDeleted": "Плейлист видалено",
  "toast.playlistPlaying": "Плейлист запущено"
});

Object.assign(i18n.en, {
  "buttons.playPlaylist": "▶ Play playlist",
  "buttons.backLibrary": "← Back to library",
  "buttons.deletePlaylist": "Delete",
  "buttons.openPlaylist": "Open playlist",
  "playlist.detailTag": "playlist",
  "playlist.customTag": "your playlist",
  "playlist.readyTag": "ready mix",
  "playlist.tracksCount": "{count} tracks",
  "playlist.oneTrack": "1 track",
  "playlist.empty": "This playlist has no tracks for the selected mood yet.",
  "library.createTitle": "New playlist",
  "library.createDesc": "Create a separate music corner for your vibe.",
  "library.createButton": "+ Create playlist",
  "toast.playlistDeleted": "Playlist deleted",
  "toast.playlistPlaying": "Playlist started"
});

Object.assign(i18n.uk, {
  "trackMenu.title": "Дії з треком",
  "trackMenu.mainActions": "Швидкі дії",
  "trackMenu.playNext": "Слухати наступним",
  "trackMenu.addToPlaylist": "Додати в плейлист",
  "trackMenu.removeFromPlaylist": "Прибрати з цього плейлиста",
  "trackMenu.like": "Додати в улюблене",
  "trackMenu.unlike": "Прибрати з улюбленого",
  "trackMenu.noPlaylists": "Спочатку створи власний плейлист, і він зʼявиться тут.",
  "trackMenu.createPlaylist": "Створити новий плейлист",
  "trackMenu.added": "Уже в плейлисті",
  "toast.addedToPlaylist": "Трек додано в плейлист",
  "toast.alreadyInPlaylist": "Трек уже є в цьому плейлисті",
  "toast.removedFromPlaylist": "Трек прибрано з плейлиста",
  "toast.playNext": "Трек буде наступним"
});

Object.assign(i18n.en, {
  "trackMenu.title": "Track actions",
  "trackMenu.mainActions": "Quick actions",
  "trackMenu.playNext": "Play next",
  "trackMenu.addToPlaylist": "Add to playlist",
  "trackMenu.removeFromPlaylist": "Remove from this playlist",
  "trackMenu.like": "Add to liked",
  "trackMenu.unlike": "Remove from liked",
  "trackMenu.noPlaylists": "Create your own playlist first, and it will appear here.",
  "trackMenu.createPlaylist": "Create new playlist",
  "trackMenu.added": "Already in playlist",
  "toast.addedToPlaylist": "Track added to playlist",
  "toast.alreadyInPlaylist": "Track is already in this playlist",
  "toast.removedFromPlaylist": "Track removed from playlist",
  "toast.playNext": "Track will play next"
});


Object.assign(i18n.uk, {
  "player.add": "Додати",
  "player.lyrics": "Текст / пошук",
  "player.device": "Пристрій",
  "player.volume": "Гучність",
  "player.mini": "Мініплеєр",
  "player.fullscreen": "Повний екран",
  "toast.playerToolLater": "Цей інструмент додамо в профільному блоці"
});

Object.assign(i18n.en, {
  "player.add": "Add",
  "player.lyrics": "Lyrics / search",
  "player.device": "Device",
  "player.volume": "Volume",
  "player.mini": "Mini player",
  "player.fullscreen": "Fullscreen",
  "toast.playerToolLater": "This tool will be added in the profile block"
});


Object.assign(i18n.uk, {
  "profile.pageTitle": "Профіль",
  "profile.pageSubtitle": "Твоя музична кімната, плейлисти, лайки й налаштування.",
  "profile.heroPill": "користувач Nyami",
  "profile.bio": "Мʼякий простір для треків, нічного коду, альт-настрою і затишних плейлистів.",
  "profile.edit": "Редагувати",
  "profile.openLibrary": "Моя музика",
  "profile.statsPlaylists": "Плейлисти",
  "profile.statsLiked": "Улюблені",
  "profile.statsTracks": "Треки",
  "profile.statsLanguage": "Мова",
  "profile.favTitle": "Улюблені треки",
  "profile.playlistsTitle": "Твої плейлисти",
  "profile.settingsTitle": "Швидкі налаштування",
  "profile.settingTheme": "Тема",
  "profile.settingLanguage": "Мова інтерфейсу",
  "profile.settingStorage": "Дані",
  "profile.clearData": "Очистити демо-дані",
  "toast.profileOpened": "Профіль відкрито",
  "toast.demoDataCleared": "Демо-дані очищено"
});

Object.assign(i18n.en, {
  "profile.pageTitle": "Profile",
  "profile.pageSubtitle": "Your music room, playlists, likes, and settings.",
  "profile.heroPill": "Nyami user",
  "profile.bio": "A soft space for tracks, night coding, alt mood, and cozy playlists.",
  "profile.edit": "Edit",
  "profile.openLibrary": "My Music",
  "profile.statsPlaylists": "Playlists",
  "profile.statsLiked": "Liked",
  "profile.statsTracks": "Tracks",
  "profile.statsLanguage": "Language",
  "profile.favTitle": "Liked tracks",
  "profile.playlistsTitle": "Your playlists",
  "profile.settingsTitle": "Quick settings",
  "profile.settingTheme": "Theme",
  "profile.settingLanguage": "Interface language",
  "profile.settingStorage": "Data",
  "profile.clearData": "Clear demo data",
  "toast.profileOpened": "Profile opened",
  "toast.demoDataCleared": "Demo data cleared"
});


Object.assign(i18n.uk, {
  "profile.editPill": "профіль",
  "profile.editTitle": "Редагувати профіль",
  "profile.editDesc": "Зміни ім’я, опис і маленький аватар.",
  "profile.nameLabel": "Ім’я",
  "profile.namePlaceholder": "наприклад: Денис",
  "profile.avatarLabel": "Аватар",
  "profile.avatarPlaceholder": "наприклад: 猫",
  "profile.bioLabel": "Опис",
  "profile.bioPlaceholder": "коротко опиши свій музичний вайб",
  "profile.save": "Зберегти",
  "toast.profileSaved": "Профіль збережено"
});

Object.assign(i18n.en, {
  "profile.editPill": "profile",
  "profile.editTitle": "Edit profile",
  "profile.editDesc": "Change your name, bio, and small avatar.",
  "profile.nameLabel": "Name",
  "profile.namePlaceholder": "for example: Denys",
  "profile.avatarLabel": "Avatar",
  "profile.avatarPlaceholder": "for example: 猫",
  "profile.bioLabel": "Bio",
  "profile.bioPlaceholder": "briefly describe your music vibe",
  "profile.save": "Save",
  "toast.profileSaved": "Profile saved"
});


Object.assign(i18n.uk, {
  "profile.handleLabel": "Нік",
  "profile.handlePlaceholder": "наприклад: @nyami.denys",
  "profile.avatarPresets": "Швидкий аватар",
  "profile.vibeLabel": "Улюблений вайб",
  "profile.vibeSoft": "soft",
  "profile.vibeAlt": "alt",
  "profile.vibeNight": "night",
  "profile.vibeSleep": "sleep",
  "profile.bannerLabel": "Обкладинка профілю",
  "profile.settingThemeDesc": "Перемикай світлу або нічну тему.",
  "profile.settingLanguageDesc": "Залишаємо тільки UA та EN.",
  "profile.settingStorageDesc": "Очистити лайки та демо-плейлисти."
});

Object.assign(i18n.en, {
  "profile.handleLabel": "Handle",
  "profile.handlePlaceholder": "for example: @nyami.denys",
  "profile.avatarPresets": "Quick avatar",
  "profile.vibeLabel": "Favorite vibe",
  "profile.vibeSoft": "soft",
  "profile.vibeAlt": "alt",
  "profile.vibeNight": "night",
  "profile.vibeSleep": "sleep",
  "profile.bannerLabel": "Profile banner",
  "profile.settingThemeDesc": "Switch between light and night theme.",
  "profile.settingLanguageDesc": "Only UA and EN are kept.",
  "profile.settingStorageDesc": "Clear likes and demo playlists."
});


Object.assign(i18n.uk, {
  "profile.avatarPhoto": "Фото аватара",
  "profile.avatarPhotoDesc": "Можна залишити емодзі або завантажити свою картинку.",
  "profile.bannerPhoto": "Обкладинка",
  "profile.bannerPhotoDesc": "Власний банер зробить профіль унікальним.",
  "profile.uploadAvatar": "Завантажити",
  "profile.uploadBanner": "Завантажити",
  "profile.removePhoto": "Прибрати",
  "profile.statusLabel": "Статус",
  "profile.statusPlaceholder": "наприклад: coding night",
  "profile.locationLabel": "Місто / країна",
  "profile.locationPlaceholder": "наприклад: Ukraine",
  "profile.websiteLabel": "Посилання",
  "profile.websitePlaceholder": "твій сайт або соцмережа",
  "profile.aboutLabel": "Про себе",
  "profile.aboutPlaceholder": "розкажи більше про себе, музику, стиль, настрій",
  "profile.accentLabel": "Акцент профілю",
  "profile.aboutTitle": "Про себе",
  "profile.linksTitle": "Деталі профілю",
  "profile.noAbout": "Додай розширений опис, щоб профіль виглядав живим.",
  "profile.noWebsite": "Посилання не додано",
  "profile.noLocation": "Локація не додана",
  "profile.noStatus": "Статус не додано",
  "toast.imageOnly": "Можна завантажити тільки зображення",
  "toast.imageLoaded": "Фото додано в preview"
});

Object.assign(i18n.en, {
  "profile.avatarPhoto": "Avatar photo",
  "profile.avatarPhotoDesc": "Keep an emoji or upload your own picture.",
  "profile.bannerPhoto": "Banner",
  "profile.bannerPhotoDesc": "A custom banner makes the profile unique.",
  "profile.uploadAvatar": "Upload",
  "profile.uploadBanner": "Upload",
  "profile.removePhoto": "Remove",
  "profile.statusLabel": "Status",
  "profile.statusPlaceholder": "for example: coding night",
  "profile.locationLabel": "City / country",
  "profile.locationPlaceholder": "for example: Ukraine",
  "profile.websiteLabel": "Link",
  "profile.websitePlaceholder": "your website or social link",
  "profile.aboutLabel": "About",
  "profile.aboutPlaceholder": "tell more about yourself, music, style, mood",
  "profile.accentLabel": "Profile accent",
  "profile.aboutTitle": "About",
  "profile.linksTitle": "Profile details",
  "profile.noAbout": "Add a longer description to make the profile feel alive.",
  "profile.noWebsite": "No link added",
  "profile.noLocation": "No location added",
  "profile.noStatus": "No status added",
  "toast.imageOnly": "Only images can be uploaded",
  "toast.imageLoaded": "Photo added to preview"
});


Object.assign(i18n.uk, {
  "heartPlayer.label": "мʼякий плеєр",
  "player.close": "Закрити плеєр",
  "player.restoreBottom": "Нижній плеєр",
  "player.restoreRight": "Правий плеєр",
  "player.restoreHeart": "Сердечко",
  "toast.playerClosed": "Плеєр приховано",
  "toast.playerRestored": "Плеєр повернуто"
});

Object.assign(i18n.en, {
  "heartPlayer.label": "soft player",
  "player.close": "Close player",
  "player.restoreBottom": "Bottom player",
  "player.restoreRight": "Right player",
  "player.restoreHeart": "Heart player",
  "toast.playerClosed": "Player hidden",
  "toast.playerRestored": "Player restored"
});



Object.assign(i18n.uk, {
  "profileMenu.profile": "Профіль",
  "profileMenu.edit": "Редагувати",
  "profileMenu.library": "Бібліотека",
  "profileMenu.settings": "Налаштування",
  "profileMenu.theme": "Змінити тему",
  "profileMenu.language": "Змінити мову",
  "profileMenu.logout": "Вийти",
  "toast.authLater": "Авторизацію підключимо наступним кроком"
});

Object.assign(i18n.en, {
  "profileMenu.profile": "Profile",
  "profileMenu.edit": "Edit",
  "profileMenu.library": "Library",
  "profileMenu.settings": "Settings",
  "profileMenu.theme": "Change theme",
  "profileMenu.language": "Change language",
  "profileMenu.logout": "Log out",
  "toast.authLater": "Auth will be connected in the next step"
});



Object.assign(i18n.uk, {
  "auth.kicker": "nyami account",
  "auth.title": "Увійди у свій музичний простір",
  "auth.desc": "Збережи профіль, улюблені треки й плейлисти локально на цьому пристрої.",
  "auth.loginTab": "Вхід",
  "auth.registerTab": "Реєстрація",
  "auth.name": "Імʼя",
  "auth.email": "Email або нік",
  "auth.password": "Пароль",
  "auth.loginBtn": "Увійти",
  "auth.registerBtn": "Створити акаунт",
  "auth.demoBtn": "Продовжити як гість",
  "auth.note": "Це фронтенд-демо: дані зберігаються тільки у браузері.",
  "toast.loginSuccess": "Вхід виконано",
  "toast.registerSuccess": "Акаунт створено",
  "toast.logoutSuccess": "Ви вийшли з акаунта",
  "toast.authFill": "Заповни логін і пароль"
});

Object.assign(i18n.en, {
  "auth.kicker": "nyami account",
  "auth.title": "Sign in to your music space",
  "auth.desc": "Save your profile, liked tracks and playlists locally on this device.",
  "auth.loginTab": "Login",
  "auth.registerTab": "Register",
  "auth.name": "Name",
  "auth.email": "Email or handle",
  "auth.password": "Password",
  "auth.loginBtn": "Log in",
  "auth.registerBtn": "Create account",
  "auth.demoBtn": "Continue as guest",
  "auth.note": "Frontend demo: data is stored only in this browser.",
  "toast.loginSuccess": "Logged in",
  "toast.registerSuccess": "Account created",
  "toast.logoutSuccess": "Logged out",
  "toast.authFill": "Fill login and password"
});



Object.assign(i18n.uk, {
  "settings.pageTitle": "Налаштування",
  "settings.pageSubtitle": "Акаунт, профіль, тема, мова та локальні дані.",
  "settings.heroPill": "account settings",
  "settings.heroDesc": "Керуй профілем, виглядом сайту, мовою та демо-даними в одному місці.",
  "settings.editProfile": "Редагувати профіль",
  "settings.openProfile": "Відкрити профіль",
  "settings.account": "Акаунт",
  "settings.visual": "Вигляд",
  "settings.data": "Дані",
  "settings.authStatus": "Статус входу",
  "settings.loggedIn": "Увійшов",
  "settings.guest": "Гість",
  "settings.authDesc": "Поки що це frontend-демо з localStorage.",
  "settings.profileName": "Профіль",
  "settings.profileDesc": "Імʼя, нік, аватар, опис і обкладинка.",
  "settings.themeTitle": "Тема",
  "settings.themeDesc": "Перемикання світлого та нічного режиму.",
  "settings.languageTitle": "Мова",
  "settings.languageDesc": "Залишені тільки українська та англійська.",
  "settings.localData": "Локальні дані",
  "settings.localDataDesc": "Лайки, плейлисти та демо-налаштування зберігаються у браузері.",
  "settings.clearLikes": "Очистити лайки",
  "settings.clearPlaylists": "Очистити плейлисти",
  "settings.clearAll": "Очистити все демо",
  "settings.logout": "Вийти",
  "settings.note": "Після backend ці дії будуть працювати через справжній акаунт.",
  "toast.settingsOpened": "Налаштування відкрито",
  "toast.likesCleared": "Лайки очищено",
  "toast.playlistsCleared": "Плейлисти очищено",
  "toast.demoCleared": "Демо-дані очищено"
});

Object.assign(i18n.en, {
  "settings.pageTitle": "Settings",
  "settings.pageSubtitle": "Account, profile, theme, language, and local data.",
  "settings.heroPill": "account settings",
  "settings.heroDesc": "Manage your profile, site appearance, language, and demo data in one place.",
  "settings.editProfile": "Edit profile",
  "settings.openProfile": "Open profile",
  "settings.account": "Account",
  "settings.visual": "Appearance",
  "settings.data": "Data",
  "settings.authStatus": "Login status",
  "settings.loggedIn": "Logged in",
  "settings.guest": "Guest",
  "settings.authDesc": "For now this is a frontend demo with localStorage.",
  "settings.profileName": "Profile",
  "settings.profileDesc": "Name, handle, avatar, bio, and banner.",
  "settings.themeTitle": "Theme",
  "settings.themeDesc": "Switch between light and night mode.",
  "settings.languageTitle": "Language",
  "settings.languageDesc": "Only Ukrainian and English are kept.",
  "settings.localData": "Local data",
  "settings.localDataDesc": "Likes, playlists, and demo settings are stored in the browser.",
  "settings.clearLikes": "Clear likes",
  "settings.clearPlaylists": "Clear playlists",
  "settings.clearAll": "Clear all demo",
  "settings.logout": "Log out",
  "settings.note": "After backend, these actions will work through a real account.",
  "toast.settingsOpened": "Settings opened",
  "toast.likesCleared": "Likes cleared",
  "toast.playlistsCleared": "Playlists cleared",
  "toast.demoCleared": "Demo data cleared"
});



Object.assign(i18n.uk, {
  "auth.confirmPassword": "Повтори пароль",
  "auth.error.name": "Введи імʼя мінімум 2 символи",
  "auth.error.login": "Введи email або нік",
  "auth.error.password": "Пароль має бути мінімум 6 символів",
  "auth.error.confirm": "Паролі не збігаються",
  "auth.error.exists": "Такий email або нік вже зареєстрований",
  "auth.error.notFound": "Користувача не знайдено",
  "auth.error.badPassword": "Невірний пароль",
  "auth.error.general": "Помилка авторизації",
  "auth.loading": "Зачекай",
  "toast.sessionReady": "Сесія активна"
});

Object.assign(i18n.en, {
  "auth.confirmPassword": "Repeat password",
  "auth.error.name": "Enter a name with at least 2 characters",
  "auth.error.login": "Enter an email or handle",
  "auth.error.password": "Password must be at least 6 characters",
  "auth.error.confirm": "Passwords do not match",
  "auth.error.exists": "This email or handle is already registered",
  "auth.error.notFound": "User not found",
  "auth.error.badPassword": "Wrong password",
  "auth.error.general": "Auth error",
  "auth.loading": "Wait",
  "toast.sessionReady": "Session active"
});



Object.assign(i18n.uk, {
  "auth.backendHint": "Потрібен запуск через Python server.py",
  "auth.error.backend": "Backend недоступний. Запусти START_WINDOWS.bat і відкрий http://127.0.0.1:5000",
  "auth.error.name": "Введи імʼя мінімум 2 символи",
  "auth.error.login": "Введи email або нік",
  "auth.error.password": "Пароль має бути мінімум 6 символів",
  "auth.error.confirm": "Паролі не збігаються",
  "auth.error.exists": "Такий email або нік вже зареєстрований",
  "auth.error.notFound": "Користувача не знайдено",
  "auth.error.badPassword": "Невірний пароль",
  "auth.error.general": "Помилка авторизації",
  "auth.loading": "Зачекай",
  "toast.profileSynced": "Профіль збережено на сервері"
});

Object.assign(i18n.en, {
  "auth.backendHint": "Run through Python server.py",
  "auth.error.backend": "Backend unavailable. Run START_WINDOWS.bat and open http://127.0.0.1:5000",
  "auth.error.name": "Enter a name with at least 2 characters",
  "auth.error.login": "Enter an email or handle",
  "auth.error.password": "Password must be at least 6 characters",
  "auth.error.confirm": "Passwords do not match",
  "auth.error.exists": "This email or handle is already registered",
  "auth.error.notFound": "User not found",
  "auth.error.badPassword": "Wrong password",
  "auth.error.general": "Auth error",
  "auth.loading": "Wait",
  "toast.profileSynced": "Profile saved on server"
});



Object.assign(i18n.uk, {
  "auth.methodEmail": "Email",
  "auth.methodUsername": "Нік",
  "auth.methodPhone": "Телефон",
  "auth.modeHint": "Зареєструйся будь-яким способом, потім увійди цими ж даними.",
  "auth.guestLimit": "Гість може слухати музику, але не може лайкати, створювати плейлисти й редагувати профіль.",
  "auth.guestBlocked": "У гостьовому режимі ця дія недоступна. Створи акаунт.",
  "auth.error.email": "Введи нормальний email",
  "auth.error.username": "Нік має бути мінімум 3 символи",
  "auth.error.phone": "Введи номер телефону мінімум 7 цифр",
  "toast.guestMode": "Гостьовий режим: доступ обмежений"
});

Object.assign(i18n.en, {
  "auth.methodEmail": "Email",
  "auth.methodUsername": "Handle",
  "auth.methodPhone": "Phone",
  "auth.modeHint": "Register with any method, then log in with the same data.",
  "auth.guestLimit": "Guests can listen, but cannot like, create playlists, or edit profile.",
  "auth.guestBlocked": "This action is unavailable in guest mode. Create an account.",
  "auth.error.email": "Enter a valid email",
  "auth.error.username": "Handle must be at least 3 characters",
  "auth.error.phone": "Enter a phone number with at least 7 digits",
  "toast.guestMode": "Guest mode: limited access"
});



Object.assign(i18n.uk, {
  "auth46.kicker": "nyami secure account",
  "auth46.loginTitle": "Вхід у Nyami",
  "auth46.registerTitle": "Створи акаунт",
  "auth46.loginDesc": "Увійди саме тим способом і паролем, які вказував під час реєстрації.",
  "auth46.registerDesc": "Обери email, нік або телефон. Потім вхід буде тільки з цими даними.",
  "auth46.loginTab": "Вхід",
  "auth46.registerTab": "Реєстрація",
  "auth46.email": "Email",
  "auth46.username": "Нік",
  "auth46.phone": "Телефон",
  "auth46.name": "Імʼя",
  "auth46.password": "Пароль",
  "auth46.confirm": "Повтори пароль",
  "auth46.loginBtn": "Увійти",
  "auth46.registerBtn": "Зареєструватися",
  "auth46.guestBtn": "Продовжити як гість",
  "auth46.guestLimit": "Гість може слухати музику, але не може лайкати, створювати плейлисти й редагувати профіль.",
  "auth46.check1": "✓ Python backend",
  "auth46.check2": "✓ SQLite база",
  "auth46.check3": "✓ Пароль перевіряється сервером",
  "auth46.errorName": "Введи імʼя мінімум 2 символи",
  "auth46.errorEmail": "Введи нормальний email",
  "auth46.errorUsername": "Нік має бути мінімум 3 символи: a-z, 0-9, . _ -",
  "auth46.errorPhone": "Введи телефон мінімум 7 цифр",
  "auth46.errorPassword": "Пароль має бути мінімум 6 символів",
  "auth46.errorConfirm": "Паролі не збігаються",
  "auth46.errorExists": "Такий користувач вже зареєстрований",
  "auth46.errorNotFound": "Користувача не знайдено",
  "auth46.errorBadPassword": "Невірний пароль",
  "auth46.errorBackend": "Backend недоступний. Запусти START_WINDOWS.bat і відкрий http://127.0.0.1:5000",
  "auth46.errorGuestBlocked": "У гостьовому режимі ця дія недоступна. Зареєструй акаунт.",
  "toast.auth46Registered": "Акаунт створено",
  "toast.auth46LoggedIn": "Вхід виконано",
  "toast.auth46Guest": "Гостьовий режим: доступ обмежений"
});

Object.assign(i18n.en, {
  "auth46.kicker": "nyami secure account",
  "auth46.loginTitle": "Sign in to Nyami",
  "auth46.registerTitle": "Create account",
  "auth46.loginDesc": "Sign in with the exact method and password used during registration.",
  "auth46.registerDesc": "Choose email, handle, or phone. Login will work only with the same data.",
  "auth46.loginTab": "Login",
  "auth46.registerTab": "Register",
  "auth46.email": "Email",
  "auth46.username": "Handle",
  "auth46.phone": "Phone",
  "auth46.name": "Name",
  "auth46.password": "Password",
  "auth46.confirm": "Repeat password",
  "auth46.loginBtn": "Log in",
  "auth46.registerBtn": "Register",
  "auth46.guestBtn": "Continue as guest",
  "auth46.guestLimit": "Guests can listen, but cannot like, create playlists, or edit profile.",
  "auth46.check1": "✓ Python backend",
  "auth46.check2": "✓ SQLite database",
  "auth46.check3": "✓ Password checked by server",
  "auth46.errorName": "Enter a name with at least 2 characters",
  "auth46.errorEmail": "Enter a valid email",
  "auth46.errorUsername": "Handle must be at least 3 characters: a-z, 0-9, . _ -",
  "auth46.errorPhone": "Enter a phone with at least 7 digits",
  "auth46.errorPassword": "Password must be at least 6 characters",
  "auth46.errorConfirm": "Passwords do not match",
  "auth46.errorExists": "This user is already registered",
  "auth46.errorNotFound": "User not found",
  "auth46.errorBadPassword": "Wrong password",
  "auth46.errorBackend": "Backend unavailable. Run START_WINDOWS.bat and open http://127.0.0.1:5000",
  "auth46.errorGuestBlocked": "This action is unavailable in guest mode. Register an account.",
  "toast.auth46Registered": "Account created",
  "toast.auth46LoggedIn": "Logged in",
  "toast.auth46Guest": "Guest mode: limited access"
});


// Демонстраційні треки для інтерфейсу і плеєра.
const tracks = [
  {
    title: "ねむれない夜に",
    artist: "yume",
    vibe: "night",
    category: "sleep",
    duration: "0:28",
    cover: "assets/covers/cover1.jpg",
    file: "assets/music/track1.mp3"
  },
  {
    title: "violet tears",
    artist: "xKito Music",
    vibe: "alt",
    category: "alt",
    duration: "0:31",
    cover: "assets/covers/cover2.jpg",
    file: "assets/music/track2.mp3"
  },
  {
    title: "少女レイ",
    artist: "みきとP",
    vibe: "new",
    category: "new",
    duration: "0:34",
    cover: "assets/covers/cover3.jpg",
    file: "assets/music/track3.mp3"
  },
  {
    title: "ghost",
    artist: "yorushika",
    vibe: "dream",
    category: "sleep",
    duration: "0:29",
    cover: "assets/covers/cover4.jpg",
    file: "assets/music/track4.mp3"
  },
  {
    title: "lavender loop",
    artist: "soft neko",
    vibe: "alt",
    category: "alt",
    duration: "0:28",
    cover: "assets/covers/cover2.jpg",
    file: "assets/music/track2.mp3"
  },
  {
    title: "нічний код",
    artist: "room.exe",
    vibe: "night",
    category: "sleep",
    duration: "0:31",
    cover: "assets/covers/playlist1.jpg",
    file: "assets/music/track1.mp3"
  },
  {
    title: "cotton radio",
    artist: "mimi wave",
    vibe: "new",
    category: "new",
    duration: "0:34",
    cover: "assets/covers/cover3.jpg",
    file: "assets/music/track3.mp3"
  },
  {
    title: "dream capsule",
    artist: "luna touch",
    vibe: "dream",
    category: "sleep",
    duration: "0:29",
    cover: "assets/covers/nowplaying.jpg",
    file: "assets/music/track4.mp3"
  },
  {
    title: "purple milk",
    artist: "nyami club",
    vibe: "alt",
    category: "alt",
    duration: "0:28",
    cover: "assets/covers/cover1.jpg",
    file: "assets/music/track1.mp3"
  },
  {
    title: "soft morning",
    artist: "anime kitchen",
    vibe: "new",
    category: "new",
    duration: "0:31",
    cover: "assets/covers/playlist2.jpg",
    file: "assets/music/track2.mp3"
  },
  {
    title: "pillow stars",
    artist: "sleepy hearts",
    vibe: "night",
    category: "sleep",
    duration: "0:34",
    cover: "assets/covers/cover4.jpg",
    file: "assets/music/track3.mp3"
  },
  {
    title: "tiny moon",
    artist: "xKito Music",
    vibe: "dream",
    category: "sleep",
    duration: "0:29",
    cover: "assets/covers/playlist3.jpg",
    file: "assets/music/track4.mp3"
  }
];

// Короткі хелпери для швидкого пошуку елементів у DOM.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Посилання на головні елементи сторінки.
const audio = $("#audio");
const trackList = $("#trackList");
const searchInput = $("#searchInput");
const searchBox = $("#searchBox");
const clearSearchBtn = $("#clearSearchBtn");
const searchAssistant = $("#searchAssistant");
const searchPopover = $("#searchPopover");
const searchResultList = $("#searchResultList");
const searchHistoryBlock = $("#searchHistoryBlock");
const searchHistoryList = $("#searchHistoryList");
const clearHistoryBtn = $("#clearHistoryBtn");
const closeSearchPopover = $("#closeSearchPopover");
const tracksTitle = $("#tracksTitle");
const tracksSubtitle = $("#tracksSubtitle");
const tracksPanel = $(".tracks");
const mainPanel = $(".main");
const trackMenu = $("#trackMenu");

const nowCover = $("#nowCover");
const nowTitle = $("#nowTitle");
const nowArtist = $("#nowArtist");
const nowProgress = $("#nowProgress");
const bottomProgress = $("#bottomProgress");
const currentTimeText = $("#currentTime");
const durationTimeText = $("#durationTime");
const bottomCurrentTimeText = $("#bottomCurrentTime");
const bottomDurationTimeText = $("#bottomDurationTime");

const bottomCover = $("#bottomCover");
const bottomTitle = $("#bottomTitle");
const bottomArtist = $("#bottomArtist");



const playBtn = $("#playBtn");
const bottomPlayBtn = $("#bottomPlayBtn");
const bottomShuffleBtn = $("#bottomShuffleBtn");
const bottomRepeatBtn = $("#bottomRepeatBtn");
const heroPlayBtn = $("#heroPlayBtn");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const bottomPrevBtn = $("#bottomPrevBtn");
const bottomNextBtn = $("#bottomNextBtn");
const shuffleBtn = $("#shuffleBtn");
const shuffleTopBtn = $("#shuffleTopBtn");
const repeatBtn = $("#repeatBtn");
const randomBtn = $("#randomBtn");

const rightLikeBtn = $("#rightLikeBtn");
const bottomLikeBtn = $("#bottomLikeBtn");
const bottomAddBtn = $("#bottomAddBtn");
const muteBtn = $("#muteBtn");
const closeBottomPlayerBtn = $("#closeBottomPlayerBtn");
const closeRightPlayerBtn = $("#closeRightPlayerBtn");
const playersRestore = $("#playersRestore");
const restorePlayerButtons = $$("[data-restore-player]");
const profileOpenBtn = $("#profileOpenBtn");
const sideProfileBtn = $("#sideProfileBtn");
const profileChipName = $("#profileChipName");
const profileChipAvatar = $("#profileChipAvatar");
const profileDropdown = $("#profileDropdown");
const profileDropdownAvatar = $("#profileDropdownAvatar");
const profileDropdownName = $("#profileDropdownName");
const profileDropdownHandle = $("#profileDropdownHandle");

const authScreen = $("#authScreen");
const authForm = $("#authForm");
const authNameInput = $("#authNameInput");
const authEmailInput = $("#authEmailInput");
const authPasswordInput = $("#authPasswordInput");
const authConfirmPasswordInput = $("#authConfirmPasswordInput");
const authErrorText = $("#authErrorText");
const authSubmitBtn = $("#authSubmitBtn");
const authDemoBtn = $("#authDemoBtn");
const authModeButtons = $$("[data-auth-mode]");
const authMethodButtons = $$("[data-auth-method]");
const authModeHint = $("#authModeHint");
let authMode = "login";
let authMethod = "email";
let authState = JSON.parse(localStorage.getItem("nyamiAuth") || "null") || {
  isLoggedIn: false,
  isGuest: false,
  name: "",
  handle: ""
};

const profileModal = $("#profileModal");
const closeProfileModal = $("#closeProfileModal");
const cancelProfileModal = $("#cancelProfileModal");
const saveProfileBtn = $("#saveProfileBtn");
const profileNameInput = $("#profileNameInput");
const profileHandleInput = $("#profileHandleInput");
const profileStatusInput = $("#profileStatusInput");
const profileLocationInput = $("#profileLocationInput");
const profileWebsiteInput = $("#profileWebsiteInput");
const profileAvatarInput = $("#profileAvatarInput");
const profileBioInput = $("#profileBioInput");
const profileAboutInput = $("#profileAboutInput");
const profileVibeInput = $("#profileVibeInput");
const profileBannerInput = $("#profileBannerInput");
const profileAccentInput = $("#profileAccentInput");
const profileAvatarFileInput = $("#profileAvatarFileInput");
const profileBannerFileInput = $("#profileBannerFileInput");
const uploadAvatarBtn = $("#uploadAvatarBtn");
const uploadBannerBtn = $("#uploadBannerBtn");
const removeAvatarImageBtn = $("#removeAvatarImageBtn");
const removeBannerImageBtn = $("#removeBannerImageBtn");
const profileAvatarPresetButtons = $$("#profileAvatarPresets button");
const profileVibePresetButtons = $$("#profileVibePresets button");
const profileBannerPresetButtons = $$("#profileBannerPresets button");
const profileAccentPresetButtons = $$("#profileAccentPresets button");
const profileEditAvatarPreview = $("#profileEditAvatarPreview");
const profileEditNamePreview = $("#profileEditNamePreview");
const profileEditBioPreview = $("#profileEditBioPreview");
const heroLikeBtn = $("#heroLikeBtn");
const volumeInput = $("#volumeInput");
const wave = $("#wave");
const playerRanges = $$(".pro-range");
const toast = $("#toast");
const playlistModal = $("#playlistModal");
const closePlaylistModal = $("#closePlaylistModal");
const cancelPlaylistModal = $("#cancelPlaylistModal");
const playlistNameInput = $("#playlistNameInput");
const playlistDescriptionInput = $("#playlistDescriptionInput");
const playlistMoodSelect = $("#playlistMoodSelect");
const playlistMoodButtons = $$(".modal-mood-option");
const modalPreviewImage = $(".modal-preview img");
const createPlaylistSubmitBtn = $("#createPlaylistSubmitBtn");
const sideThemeBtn = $("#sideThemeBtn");
const miniSection = $(".mini-section");
const playlistMiniList = $("#playlistMiniList") || miniSection;
const playlistDetail = $("#playlistDetail");
const playlistDetailCover = $("#playlistDetailCover");
const playlistDetailTag = $("#playlistDetailTag");
const playlistDetailTitle = $("#playlistDetailTitle");
const playlistDetailDesc = $("#playlistDetailDesc");
const playlistDetailCount = $("#playlistDetailCount");
const playlistDetailMood = $("#playlistDetailMood");
const playlistPlayBtn = $("#playlistPlayBtn");
const playlistBackBtn = $("#playlistBackBtn");
const playlistDeleteBtn = $("#playlistDeleteBtn");
const trackHeader = $("#trackHeader");

// Поточний стан застосунку.
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentFilter = "all";
let currentTitleKey = "tracks.defaultTitle";
let currentSubtitleKey = "tracks.defaultSubtitle";
let customTitleText = "";
let customSubtitleText = "";
let liked = JSON.parse(localStorage.getItem("nyamiLikedTracks") || "[]");
let currentLang = localStorage.getItem("nyamiLanguage") || "uk";
let currentView = "home";
let userPlaylists = JSON.parse(localStorage.getItem("nyamiUserPlaylists") || "[]");
let searchHistory = JSON.parse(localStorage.getItem("nyamiSearchHistory") || "[]");
let activePlaylist = null;
let menuTrackIndex = null;
let nextQueue = [];
let previousVolume = 0.7;
let isLanguageSwitching = false;
let isThemeSwitching = false;
let closedPlayers = JSON.parse(localStorage.getItem("nyamiClosedPlayers") || "null") || {
  bottom: false,
  right: false
};

closedPlayers = {
  bottom: Boolean(closedPlayers.bottom),
  right: Boolean(closedPlayers.right)
};

let rightPlayerWasOpened = false;
let profileData = JSON.parse(localStorage.getItem("nyamiProfile") || "null") || {
  name: "",
  handle: "@nyami",
  status: "",
  location: "",
  website: "",
  avatar: "猫",
  avatarImage: "",
  bio: "",
  about: "",
  vibe: "soft",
  banner: "hero",
  bannerImage: "",
  accent: "lavender"
};

let profileDraftAvatarImage = profileData.avatarImage || "";
let profileDraftBannerImage = profileData.bannerImage || "";

// Повертає перекладений рядок за ключем.
function t(key) {
  return i18n[currentLang][key] || i18n.uk[key] || key;
}

function saveLikes() {
  localStorage.setItem("nyamiLikedTracks", JSON.stringify(liked));
}

function isLiked(index) {
  return liked.includes(index);
}

// Показує коротке повідомлення внизу екрана.
function showToast(messageKey) {
  toast.textContent = t(messageKey);
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1500);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// Оновлює CSS-змінну --fill для красивої доріжки input[type="range"].
function setRangeFill(input) {
  if (!input) return;

  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value || 0);
  const percent = ((value - min) / (max - min)) * 100;

  input.style.setProperty("--fill", `${Math.max(0, Math.min(100, percent))}%`);
}

// Показує попередній час під час перетягування дорожки.
function previewProgress(value) {
  if (!audio.duration) return;

  const previewTime = (Number(value) / 100) * audio.duration;
  currentTimeText.textContent = formatTime(previewTime);
  bottomCurrentTimeText.textContent = formatTime(previewTime);
}

// Додає плавну поведінку drag / hover для всіх доріжок плеєра.
function initRangeInteractions() {
  playerRanges.forEach((input) => {
    setRangeFill(input);

    input.addEventListener("pointerdown", () => {
      input.classList.add("is-dragging");
      document.body.classList.add("player-scrubbing");
    });

    input.addEventListener("pointerup", () => {
      input.classList.remove("is-dragging");
      document.body.classList.remove("player-scrubbing");
    });

    input.addEventListener("pointercancel", () => {
      input.classList.remove("is-dragging");
      document.body.classList.remove("player-scrubbing");
    });

    input.addEventListener("input", () => {
      setRangeFill(input);

      if (input === nowProgress || input === bottomProgress) {
        previewProgress(input.value);
      }
    });
  });

  window.addEventListener("pointerup", () => {
    document.body.classList.remove("player-scrubbing");
    playerRanges.forEach((input) => input.classList.remove("is-dragging"));
  });
}

// Перемикає mute для гучності у нижньому плеєрі.






function updateHeadphoneIcon() {
  const button = document.getElementById("muteBtn");
  if (!button) return;

  const numericValue = Number(volumeInput?.value ?? Math.round((audio?.volume || 0) * 100));
  const isMuted = numericValue <= 0 || (audio && audio.volume <= 0);

  button.textContent = "";
  button.classList.toggle("is-muted", isMuted);
  button.setAttribute("aria-label", isMuted ? "Muted headphones" : "Headphones");
  button.setAttribute("title", isMuted ? "Muted headphones" : "Headphones");
}

function forceHeadphoneIcon() {
  updateHeadphoneIcon();
}

function keepVolumeIcon() {
  updateHeadphoneIcon();
}

function toggleMute() {
  if (audio.volume > 0) {
    previousVolume = audio.volume;
    audio.volume = 0;
    volumeInput.value = 0;
  } else {
    audio.volume = previousVolume || 0.7;
    volumeInput.value = Math.round(audio.volume * 100);
  }

  setRangeFill(volumeInput);
  updateHeadphoneIcon();
}

// Зберігає стан закритих плеєрів.

// Відкриває правий плеєр тільки після кліку по треку.
function openRightPlayerFromTrack() {
  rightPlayerWasOpened = true;
  closedPlayers.right = false;
  saveClosedPlayers();

  document.body.classList.remove("no-right-player", "hide-right-player");
  document.body.classList.add("right-player-open");

  applyPlayerVisibility();
  

keepVolumeIcon();
renderTopProfileAvatar();
}

function saveClosedPlayers() {
  localStorage.setItem("nyamiClosedPlayers", JSON.stringify(closedPlayers));
}

// Застосовує видимість окремих плеєрів до body.
function applyPlayerVisibility() {
  const bottomClosed = Boolean(closedPlayers.bottom);
  const rightClosed = Boolean(closedPlayers.right);

  document.body.classList.toggle("hide-bottom-player", bottomClosed);
  document.body.classList.toggle("hide-right-player", rightClosed);

  if (rightClosed) {
    rightPlayerWasOpened = false;
    document.body.classList.add("no-right-player");
    document.body.classList.remove("right-player-open");
  } else if (rightPlayerWasOpened) {
    document.body.classList.remove("no-right-player");
    document.body.classList.add("right-player-open");
  } else {
    document.body.classList.add("no-right-player");
    document.body.classList.remove("right-player-open");
  }

  const hasClosed = bottomClosed;

  if (playersRestore) {
    playersRestore.hidden = !hasClosed;
  }

  restorePlayerButtons.forEach((button) => {
    const key = button.dataset.restorePlayer;
    button.hidden = key === "right" || !Boolean(closedPlayers[key]);
  });

  renderTopProfileAvatar();
}

// Закриває або повертає конкретний плеєр.
function setPlayerClosed(player, isClosed) {
  if (!Object.prototype.hasOwnProperty.call(closedPlayers, player)) return;

  if (player === "right" && !isClosed) {
    rightPlayerWasOpened = true;
  }

  closedPlayers[player] = Boolean(isClosed);
  saveClosedPlayers();
  applyPlayerVisibility();
  showToast(isClosed ? "toast.playerClosed" : "toast.playerRestored");
}



// Оновлює весь інтерфейс після зміни мови.
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("nyamiLanguage", lang);
  document.documentElement.lang = lang;

  $$('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  $$('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  $$('[data-i18n-title]').forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });

  $$('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  $$('[data-i18n-alt]').forEach((element) => {
    element.alt = t(element.dataset.i18nAlt);
  });

  $$(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  tracksTitle.textContent = currentTitleKey ? t(currentTitleKey) : customTitleText;
  tracksSubtitle.textContent = currentSubtitleKey ? t(currentSubtitleKey) : customSubtitleText;
  updatePlayButtons();
  updateCurrentUI();
  updateProfileUI();
patchProfileMiniAvatar();
  renderUserPlaylists();
  keepVolumeIcon();
renderTopProfileAvatar();
renderTracks();
  renderSearchPopover();
}

function saveSearchHistory() {
  localStorage.setItem("nyamiSearchHistory", JSON.stringify(searchHistory));
}

function normalizeSearch(value) {
  return value.trim().toLowerCase();
}

function trackMatchesSearch(track, query) {
  if (!query) return true;

  const vibeLabel = t(`vibe.${track.vibe}`).toLowerCase();
  const categoryLabel = t(`mood.${track.category}.title`).toLowerCase();

  return (
    track.title.toLowerCase().includes(query) ||
    track.artist.toLowerCase().includes(query) ||
    track.vibe.toLowerCase().includes(query) ||
    track.category.toLowerCase().includes(query) ||
    vibeLabel.includes(query) ||
    categoryLabel.includes(query)
  );
}

function getSearchMatches(limit = 6) {
  const query = normalizeSearch(searchInput.value);
  const source = query ? tracks.filter((track) => trackMatchesSearch(track, query)) : tracks;

  return source.slice(0, limit).map((track) => ({
    ...track,
    realIndex: tracks.indexOf(track)
  }));
}

function showSearchPopover() {
  searchPopover.hidden = false;
  requestAnimationFrame(() => searchPopover.classList.add("open"));
  renderSearchPopover();
}

function hideSearchPopover() {
  searchPopover.classList.remove("open");
  window.setTimeout(() => {
    if (!searchPopover.classList.contains("open")) {
      searchPopover.hidden = true;
    }
  }, 180);
}

function addSearchHistory(value) {
  const query = value.trim();
  if (!query) return;

  searchHistory = [query, ...searchHistory.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 8);
  saveSearchHistory();
  renderSearchHistory();
}

function renderSearchHistory() {
  if (!searchHistoryList) return;

  if (searchHistory.length === 0) {
    searchHistoryBlock.classList.add("is-empty");
    searchHistoryList.innerHTML = `<span class="history-empty">${t("search.noHistory")}</span>`;
    return;
  }

  searchHistoryBlock.classList.remove("is-empty");
  searchHistoryList.innerHTML = "";

  searchHistory.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-chip";
    button.textContent = item;

    button.addEventListener("click", () => {
      searchInput.value = item;
      searchBox.classList.add("has-value");
      setView("search");
      renderTracks();
      showSearchPopover();
    });

    searchHistoryList.appendChild(button);
  });
}

function renderSearchPopover() {
  if (!searchPopover || !searchResultList) return;

  const query = normalizeSearch(searchInput.value);
  const matches = getSearchMatches(6);

  searchResultList.innerHTML = "";

  if (matches.length === 0) {
    searchResultList.innerHTML = `
      <div class="popover-empty">
        <b>${t("search.noResultsShort")}</b>
        <span>${t("tracks.empty")}</span>
      </div>
    `;
  } else {
    matches.forEach((track) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-result-item";
      button.innerHTML = `
        <img src="${track.cover}" alt="${track.title}">
        <span>
          <b>${track.title}</b>
          <small>${track.artist} • ${t(`vibe.${track.vibe}`)}</small>
        </span>
        <em>${track.duration}</em>
      `;

      button.addEventListener("click", () => {
        if (query) addSearchHistory(searchInput.value);
        currentIndex = track.realIndex;
        loadTrack(currentIndex);
        playTrack();
        hideSearchPopover();
        renderTracks();
      });

      searchResultList.appendChild(button);
    });
  }

  renderSearchHistory();
}

function submitSearch() {
  const query = searchInput.value.trim();
  if (query) addSearchHistory(query);

  const firstMatch = getSearchMatches(1)[0];

  if (firstMatch) {
    currentIndex = firstMatch.realIndex;
    loadTrack(currentIndex);
    playTrack();
  }

  setView("search");
  renderTracks();
  hideSearchPopover();
}

function getVisibleTracks() {
  const query = searchInput.value.trim().toLowerCase();

  return tracks
    .map((track, index) => ({ ...track, realIndex: index }))
    .filter((track) => {
      const matchesFilter = currentFilter === "all" || track.category === currentFilter || track.vibe === currentFilter;
      const matchesView = currentView !== "liked" || isLiked(track.realIndex);
      const matchesSearch = trackMatchesSearch(track, query);

      return matchesFilter && matchesSearch && matchesView;
    });
}


function clearLikedTracks() {
  liked = [];
  saveLikes();
  updateLikeButtons();
  renderTracks();
  showToast("toast.likesCleared");
}

function clearUserPlaylists() {
  userPlaylists = [];
  savePlaylists();
  renderUserPlaylists();
  renderTracks();
  showToast("toast.playlistsCleared");
}

function clearAllDemoData() {
  liked = [];
  userPlaylists = [];
  saveLikes();
  savePlaylists();
  renderUserPlaylists();
  updateLikeButtons();
  renderTracks();
  showToast("toast.demoCleared");
}

function renderSettingsView() {
  const profile = getProfileData();
  const isNight = document.body.classList.contains("night");
  const authLabel = authState?.isLoggedIn
    ? (authState.isGuest ? t("settings.guest") : t("settings.loggedIn"))
    : "—";

  trackList.innerHTML = `
    <div class="settings-view">
      <section class="settings-hero">
        <div class="settings-avatar ${profile.avatarImage ? "has-image" : ""}">
          ${avatarMarkup(profile)}
        </div>

        <div class="settings-copy">
          <span class="pill ghost">${t("settings.heroPill")}</span>
          <h2>${t("settings.pageTitle")}</h2>
          <p>${t("settings.heroDesc")}</p>
        </div>

        <div class="settings-hero-actions">
          <button type="button" data-settings-action="edit-profile">${t("settings.editProfile")}</button>
          <button type="button" data-settings-action="open-profile">${t("settings.openProfile")}</button>
        </div>
      </section>

      <section class="settings-grid">
        <div class="settings-card">
          <h3>${t("settings.account")}</h3>
          <div class="settings-list">
            <div class="settings-row">
              <span class="settings-row-icon">☻</span>
              <span class="settings-row-copy">
                <b>${escapeHtml(profile.name)}</b>
                <small>${escapeHtml(profile.handle)} · ${escapeHtml(profile.bio)}</small>
              </span>
              <div class="settings-row-actions">
                <button type="button" data-settings-action="edit-profile">${t("profile.editTitle")}</button>
              </div>
            </div>

            <div class="settings-row">
              <span class="settings-row-icon">↪</span>
              <span class="settings-row-copy">
                <b>${t("settings.authStatus")}: ${authLabel}</b>
                <small>${t("settings.authDesc")}</small>
              </span>
              <div class="settings-row-actions">
                <button type="button" data-settings-action="logout">${t("settings.logout")}</button>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-card">
          <h3>${t("settings.visual")}</h3>
          <div class="settings-list">
            <div class="settings-row">
              <span class="settings-row-icon">☾</span>
              <span class="settings-row-copy">
                <b>${t("settings.themeTitle")}</b>
                <small>${t("settings.themeDesc")}</small>
              </span>
              <div class="settings-row-actions">
                <button type="button" class="${isNight ? "" : "active"}" data-settings-action="theme-light">Light</button>
                <button type="button" class="${isNight ? "active" : ""}" data-settings-action="theme-night">Night</button>
              </div>
            </div>

            <div class="settings-row">
              <span class="settings-row-icon">UA</span>
              <span class="settings-row-copy">
                <b>${t("settings.languageTitle")}</b>
                <small>${t("settings.languageDesc")}</small>
              </span>
              <div class="settings-row-actions">
                <button type="button" class="${currentLang === "uk" ? "active" : ""}" data-settings-action="lang-uk">UA</button>
                <button type="button" class="${currentLang === "en" ? "active" : ""}" data-settings-action="lang-en">EN</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="settings-grid">
        <div class="settings-card">
          <h3>${t("settings.data")}</h3>
          <div class="settings-list">
            <div class="settings-row">
              <span class="settings-row-icon">♡</span>
              <span class="settings-row-copy">
                <b>${t("settings.localData")}</b>
                <small>${liked.length} likes · ${userPlaylists.length} playlists</small>
              </span>
              <div class="settings-row-actions">
                <button type="button" data-settings-action="library">${t("profile.settingLibrary")}</button>
              </div>
            </div>
          </div>
          <p class="settings-mini-note">${t("settings.note")}</p>
        </div>

        <div class="settings-card">
          <h3>${t("settings.data")}</h3>
          <div class="settings-data-actions">
            <button type="button" data-settings-action="clear-likes">${t("settings.clearLikes")}</button>
            <button type="button" data-settings-action="clear-playlists">${t("settings.clearPlaylists")}</button>
            <button class="danger" type="button" data-settings-action="clear-all">${t("settings.clearAll")}</button>
          </div>
        </div>
      </section>
    </div>
  `;

  trackList.querySelectorAll("[data-settings-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.settingsAction;

      if (action === "edit-profile") openProfileModal();
      if (action === "open-profile") setView("profile");
      if (action === "library") setView("library");
      if (action === "logout") logoutUser();
      if (action === "theme-light" && document.body.classList.contains("night")) toggleTheme();
      if (action === "theme-night" && !document.body.classList.contains("night")) toggleTheme();
      if (action === "lang-uk") animateLanguage("uk");
      if (action === "lang-en") animateLanguage("en");
      if (action === "clear-likes") clearLikedTracks();
      if (action === "clear-playlists") clearUserPlaylists();
      if (action === "clear-all") clearAllDemoData();
    });
  });
}


function renderTracks() {
  tracksPanel.classList.toggle("library-mode", currentView === "library");

  if (currentView === "library") {
    renderLibraryView();
    return;
  }

  const visibleTracks = getVisibleTracks();
  trackList.innerHTML = "";

  if (visibleTracks.length === 0) {
    trackList.innerHTML = `<div class="empty-state">${t("tracks.empty")}</div>`;
    return;
  }

  visibleTracks.forEach((track, visualIndex) => {
    const row = document.createElement("div");
    row.className = `track-row${track.source === "server-v48" ? " server-track-row-v52" : ""}${track.sourceType === "direct" ? " direct-track-row-v53" : ""}`;
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");

    if (track.realIndex === currentIndex) {
      row.classList.add("active");
    }

    row.innerHTML = `
      <span class="track-number">${visualIndex + 1}</span>
      <span class="track-info">
        <img src="${track.cover}" alt="${track.title}">
        <span>
          <b>${track.title}</b>
          <small>${track.artist}${track.sourceLabel ? ` · ${track.sourceLabel}` : ""}</small>
        </span>
      </span>
      <span>${track.artist}</span>
      <span>${t(`vibe.${track.vibe}`)}</span>
      <span>${track.duration}</span>
      <span>
        <button class="track-like" type="button" title="${t("buttons.like")}">${isLiked(track.realIndex) ? "♥" : "♡"}</button>
        <button class="track-more" type="button" title="${t("buttons.queue")}">⋯</button>
      </span>
    `;

    const chooseTrack = () => {
      currentIndex = track.realIndex;
      loadTrack(currentIndex);
      playTrack();
      renderTracks();
    };

    row.addEventListener("click", chooseTrack);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        chooseTrack();
      }
    });

    row.querySelector(".track-like").addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLike(track.realIndex);
    });

    row.querySelector(".track-more").addEventListener("click", (event) => {
      openTrackMenu(event, track.realIndex);
    });

    trackList.appendChild(row);
  });
}

// Ховає меню треку.
function closeTrackMenu() {
  if (!trackMenu) return;

  trackMenu.classList.remove("open");
  $$(".track-row.menu-open").forEach((row) => row.classList.remove("menu-open"));

  window.setTimeout(() => {
    if (!trackMenu.classList.contains("open")) {
      trackMenu.hidden = true;
      trackMenu.innerHTML = "";
    }
  }, 160);
}

// Перевіряє, чи трек уже є в конкретному плейлисті.
function playlistHasTrack(playlist, trackIndex) {
  return Array.isArray(playlist.trackIds) && playlist.trackIds.includes(trackIndex);
}

// Додає трек у користувацький плейлист.
function addTrackToPlaylist(playlistId, trackIndex) {
  const playlist = userPlaylists.find((item) => String(item.id) === String(playlistId));
  if (!playlist) return;

  if (!Array.isArray(playlist.trackIds)) {
    playlist.trackIds = [];
  }

  if (playlist.trackIds.includes(trackIndex)) {
    showToast("toast.alreadyInPlaylist");
    return;
  }

  playlist.trackIds.push(trackIndex);
  savePlaylists();
  renderUserPlaylists();

  if (activePlaylist && String(activePlaylist.id) === String(playlist.id)) {
    activePlaylist = { ...playlist, kind: "custom" };
    renderTracks();
  }

  showToast("toast.addedToPlaylist");
}

// Прибирає трек з активного користувацького плейлиста.
function removeTrackFromActivePlaylist(trackIndex) {
  if (!activePlaylist || activePlaylist.kind !== "custom") return;

  const playlist = userPlaylists.find((item) => String(item.id) === String(activePlaylist.id));
  if (!playlist || !Array.isArray(playlist.trackIds)) return;

  playlist.trackIds = playlist.trackIds.filter((id) => id !== trackIndex);
  activePlaylist = { ...playlist, kind: "custom" };

  savePlaylists();
  renderUserPlaylists();
  renderTracks();
  closeTrackMenu();
  showToast("toast.removedFromPlaylist");
}

// Додає трек у чергу, щоб він зіграв наступним.
function addTrackToNextQueue(trackIndex) {
  nextQueue = nextQueue.filter((id) => id !== trackIndex);
  nextQueue.unshift(trackIndex);
  closeTrackMenu();
  showToast("toast.playNext");
}

// Формує HTML для меню конкретного треку.
function renderTrackMenu(trackIndex) {
  const track = tracks[trackIndex];
  if (!track || !trackMenu) return;

  const isCurrentPlaylistCustom = currentView === "playlist" && activePlaylist && activePlaylist.kind === "custom";
  const canRemove = isCurrentPlaylistCustom && playlistHasTrack(activePlaylist, trackIndex);

  const playlistButtons = userPlaylists.length
    ? userPlaylists.map((playlist) => {
        const added = playlistHasTrack(playlist, trackIndex);
        return `
          <button
            class="playlist-action-btn ${added ? "is-added" : ""}"
            type="button"
            data-playlist-id="${playlist.id}"
            data-action="add-to-playlist"
          >
            <span>${added ? "✓" : "+"}</span>
            <b>${added ? t("trackMenu.added") : playlist.name}</b>
          </button>
        `;
      }).join("")
    : `<span class="track-menu-empty">${t("trackMenu.noPlaylists")}</span>`;

  trackMenu.innerHTML = `
    <div class="track-menu-head">
      <img src="${track.cover}" alt="${track.title}">
      <div>
        <b>${track.title}</b>
        <small>${track.artist} • ${t(`vibe.${track.vibe}`)}</small>
      </div>
    </div>

    <div class="track-menu-scroll">
      <div class="track-menu-section">
        <span class="track-menu-label">${t("trackMenu.mainActions")}</span>

        <button class="track-action-btn" type="button" data-action="play-next">
          <span>⏭</span>
          <b>${t("trackMenu.playNext")}</b>
        </button>

        <button class="track-action-btn" type="button" data-action="toggle-like">
          <span>${isLiked(trackIndex) ? "♥" : "♡"}</span>
          <b>${isLiked(trackIndex) ? t("trackMenu.unlike") : t("trackMenu.like")}</b>
        </button>

        ${canRemove ? `
          <button class="track-action-btn danger" type="button" data-action="remove-from-playlist">
            <span>−</span>
            <b>${t("trackMenu.removeFromPlaylist")}</b>
          </button>
        ` : ""}
      </div>

      <div class="track-menu-section">
        <span class="track-menu-label">${t("trackMenu.addToPlaylist")}</span>
        ${playlistButtons}

        <button class="track-action-btn" type="button" data-action="create-playlist">
          <span>＋</span>
          <b>${t("trackMenu.createPlaylist")}</b>
        </button>
      </div>
    </div>
  `;
}

// Відкриває меню треку біля кнопки ⋯.
function openTrackMenu(event, trackIndex) {
  event.stopPropagation();

  menuTrackIndex = trackIndex;
  renderTrackMenu(trackIndex);

  const rect = event.currentTarget.getBoundingClientRect();
  const menuWidth = 340;
  const padding = 14;

  let left = rect.right - menuWidth;
  let top = rect.bottom + 8;

  left = Math.max(padding, Math.min(left, window.innerWidth - menuWidth - padding));

  trackMenu.hidden = false;
  trackMenu.style.left = `${left}px`;
  trackMenu.style.top = `${top}px`;

  requestAnimationFrame(() => {
    trackMenu.classList.add("open");
  });

  $$(".track-row.menu-open").forEach((row) => row.classList.remove("menu-open"));
  event.currentTarget.closest(".track-row")?.classList.add("menu-open");
}

// Обробляє кліки всередині меню треку.
function handleTrackMenuClick(event) {
  const button = event.target.closest("button");
  if (!button || menuTrackIndex === null) return;

  const action = button.dataset.action;

  if (action === "play-next") {
    addTrackToNextQueue(menuTrackIndex);
  }

  if (action === "toggle-like") {
    toggleLike(menuTrackIndex);
    closeTrackMenu();
  }

  if (action === "remove-from-playlist") {
    removeTrackFromActivePlaylist(menuTrackIndex);
  }

  if (action === "add-to-playlist") {
    addTrackToPlaylist(button.dataset.playlistId, menuTrackIndex);
    renderTrackMenu(menuTrackIndex);
  }

  if (action === "create-playlist") {
    closeTrackMenu();
    openPlaylistModal();
  }
}

function updateCurrentUI() {
  const track = tracks[currentIndex];
  const heart = isLiked(currentIndex) ? "♥" : "♡";

  nowCover.src = track.cover;
  nowTitle.textContent = track.title;
  nowArtist.textContent = track.artist;

  bottomCover.src = track.cover;
  bottomTitle.textContent = track.title;
  bottomArtist.textContent = track.artist;


  rightLikeBtn.textContent = heart;
  bottomLikeBtn.textContent = heart;
  heroLikeBtn.textContent = heart;

  document.title = `${track.title} — ${t("meta.title")}`;
}

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.file;
  audio.load();
  updateCurrentUI();
}

async function playTrack() {
  try {
    await audio.play();
    isPlaying = true;
    updatePlayButtons();
  } catch (error) {
    showToast("toast.autoplayBlocked");
  }
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  updatePlayButtons();
}

function togglePlay() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function updatePlayButtons() {
  const symbol = isPlaying ? "⏸" : "▶";
  playBtn.textContent = symbol;
  bottomPlayBtn.textContent = symbol;
  heroPlayBtn.textContent = isPlaying ? t("hero.playing") : t("hero.listen");
  wave.classList.toggle("is-playing", isPlaying);
  document.body.classList.toggle("is-playing", isPlaying);
  if (bottomShuffleBtn) bottomShuffleBtn.classList.toggle("active", isShuffle);
  if (bottomRepeatBtn) bottomRepeatBtn.classList.toggle("active", isRepeat);
}

function nextTrack() {
  if (nextQueue.length > 0) {
    currentIndex = nextQueue.shift();
  } else if (isShuffle) {
    currentIndex = Math.floor(Math.random() * tracks.length);
  } else {
    currentIndex = (currentIndex + 1) % tracks.length;
  }

  loadTrack(currentIndex);
  playTrack();
  renderTracks();
}

function prevTrack() {
  currentIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
  loadTrack(currentIndex);
  playTrack();
  renderTracks();
}

function randomTrack() {
  let next = Math.floor(Math.random() * tracks.length);
  if (tracks.length > 1 && next === currentIndex) {
    next = (next + 1) % tracks.length;
  }

  currentIndex = next;
  loadTrack(currentIndex);
  playTrack();
  renderTracks();
}

function toggleLike(index = currentIndex) {
  if (isLiked(index)) {
    liked = liked.filter((id) => id !== index);
    showToast("toast.likeRemoved");
  } else {
    liked.push(index);
    showToast("toast.likeAdded");
  }

  saveLikes();
  updateCurrentUI();
  renderTracks();
}

function updateProgress() {
  const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  nowProgress.value = progress;
  bottomProgress.value = progress;
  setRangeFill(nowProgress);
  setRangeFill(bottomProgress);
  currentTimeText.textContent = formatTime(audio.currentTime);
  durationTimeText.textContent = formatTime(audio.duration);
  bottomCurrentTimeText.textContent = formatTime(audio.currentTime);
  bottomDurationTimeText.textContent = formatTime(audio.duration);
}

function setProgress(value) {
  if (!audio.duration) return;
  audio.currentTime = (Number(value) / 100) * audio.duration;
  setRangeFill(nowProgress);
  setRangeFill(bottomProgress);
}

function setFilter(filter, titleKey = "tracks.defaultTitle", subtitleKey = "tracks.filteredSubtitle") {
  currentView = "home";
  customTitleText = "";
  customSubtitleText = "";
  updateActiveNav("home");
  currentFilter = filter;
  currentTitleKey = titleKey;
  currentSubtitleKey = filter === "all" ? "tracks.defaultSubtitle" : subtitleKey;
  tracksTitle.textContent = t(currentTitleKey);
  tracksSubtitle.textContent = t(currentSubtitleKey);
  renderTracks();
}

function savePlaylists() {
  localStorage.setItem("nyamiUserPlaylists", JSON.stringify(userPlaylists));
}

function coverForFilter(filter) {
  const covers = {
    all: "assets/covers/hero.jpg",
    new: "assets/covers/cover3.jpg",
    alt: "assets/covers/cover2.jpg",
    sleep: "assets/covers/cover4.jpg",
    night: "assets/covers/playlist1.jpg"
  };

  return covers[filter] || covers.all;
}

// Оновлює кастомний вибір настрою в модальному вікні.
function updatePlaylistMoodPicker(value = "all") {
  if (!playlistMoodSelect) return;

  playlistMoodSelect.value = value;

  playlistMoodButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.playlistMood === value);
  });

  if (modalPreviewImage) {
    modalPreviewImage.src = coverForFilter(value);
  }
}

function transitionContent(callback) {
  document.body.classList.add("view-changing");
  window.setTimeout(() => {
    callback();
    window.setTimeout(() => document.body.classList.remove("view-changing"), 180);
  }, 110);
}


function patchProfileMiniAvatar() {
  renderTopProfileAvatar();
}

function refreshAfterUiSwitch() {
  try {
    updateThemeButtons();
    updatePlayButtons();
    updateCurrentUI();
    updateProfileUI();
    applyPlayerVisibility();
    renderTopProfileAvatar();
    renderProfileDropdown();
    keepVolumeIcon();

    if (currentView === "settings" || currentView === "profile" || currentView === "library" || currentView === "playlist" || currentView === "liked" || currentView === "search") {
      renderTracks();
    }

    renderSearchPopover();
  } catch (error) {
    console.warn("Safe UI refresh skipped:", error);
  }
}

function animateLanguage(lang) {
  if (lang === currentLang || isLanguageSwitching) return;

  isLanguageSwitching = true;
  document.body.classList.remove("language-in");
  document.body.classList.add("language-out", "language-changing");

  window.setTimeout(() => {
    try {
      applyLanguage(lang);
      refreshAfterUiSwitch();
    } catch (error) {
      console.error("Language switch failed:", error);
    }

    document.body.classList.remove("language-out");
    document.body.classList.add("language-in");

    window.setTimeout(() => {
      document.body.classList.remove("language-in", "language-changing");
      isLanguageSwitching = false;
    }, 280);
  }, 170);
}

function updateThemeButtons() {
  const isNight = document.body.classList.contains("night");
  const icon = isNight ? "☀" : "☾";
  const active = isNight;
  const themeBtn = $("#themeBtn");

  if (themeBtn) {
    themeBtn.textContent = icon;
    themeBtn.classList.toggle("active", active);
  }

  if (sideThemeBtn) {
    sideThemeBtn.textContent = icon;
    sideThemeBtn.classList.toggle("active", active);
  }
}

// Плавно перемикає світлу / нічну тему.
function toggleTheme() {
  if (isThemeSwitching) return;

  isThemeSwitching = true;
  const willBeNight = !document.body.classList.contains("night");
  const themeBtn = $("#themeBtn");

  document.body.classList.add("theme-changing", "theme-soft-switch");
  themeBtn?.classList.add("theme-active");
  sideThemeBtn?.classList.add("theme-active");

  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      try {
        document.body.classList.toggle("night", willBeNight);
        localStorage.setItem("nyamiTheme", willBeNight ? "night" : "light");

        if (typeof updatePlaylistMoodPicker === "function" && playlistMoodSelect) {
          updatePlaylistMoodPicker(playlistMoodSelect.value || "all");
        }

        refreshAfterUiSwitch();
        renderTopProfileAvatar();
        renderProfileDropdown();
        keepVolumeIcon();
        showToast(willBeNight ? "toast.themeNight" : "toast.themeLight");
      } catch (error) {
        console.error("Theme switch failed:", error);
      }
    }, 130);
  });

  window.setTimeout(() => {
    document.body.classList.remove("theme-changing", "theme-soft-switch");
    themeBtn?.classList.remove("theme-active");
    sideThemeBtn?.classList.remove("theme-active");
    isThemeSwitching = false;
    applyPlayerVisibility();
    renderTopProfileAvatar();
    keepVolumeIcon();
  }, 860);
}

function updateActiveNav(view) {
  $$(".nav-item").forEach((nav) => {
    nav.classList.toggle("active", nav.dataset.view === view);
  });
}

// Безпечно екранує текст користувача для вставки в HTML.
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Повертає дані профілю з урахуванням поточної мови.
function getProfileData() {
  return {
    name: profileData.name || t("profile.name"),
    handle: profileData.handle || "@nyami",
    status: profileData.status || "",
    location: profileData.location || "",
    website: profileData.website || "",
    avatar: profileData.avatar || "猫",
    avatarImage: profileData.avatarImage || "",
    bio: profileData.bio || t("profile.bio"),
    about: profileData.about || "",
    vibe: profileData.vibe || "soft",
    banner: profileData.banner || "hero",
    bannerImage: profileData.bannerImage || "",
    accent: profileData.accent || "lavender"
  };
}

// Повертає шлях до обкладинки профілю за ключем.
function profileBannerUrl(key) {
  const banners = {
    hero: "assets/covers/hero.jpg",
    nowplaying: "assets/covers/nowplaying.jpg",
    playlist1: "assets/covers/playlist1.jpg",
    playlist2: "assets/covers/playlist2.jpg"
  };

  return banners[key] || banners.hero;
}

// Повертає реальний фон профілю: власне фото або пресет.
function profileBannerSource(profile = getProfileData()) {
  return profile.bannerImage || profileBannerUrl(profile.banner);
}

// Повертає колір accent за ключем.
function profileAccentColor(key) {
  const colors = {
    lavender: "#c79bff",
    rose: "#ff9fc7",
    blue: "#8fb7ff",
    mint: "#7edfc4"
  };

  return colors[key] || colors.lavender;
}

// Повертає назву вайбу для профілю.
function profileVibeLabel(key) {
  const map = {
    soft: t("profile.vibeSoft"),
    alt: t("profile.vibeAlt"),
    night: t("profile.vibeNight"),
    sleep: t("profile.vibeSleep")
  };

  return map[key] || map.soft;
}

// Нормалізує посилання, щоб воно було клікабельним.
function normalizeProfileUrl(value = "") {
  const clean = value.trim();
  if (!clean) return "";

  if (/^https?:\/\//i.test(clean)) return clean;
  return `https://${clean}`;
}

// Рендерить аватар: власне фото або emoji.
function avatarMarkup(profile = getProfileData()) {
  if (profile.avatarImage) {
    return `<img src="${profile.avatarImage}" alt="${escapeHtml(profile.name)}">`;
  }

  return escapeHtml(profile.avatar);
}

// Застосовує avatar markup у DOM-елемент.
function setAvatarElement(element, profile = getProfileData()) {
  if (!element) return;

  element.classList.toggle("has-image", Boolean(profile.avatarImage));
  element.innerHTML = avatarMarkup(profile);
}

// Стискає фото перед збереженням у localStorage.
function resizeImageFile(file, maxSize = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("image-only"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      image.onerror = reject;
      image.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Зберігає профіль користувача у localStorage.
function saveProfileData() {
  localStorage.setItem("nyamiProfile", JSON.stringify(profileData));
}

// Оновлює всі маленькі відображення профілю в інтерфейсі.

// Оновлює маленький аватар у верхньому чіпі профілю.
function setMiniAvatarElement(element, profile = getProfileData()) {
  if (!element) return;

  const image = profile?.avatarImage || "";
  const fallback = profile?.avatar || "猫";

  element.style.visibility = "visible";
  element.style.opacity = "1";
  element.classList.toggle("has-image", Boolean(image));

  if (image) {
    const current = element.querySelector("img")?.getAttribute("src") || "";
    if (current === image) return;

    element.innerHTML = "";
    const img = document.createElement("img");
    img.src = image;
    img.alt = profile?.name || "profile";
    img.loading = "eager";
    img.decoding = "async";
    element.appendChild(img);
    return;
  }

  element.innerHTML = "";
  element.textContent = fallback;
}


// Оновлює фото у верхньому чіпі біля імені.

function forceTopbarAvatar() {
  const profile = getProfileData();
  const image = profile.avatarImage || "";
  const fallback = profile.avatar || "猫";

  const targets = [
    document.getElementById("profileChipAvatar"),
    document.querySelector("#profileOpenBtn .profile-avatar"),
    document.querySelector("#profileOpenBtn .avatar-mini")
  ].filter(Boolean);

  targets.forEach((avatar) => {
    if (!avatar.id) avatar.id = "profileChipAvatar";

    avatar.style.visibility = "visible";
    avatar.style.opacity = "1";
    avatar.classList.add("avatar-mini");
    avatar.classList.toggle("has-image", Boolean(image));

    if (image) {
      const current = avatar.querySelector("img")?.getAttribute("src") || "";
      if (current === image) return;

      avatar.innerHTML = "";
      const img = document.createElement("img");
      img.src = image;
      img.alt = profile.name || "profile";
      img.loading = "eager";
      img.decoding = "async";
      avatar.appendChild(img);
      return;
    }

    avatar.innerHTML = "";
    avatar.textContent = fallback;
  });
}

function renderTopProfileAvatar() {
  forceTopbarAvatar();
}


// Оновлює дані у випадаючому меню профілю.

// v44: повна авторизація через Python backend + SQLite.
const AUTH_TOKEN_KEY = "nyamiBackendToken";
const AUTH_STATE_KEY = "nyamiAuth";
const API_BASE = "";

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function saveAuthState() {
  localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || payload.ok === false) {
    const error = new Error(payload.message || "API error");
    error.code = payload.error || "API_ERROR";
    error.status = response.status;
    throw error;
  }

  return payload;
}

function mapAuthError(error) {
  const code = error?.code || "";

  if (code === "USER_EXISTS") return "auth.error.exists";
  if (code === "USER_NOT_FOUND") return "auth.error.notFound";
  if (code === "BAD_PASSWORD") return "auth.error.badPassword";
  if (code === "PASSWORD_MISMATCH") return "auth.error.confirm";
  if (code === "PASSWORD_SHORT") return "auth.error.password";
  if (code === "NAME_SHORT") return "auth.error.name";
  if (code === "LOGIN_EMPTY") return "auth.error.login";
  if (code === "USER_EXISTS") return "auth.error.exists";

  if (error instanceof TypeError || error?.message?.includes("fetch")) {
    return "auth.error.backend";
  }

  return "auth.error.general";
}

function setAuthError(messageKey = "") {
  if (authErrorText) {
    authErrorText.textContent = messageKey ? t(messageKey) : "";
  }
}

function clearAuthFieldErrors() {
  [authNameInput, authEmailInput, authPasswordInput, authConfirmPasswordInput].forEach((input) => {
    input?.classList.remove("invalid");
  });
  setAuthError("");
}

function validateAuthForm() {
  clearAuthFieldErrors();

  const name = authNameInput?.value.trim() || "";
  const login = authEmailInput?.value.trim() || "";
  const password = authPasswordInput?.value || "";
  const confirm = authConfirmPasswordInput?.value || "";

  if (authMode === "register" && name.length < 2) {
    authNameInput?.classList.add("invalid");
    setAuthError("auth.error.name");
    return false;
  }

  if (!login) {
    authEmailInput?.classList.add("invalid");
    setAuthError("auth.error.login");
    return false;
  }

  if (password.length < 6) {
    authPasswordInput?.classList.add("invalid");
    setAuthError("auth.error.password");
    return false;
  }

  if (authMode === "register" && password !== confirm) {
    authConfirmPasswordInput?.classList.add("invalid");
    setAuthError("auth.error.confirm");
    return false;
  }

  return true;
}

function applyAuthUser(payload) {
  const user = payload?.user || {};
  const profile = user.profile || {};

  authState = {
    isLoggedIn: true,
    isGuest: Boolean(payload?.isGuest),
    userId: user.id,
    name: user.name || profile.name || "User",
    handle: user.handle || profile.handle || "@user"
  };

  saveAuthState();

  const mergedProfile = {
    ...getProfileData(),
    ...profile,
    name: authState.name,
    handle: authState.handle
  };

  localStorage.setItem("nyamiProfile", JSON.stringify(mergedProfile));
  updateProfileUI();
  renderTopProfileAvatar();
  renderProfileDropdown?.();
}

async function hydrateAuthFromSession() {
  const token = getAuthToken();

  if (!token) {
    authState = {
      isLoggedIn: false,
      isGuest: false,
      name: "",
      handle: ""
    };
    saveAuthState();
    applyAuthState();
    return;
  }

  try {
    const payload = await apiRequest("/api/auth/me", { method: "GET" });

    if (!payload.authenticated) {
      setAuthToken("");
      authState = {
        isLoggedIn: false,
        isGuest: false,
        name: "",
        handle: ""
      };
      saveAuthState();
      applyAuthState();
      return;
    }

    applyAuthUser(payload);
    applyAuthState();
  } catch (error) {
    console.error("Session check failed:", error);
    setAuthToken("");
    authState = {
      isLoggedIn: false,
      isGuest: false,
      name: "",
      handle: ""
    };
    saveAuthState();
    applyAuthState();
  }
}

function applyAuthState() {
  const requiresAuth = !authState?.isLoggedIn;
  document.body.classList.toggle("auth-required", requiresAuth);

  if (authScreen) {
    authScreen.setAttribute("aria-hidden", requiresAuth ? "false" : "true");
  }

  if (requiresAuth) {
    setAuthMode(authMode || "login");
  }

  renderTopProfileAvatar();
  renderProfileDropdown?.();
}

function setAuthMode(mode) {
  authMode = mode === "register" ? "register" : "login";
  document.body.classList.toggle("auth-login-mode", authMode === "login");

  authModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === authMode);
  });

  if (authSubmitBtn) {
    authSubmitBtn.textContent = t(authMode === "register" ? "auth.registerBtn" : "auth.loginBtn");
    authSubmitBtn.classList.remove("is-loading");
  }

  if (authPasswordInput) {
    authPasswordInput.autocomplete = authMode === "register" ? "new-password" : "current-password";
  }

  clearAuthFieldErrors();
}

function applyAuthProfileData(name, handle, savedProfile = {}) {
  const profile = {
    ...getProfileData(),
    ...savedProfile,
    name: name || savedProfile.name || getProfileData().name || "User",
    handle: handle || savedProfile.handle || getProfileData().handle || "@user"
  };

  localStorage.setItem("nyamiProfile", JSON.stringify(profile));
  updateProfileUI();
  renderTopProfileAvatar();
  renderProfileDropdown?.();
}

async function registerUser() {
  const payload = await apiRequest("/api/auth/register", {
    method: "POST",
    body: {
      name: authNameInput?.value.trim() || "",
      login: authEmailInput?.value.trim() || "",
      password: authPasswordInput?.value || "",
      confirmPassword: authConfirmPasswordInput?.value || "",
      profile: getProfileData()
    }
  });

  setAuthToken(payload.token);
  applyAuthUser(payload);
  applyAuthState();
  showToast("toast.registerSuccess");
}

async function loginUser() {
  const payload = await apiRequest("/api/auth/login", {
    method: "POST",
    body: {
      login: authEmailInput?.value.trim() || "",
      password: authPasswordInput?.value || ""
    }
  });

  setAuthToken(payload.token);
  applyAuthUser(payload);
  applyAuthState();
  showToast("toast.loginSuccess");
}

async function submitAuth(event) {
  event.preventDefault();

  if (!validateAuthForm()) return;

  try {
    authSubmitBtn?.classList.add("is-loading");
    if (authSubmitBtn) authSubmitBtn.textContent = t("auth.loading");

    if (authMode === "register") {
      await registerUser();
    } else {
      await loginUser();
    }
  } catch (error) {
    console.error("Auth failed:", error);
    const key = mapAuthError(error);
    setAuthError(key);
    showToast(key);
  } finally {
    authSubmitBtn?.classList.remove("is-loading");
    if (authSubmitBtn) {
      authSubmitBtn.textContent = t(authMode === "register" ? "auth.registerBtn" : "auth.loginBtn");
    }
  }
}

async function continueAsGuest() {
  try {
    const payload = await apiRequest("/api/auth/guest", {
      method: "POST",
      body: {}
    });

    setAuthToken(payload.token);
    applyAuthUser(payload);
    applyAuthState();
    showToast("toast.loginSuccess");
  } catch (error) {
    console.error("Guest auth failed:", error);
    const key = mapAuthError(error);
    setAuthError(key);
    showToast(key);
  }
}

async function logoutUser() {
  try {
    await apiRequest("/api/auth/logout", {
      method: "POST",
      body: {}
    });
  } catch (error) {
    console.warn("Logout API failed:", error);
  }

  setAuthToken("");
  authState = {
    isLoggedIn: false,
    isGuest: false,
    name: "",
    handle: ""
  };

  saveAuthState();
  closeProfileDropdown?.();
  applyAuthState();
  setAuthMode("login");
  showToast("toast.logoutSuccess");
}

async function syncCurrentProfileToAuthUser() {
  if (!authState?.isLoggedIn || authState.isGuest || !getAuthToken()) return;

  try {
    const payload = await apiRequest("/api/profile", {
      method: "PUT",
      body: {
        profile: getProfileData()
      }
    });

    if (payload?.profile) {
      applyAuthProfileData(payload.profile.name, payload.profile.handle, payload.profile);
    }

    showToast("toast.profileSynced");
  } catch (error) {
    console.warn("Profile sync failed:", error);
  }
}

function renderProfileDropdown() {
  if (!profileDropdown) return;

  const profile = getProfileData();

  if (profileDropdownName) profileDropdownName.textContent = profile.name;
  if (profileDropdownHandle) profileDropdownHandle.textContent = profile.handle;

  setMiniAvatarElement(profileDropdownAvatar, profile);
}

// Відкриває меню профілю.
function openProfileDropdown() {
  if (!profileDropdown || !profileOpenBtn) return;

  renderProfileDropdown();
  profileDropdown.classList.add("open");
  profileDropdown.setAttribute("aria-hidden", "false");
  profileOpenBtn.setAttribute("aria-expanded", "true");
  renderTopProfileAvatar();
}

// Закриває меню профілю.
function closeProfileDropdown() {
  if (!profileDropdown || !profileOpenBtn) return;

  profileDropdown.classList.remove("open");
  profileDropdown.setAttribute("aria-hidden", "true");
  profileOpenBtn.setAttribute("aria-expanded", "false");
  renderTopProfileAvatar();
}

// Перемикає меню профілю.
function toggleProfileDropdown() {
  if (!profileDropdown) return;

  if (profileDropdown.classList.contains("open")) {
    closeProfileDropdown();
  } else {
    openProfileDropdown();
  }
}

// Перехід до налаштувань у профілі.
function openProfileSettingsSection() {
  setView("profile");

  requestAnimationFrame(() => {
    const settings = document.querySelector(".profile-settings");
    if (settings) {
      settings.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      mainPanel?.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// Обробляє дії меню профілю.
function handleProfileDropdownAction(action) {
  closeProfileDropdown();

  if (action === "profile") {
    setView("profile");
    requestAnimationFrame(() => mainPanel?.scrollTo({ top: 0, behavior: "smooth" }));
    return;
  }

  if (action === "edit") {
    openProfileModal();
    return;
  }

  if (action === "library") {
    setView("library");
    return;
  }

  if (action === "settings") {
    setView("settings");
    return;
  }

  if (action === "theme") {
    toggleTheme();
    return;
  }

  if (action === "language") {
    animateLanguage(currentLang === "uk" ? "en" : "uk");
    return;
  }

  if (action === "logout") {
    logoutUser();
  }
}


function updateProfileUI() {
  forceTopbarAvatar();
  const profile = getProfileData();

  if (profileChipName) profileChipName.textContent = profile.name;

  $$(".profile-avatar").forEach((element) => {
    setAvatarElement(element, profile);
  });

  document.documentElement.style.setProperty("--profile-banner", `url("${profileBannerSource(profile)}")`);
  document.documentElement.style.setProperty("--profile-accent", profileAccentColor(profile.accent));
  document.documentElement.style.setProperty("--profile-accent-soft", `${profileAccentColor(profile.accent)}2b`);

  if (profileEditAvatarPreview) setAvatarElement(profileEditAvatarPreview, {
    ...profile,
    avatarImage: profileDraftAvatarImage
  });
  if (profileEditNamePreview) profileEditNamePreview.textContent = profile.name;
  if (profileEditBioPreview) profileEditBioPreview.textContent = profile.bio;
  renderTopProfileAvatar();
  renderProfileDropdown();
}

// Відкриває модальне вікно редагування профілю.
function openProfileModal() {
  document.body.classList.add("profile-editing-active");
  const profile = getProfileData();

  profileNameInput.value = profile.name;
  profileHandleInput.value = profile.handle;
  profileStatusInput.value = profile.status;
  profileLocationInput.value = profile.location;
  profileWebsiteInput.value = profile.website;
  profileAvatarInput.value = profile.avatar;
  profileBioInput.value = profile.bio;
  profileAboutInput.value = profile.about;
  profileVibeInput.value = profile.vibe;
  profileBannerInput.value = profile.banner;
  profileAccentInput.value = profile.accent;
  profileDraftAvatarImage = profile.avatarImage;
  profileDraftBannerImage = profile.bannerImage;
  updateProfilePresetButtons();

  updateProfileEditPreview();

  profileModal.classList.add("open");
  profileModal.setAttribute("aria-hidden", "false");
  profileNameInput.focus();
}

// Закриває модальне вікно редагування профілю.
function closeProfileModalWindow() {
  document.body.classList.remove("profile-editing-active");
  profileModal.classList.remove("open");
  profileModal.setAttribute("aria-hidden", "true");
}

// Оновлює preview всередині модального вікна профілю.
function updateProfilePresetButtons() {
  const avatar = profileAvatarInput.value.trim() || "猫";
  const vibe = profileVibeInput.value || "soft";
  const banner = profileBannerInput.value || "hero";
  const accent = profileAccentInput.value || "lavender";

  profileAvatarPresetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.avatarPreset === avatar && !profileDraftAvatarImage);
  });

  profileVibePresetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.profileVibe === vibe);
  });

  profileBannerPresetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.profileBanner === banner && !profileDraftBannerImage);
  });

  profileAccentPresetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.profileAccent === accent);
  });
}

function updateProfileEditPreview() {
  const name = profileNameInput.value.trim() || t("profile.name");
  const handle = profileHandleInput.value.trim() || "@nyami";
  const avatar = profileAvatarInput.value.trim() || "猫";
  const bio = profileBioInput.value.trim() || t("profile.bio");
  const status = profileStatusInput.value.trim();

  setAvatarElement(profileEditAvatarPreview, {
    name,
    avatar,
    avatarImage: profileDraftAvatarImage
  });

  profileEditNamePreview.textContent = name;
  profileEditBioPreview.innerHTML = `
    <span class="profile-edit-handle">${escapeHtml(handle)}</span>
    <small>${escapeHtml(status || bio)}</small>
  `;

  updateProfilePresetButtons();
}

// Завантажує власне фото в draft профілю.
async function handleProfileImageUpload(file, type) {
  try {
    const dataUrl = await resizeImageFile(file, type === "avatar" ? 520 : 1500, type === "avatar" ? 0.86 : 0.78);

    if (type === "avatar") {
      profileDraftAvatarImage = dataUrl;
    }

    if (type === "banner") {
      profileDraftBannerImage = dataUrl;
    }

    updateProfileEditPreview();
    showToast("toast.imageLoaded");
  } catch (error) {
    showToast("toast.imageOnly");
  }
}


// Зберігає дані з модального вікна профілю.
function saveProfileFromModal() {
  profileData = {
    name: profileNameInput.value.trim() || t("profile.name"),
    handle: profileHandleInput.value.trim() || "@nyami",
    status: profileStatusInput.value.trim(),
    location: profileLocationInput.value.trim(),
    website: profileWebsiteInput.value.trim(),
    avatar: profileAvatarInput.value.trim() || "猫",
    avatarImage: profileDraftAvatarImage,
    bio: profileBioInput.value.trim() || t("profile.bio"),
    about: profileAboutInput.value.trim(),
    vibe: profileVibeInput.value || "soft",
    banner: profileBannerInput.value || "hero",
    bannerImage: profileDraftBannerImage,
    accent: profileAccentInput.value || "lavender"
  };

  saveProfileData();
  updateProfileUI();
  closeProfileModalWindow();

  if (currentView === "profile") {
    renderProfileView();
  }

  showToast("toast.profileSaved");
}

// Формує HTML сторінки профілю користувача.
function renderProfileView() {
  const profile = getProfileData();
  const safeName = escapeHtml(profile.name);
  const safeHandle = escapeHtml(profile.handle);
  const safeStatus = escapeHtml(profile.status || t("profile.noStatus"));
  const safeLocation = escapeHtml(profile.location || t("profile.noLocation"));
  const safeWebsiteText = escapeHtml(profile.website || t("profile.noWebsite"));
  const safeWebsiteUrl = normalizeProfileUrl(profile.website);
  const safeBio = escapeHtml(profile.bio);
  const safeAbout = profile.about ? escapeHtml(profile.about) : "";
  const likedTracks = liked
    .slice(0, 5)
    .map((id) => ({ ...tracks[id], realIndex: id }))
    .filter(Boolean);

  const playlistItems = userPlaylists.slice(0, 5);

  const likedHtml = likedTracks.length
    ? likedTracks.map((track) => `
        <button class="profile-mini-item" type="button" data-profile-track="${track.realIndex}">
          <img src="${track.cover}" alt="${track.title}">
          <span>
            <b>${track.title}</b>
            <small>${track.artist}${track.sourceLabel ? ` · ${track.sourceLabel}` : ""}</small>
          </span>
          <em>${track.duration}</em>
        </button>
      `).join("")
    : `<div class="empty-state">${t("tracks.empty")}</div>`;

  const playlistsHtml = playlistItems.length
    ? playlistItems.map((playlist) => `
        <button class="profile-mini-item" type="button" data-profile-playlist="${playlist.id}">
          <img src="${playlist.cover}" alt="${playlist.name}">
          <span>
            <b>${playlist.name}</b>
            <small>${playlist.description || t("library.customMix")}</small>
          </span>
          <em>${Array.isArray(playlist.trackIds) ? playlist.trackIds.length : 0}</em>
        </button>
      `).join("")
    : `<div class="empty-state">${t("library.emptyCustom")}</div>`;

  trackList.innerHTML = `
    <div class="profile-view">
      <section class="profile-hero">
        <div class="profile-avatar-big ${profile.avatarImage ? "has-image" : ""}">${avatarMarkup(profile)}</div>

        <div class="profile-main">
          <span class="pill">${t("profile.heroPill")}</span>
          <h2>${safeName}</h2>
          <span class="profile-handle">${safeHandle}</span>
          <p>${safeBio}</p>

          <div class="profile-meta-row">
            <span class="profile-vibe-pill">${escapeHtml(profile.avatar)} ${profileVibeLabel(profile.vibe)}</span>
            <span class="profile-meta-chip">✦ ${safeStatus}</span>
            <span class="profile-meta-chip">⌖ ${safeLocation}</span>
            <span class="profile-meta-chip">↗ ${
              safeWebsiteUrl
                ? `<a href="${escapeHtml(safeWebsiteUrl)}" target="_blank" rel="noreferrer">${safeWebsiteText}</a>`
                : safeWebsiteText
            }</span>
          </div>
        </div>

        <div class="profile-actions">
          <button class="profile-action-btn" type="button" data-profile-action="edit">${t("profile.edit")}</button>
          <button class="profile-action-btn" type="button" data-profile-action="library">${t("profile.openLibrary")}</button>
        </div>
      </section>

      <section class="profile-stats">
        <div class="profile-stat-card">
          <b>${userPlaylists.length}</b>
          <span>${t("profile.statsPlaylists")}</span>
        </div>
        <div class="profile-stat-card">
          <b>${liked.length}</b>
          <span>${t("profile.statsLiked")}</span>
        </div>
        <div class="profile-stat-card">
          <b>${tracks.length}</b>
          <span>${t("profile.statsTracks")}</span>
        </div>
        <div class="profile-stat-card">
          <b>${currentLang.toUpperCase()}</b>
          <span>${t("profile.statsLanguage")}</span>
        </div>
      </section>

      <section class="profile-grid">
        <div class="profile-card profile-about-card">
          <h3>${t("profile.aboutTitle")}</h3>
          ${
            safeAbout
              ? `<p>${safeAbout}</p>`
              : `<div class="profile-empty-about">${t("profile.noAbout")}</div>`
          }
        </div>

        <div class="profile-card profile-about-card">
          <h3>${t("profile.linksTitle")}</h3>
          <div class="profile-mini-list">
            <div class="profile-setting-row">
              <span><strong>${t("profile.statusLabel")}</strong><small>${safeStatus}</small></span>
            </div>
            <div class="profile-setting-row">
              <span><strong>${t("profile.locationLabel")}</strong><small>${safeLocation}</small></span>
            </div>
            <div class="profile-setting-row">
              <span><strong>${t("profile.websiteLabel")}</strong><small>${safeWebsiteText}</small></span>
            </div>
          </div>
        </div>
      </section>

      <section class="profile-grid">
        <div class="profile-card">
          <h3>${t("profile.favTitle")}</h3>
          <div class="profile-mini-list">${likedHtml}</div>
        </div>

        <div class="profile-card">
          <h3>${t("profile.playlistsTitle")}</h3>
          <div class="profile-mini-list">${playlistsHtml}</div>
        </div>
      </section>

      <section class="profile-card">
        <h3>${t("profile.settingsTitle")}</h3>
        <div class="profile-settings">
          <div class="profile-setting-row">
            <span>
              <strong>${t("profile.settingTheme")}</strong>
              <small>${t("profile.settingThemeDesc")}</small>
            </span>
            <div class="profile-setting-buttons">
              <button type="button" class="${document.body.classList.contains("night") ? "" : "active"}" data-profile-action="theme-light">Light</button>
              <button type="button" class="${document.body.classList.contains("night") ? "active" : ""}" data-profile-action="theme-night">Night</button>
            </div>
          </div>

          <div class="profile-setting-row">
            <span>
              <strong>${t("profile.settingLanguage")}</strong>
              <small>${t("profile.settingLanguageDesc")}</small>
            </span>
            <div class="profile-setting-buttons">
              <button type="button" class="${currentLang === "uk" ? "active" : ""}" data-profile-action="lang-uk">UA</button>
              <button type="button" class="${currentLang === "en" ? "active" : ""}" data-profile-action="lang-en">EN</button>
            </div>
          </div>

          <div class="profile-setting-row">
            <span>
              <strong>${t("profile.settingStorage")}</strong>
              <small>${t("profile.settingStorageDesc")}</small>
            </span>
            <div class="profile-setting-buttons">
              <button type="button" data-profile-action="clear">${t("profile.clearData")}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  requestAnimationFrame(() => {
    mainPanel?.scrollTo({ top: 0, behavior: "smooth" });
    tracksPanel?.scrollTo({ top: 0, behavior: "smooth" });
    trackList?.scrollTo({ top: 0, behavior: "smooth" });
  });

  trackList.querySelectorAll("[data-profile-track]").forEach((button) => {
    button.addEventListener("click", () => {
      currentIndex = Number(button.dataset.profileTrack);
      loadTrack(currentIndex);
      playTrack();
    });
  });

  trackList.querySelectorAll("[data-profile-playlist]").forEach((button) => {
    const playlist = userPlaylists.find((item) => String(item.id) === String(button.dataset.profilePlaylist));
    button.addEventListener("click", () => {
      if (playlist) openPlaylistPage({ ...playlist, kind: "custom" });
    });
  });

  trackList.querySelectorAll("[data-profile-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.profileAction;

      if (action === "library") setView("library");
      if (action === "theme-light" && document.body.classList.contains("night")) toggleTheme();
      if (action === "theme-night" && !document.body.classList.contains("night")) toggleTheme();
      if (action === "lang-uk") animateLanguage("uk");
      if (action === "lang-en") animateLanguage("en");

      if (action === "clear") {
        liked = [];
        userPlaylists = [];
        saveLikes();
        savePlaylists();
        renderUserPlaylists();
        renderProfileView();
        showToast("toast.demoDataCleared");
      }

      if (action === "edit") {
        openProfileModal();
      }
    });
  });
}

// Перемикає головні режими екрана: home, search, library, liked, playlist.
function setView(view) {
  transitionContent(() => {
    currentView = view;
    searchAssistant.hidden = view !== "search";
    customTitleText = "";
    customSubtitleText = "";
    updateActiveNav(view);

    if (view === "home") {
      currentFilter = "all";
      currentTitleKey = "tracks.defaultTitle";
      currentSubtitleKey = "tracks.defaultSubtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
    }

    if (view === "search") {
      currentFilter = "all";
      currentTitleKey = "search.title";
      currentSubtitleKey = "search.subtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
      searchInput.focus();
      showToast("toast.searchOpened");
    }

    if (view === "library") {
      currentFilter = "all";
      currentTitleKey = "library.title";
      currentSubtitleKey = "library.subtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
      showToast("toast.libraryOpened");
    }

    if (view === "radio") {
      currentFilter = "new";
      currentTitleKey = "radio.title";
      currentSubtitleKey = "radio.subtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
    }

    if (view === "liked") {
      currentFilter = "all";
      currentTitleKey = "tracks.likedTitle";
      currentSubtitleKey = "tracks.likedSubtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
    }

    if (view === "settings") {
      currentFilter = "all";
      currentTitleKey = "settings.pageTitle";
      currentSubtitleKey = "settings.pageSubtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
      showToast("toast.settingsOpened");
    }

    if (view === "settings") {
      currentFilter = "all";
      currentTitleKey = "settings.pageTitle";
      currentSubtitleKey = "settings.pageSubtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
      showToast("toast.settingsOpened");
    }

    if (view === "profile") {
      currentFilter = "all";
      currentTitleKey = "profile.pageTitle";
      currentSubtitleKey = "profile.pageSubtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
      showToast("toast.profileOpened");
    }

    renderTracks();
  });
}

// Відкриває модальне вікно для створення плейлиста.
function openPlaylistModal() {
  playlistModal.classList.add("open");
  playlistModal.setAttribute("aria-hidden", "false");
  playlistNameInput.focus();
}

function closePlaylistModalWindow() {
  playlistModal.classList.remove("open");
  playlistModal.setAttribute("aria-hidden", "true");
  playlistNameInput.value = "";
  playlistDescriptionInput.value = "";
  updatePlaylistMoodPicker("all");
}

// Створює користувацький плейлист та зберігає його у localStorage.
function createPlaylist() {
  const name = playlistNameInput.value.trim();
  const description = playlistDescriptionInput.value.trim();
  const filter = playlistMoodSelect.value;

  if (!name) {
    showToast("toast.noPlaylistName");
    playlistNameInput.focus();
    return;
  }

  const playlist = {
    id: Date.now(),
    name,
    description,
    filter,
    cover: coverForFilter(filter)
  };

  userPlaylists.unshift(playlist);
  savePlaylists();
  renderUserPlaylists();
  closePlaylistModalWindow();
  showToast("toast.playlistCreated");
  setView("library");
}

function openPlaylistFilter(filter, title, subtitle) {
  currentView = "home";
  updateActiveNav("home");
  currentFilter = filter;
  currentTitleKey = "";
  currentSubtitleKey = "";
  customTitleText = title;
  customSubtitleText = subtitle || t("tracks.filteredSubtitle");
  tracksTitle.textContent = customTitleText;
  tracksSubtitle.textContent = customSubtitleText;
  renderTracks();
}

// Виводить створені користувачем плейлисти у ліву панель.
function renderUserPlaylists() {
  playlistMiniList.querySelectorAll(".playlist-mini.user-created").forEach((item) => item.remove());

  userPlaylists.slice(0, 5).forEach((playlist) => {
    const button = document.createElement("button");
    button.className = "playlist-mini user-created";
    button.type = "button";
    button.innerHTML = `
      <img src="${playlist.cover}" alt="">
      <span>
        <b>${playlist.name}</b>
        <small>${playlist.description || t("library.customMix")}</small>
      </span>
    `;

    button.addEventListener("click", () => {
      openPlaylistFilter(playlist.filter, playlist.name, playlist.description || t("tracks.filteredSubtitle"));
      showToast("toast.playlistOpened");
    });

    playlistMiniList.appendChild(button);
  });
}

function renderLibraryView() {
  const defaultCards = [
    {
      title: t("playlist.night.title"),
      desc: t("playlist.night.desc"),
      filter: "night",
      cover: "assets/covers/playlist1.jpg",
      tag: t("library.defaultMix")
    },
    {
      title: t("playlist.alt.title"),
      desc: t("playlist.alt.desc"),
      filter: "alt",
      cover: "assets/covers/playlist2.jpg",
      tag: t("library.defaultMix")
    },
    {
      title: t("playlist.sleep.title"),
      desc: t("playlist.sleep.desc"),
      filter: "sleep",
      cover: "assets/covers/playlist3.jpg",
      tag: t("library.defaultMix")
    },
    {
      title: t("library.likedCard"),
      desc: t("library.likedDesc"),
      filter: "liked",
      cover: "assets/covers/nowplaying.jpg",
      tag: `${liked.length} ♡`
    }
  ];

  const customCards = userPlaylists.map((playlist) => ({
    title: playlist.name,
    desc: playlist.description || t("library.customMix"),
    filter: playlist.filter,
    cover: playlist.cover,
    tag: t("library.customMix")
  }));

  const cards = [...customCards, ...defaultCards];

  if (cards.length === 0) {
    trackList.innerHTML = `<div class="empty-state">${t("library.emptyCustom")}</div>`;
    return;
  }

  trackList.innerHTML = `<div class="library-grid"></div>`;
  const grid = trackList.querySelector(".library-grid");

  cards.forEach((card) => {
    const button = document.createElement("button");
    button.className = "library-card";
    button.type = "button";
    button.innerHTML = `
      <img src="${card.cover}" alt="">
      <b>${card.title}</b>
      <small>${card.desc}</small>
      <span class="library-tag">${card.tag}</span>
    `;

    button.addEventListener("click", () => {
      if (card.filter === "liked") {
        setView("liked");
      } else {
        openPlaylistFilter(card.filter, card.title, card.desc);
        showToast("toast.playlistOpened");
      }
    });

    grid.appendChild(button);
  });
}


const defaultPlaylists = [
  {
    id: "night",
    filter: "night",
    titleKey: "playlist.night.title",
    descKey: "playlist.night.desc",
    cover: "assets/covers/playlist1.jpg",
    kind: "default"
  },
  {
    id: "alt",
    filter: "alt",
    titleKey: "playlist.alt.title",
    descKey: "playlist.alt.desc",
    cover: "assets/covers/playlist2.jpg",
    kind: "default"
  },
  {
    id: "sleep",
    filter: "sleep",
    titleKey: "playlist.sleep.title",
    descKey: "playlist.sleep.desc",
    cover: "assets/covers/playlist3.jpg",
    kind: "default"
  }
];

function playlistTitle(playlist) {
  return playlist.titleKey ? t(playlist.titleKey) : (playlist.name || playlist.title || t("library.customMix"));
}

function playlistDesc(playlist) {
  if (playlist.descKey) return t(playlist.descKey);
  return playlist.description || playlist.desc || t("library.customMix");
}

function playlistTag(playlist) {
  return playlist.kind === "custom" ? t("playlist.customTag") : t("playlist.readyTag");
}

function trackCountText(count) {
  return count === 1 ? t("playlist.oneTrack") : t("playlist.tracksCount").replace("{count}", count);
}

function defaultPlaylistByFilter(filter) {
  return defaultPlaylists.find((playlist) => playlist.filter === filter) || defaultPlaylists[0];
}

function entriesByFilter(filter) {
  return tracks
    .map((track, index) => ({ ...track, realIndex: index }))
    .filter((track) => filter === "all" || track.category === filter || track.vibe === filter);
}

function getPlaylistEntries(playlist) {
  if (!playlist) return [];

  if (playlist.filter === "liked") {
    return tracks
      .map((track, index) => ({ ...track, realIndex: index }))
      .filter((track) => isLiked(track.realIndex));
  }

  if (Array.isArray(playlist.trackIds) && playlist.trackIds.length > 0) {
    return playlist.trackIds
      .map((id) => tracks[id] ? { ...tracks[id], realIndex: id } : null)
      .filter(Boolean);
  }

  return entriesByFilter(playlist.filter || "all");
}

function setPanelCopy(title, subtitle) {
  currentTitleKey = "";
  currentSubtitleKey = "";
  customTitleText = title;
  customSubtitleText = subtitle;
  tracksTitle.textContent = title;
  tracksSubtitle.textContent = subtitle;
}

function renderPlaylistDetail() {
  if (!playlistDetail) return;

  if (currentView !== "playlist" || !activePlaylist) {
    playlistDetail.hidden = true;
    return;
  }

  const entries = getPlaylistEntries(activePlaylist);
  playlistDetail.hidden = false;
  playlistDetailCover.src = activePlaylist.cover || coverForFilter(activePlaylist.filter);
  playlistDetailTag.textContent = playlistTag(activePlaylist);
  playlistDetailTitle.textContent = playlistTitle(activePlaylist);
  playlistDetailDesc.textContent = playlistDesc(activePlaylist);
  playlistDetailCount.textContent = trackCountText(entries.length);
  if (activePlaylist.filter === "liked") {
    playlistDetailMood.textContent = t("nav.liked");
  } else if (activePlaylist.filter === "all") {
    playlistDetailMood.textContent = t("mood.all.title");
  } else {
    const vibeKey = `vibe.${activePlaylist.filter}`;
    playlistDetailMood.textContent = i18n[currentLang][vibeKey] || i18n.uk[vibeKey] || activePlaylist.filter;
  }
  playlistDeleteBtn.hidden = activePlaylist.kind !== "custom";
}

function openPlaylistPage(playlist) {
  transitionContent(() => {
    activePlaylist = playlist;
    currentView = "playlist";
    document.body.classList.remove("profile-active");
    currentFilter = playlist.filter || "all";
    searchAssistant.hidden = true;
    updateActiveNav("library");
    setPanelCopy(playlistTitle(playlist), playlistDesc(playlist));
    renderTracks();
    showToast("toast.playlistOpened");
    tracksPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function playActivePlaylist() {
  const entries = getVisibleTracks();

  if (entries.length === 0) {
    showToast("tracks.empty");
    return;
  }

  currentIndex = entries[0].realIndex;
  loadTrack(currentIndex);
  playTrack();
  renderTracks();
  showToast("toast.playlistPlaying");
}

function deleteActivePlaylist() {
  if (!activePlaylist || activePlaylist.kind !== "custom") return;

  userPlaylists = userPlaylists.filter((playlist) => playlist.id !== activePlaylist.id);
  savePlaylists();
  activePlaylist = null;
  renderUserPlaylists();
  showToast("toast.playlistDeleted");
  setView("library");
}

function getVisibleTracks() {
  const query = searchInput.value.trim().toLowerCase();
  let source;

  if (currentView === "playlist" && activePlaylist) {
    source = getPlaylistEntries(activePlaylist);
  } else {
    source = tracks.map((track, index) => ({ ...track, realIndex: index }));
  }

  return source.filter((track) => {
    const matchesFilter = currentView === "playlist"
      ? true
      : currentFilter === "all" || track.category === currentFilter || track.vibe === currentFilter;
    const matchesView = currentView !== "liked" || isLiked(track.realIndex);
    const matchesSearch = trackMatchesSearch(track, query);

    return matchesFilter && matchesView && matchesSearch;
  });
}

function renderTracks() {
  const isLibrary = currentView === "library";
  const isPlaylist = currentView === "playlist";
  const isProfile = currentView === "profile";

  tracksPanel.classList.toggle("library-mode", isLibrary);
  tracksPanel.classList.toggle("playlist-mode", isPlaylist);
  tracksPanel.classList.toggle("profile-mode", isProfile);

  if (trackHeader) trackHeader.hidden = isLibrary;

  if (currentView === "settings") {
    if (playlistDetail) playlistDetail.hidden = true;
    if (trackHeader) trackHeader.hidden = true;
    renderSettingsView();
    return;
  }

  if (currentView === "settings") {
    if (playlistDetail) playlistDetail.hidden = true;
    if (trackHeader) trackHeader.hidden = true;
    renderSettingsView();
    return;
  }

  if (currentView === "profile") {
    if (playlistDetail) playlistDetail.hidden = true;
    if (trackHeader) trackHeader.hidden = true;
    renderProfileView();
    return;
  }

  if (isLibrary) {
    if (playlistDetail) playlistDetail.hidden = true;
    renderLibraryView();
    return;
  }

  renderPlaylistDetail();

  const visibleTracks = getVisibleTracks();
  trackList.innerHTML = "";

  if (visibleTracks.length === 0) {
    trackList.innerHTML = `<div class="empty-state">${isPlaylist ? t("playlist.empty") : t("tracks.empty")}</div>`;
    return;
  }

  visibleTracks.forEach((track, visualIndex) => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");

    if (track.realIndex === currentIndex) {
      row.classList.add("active");
    }

    row.innerHTML = `
      <span class="track-number">${visualIndex + 1}</span>
      <span class="track-info">
        <img src="${track.cover}" alt="${track.title}">
        <span>
          <b>${track.title}</b>
          <small>${track.artist}${track.sourceLabel ? ` · ${track.sourceLabel}` : ""}</small>
        </span>
      </span>
      <span>${track.artist}</span>
      <span>${t(`vibe.${track.vibe}`)}</span>
      <span>${track.duration}</span>
      <span>
        <button class="track-like" type="button" title="${t("buttons.like")}">${isLiked(track.realIndex) ? "♥" : "♡"}</button>
        <button class="track-more" type="button" title="${t("buttons.queue")}">⋯</button>
      </span>
    `;

    const chooseTrack = () => {
      currentIndex = track.realIndex;
      loadTrack(currentIndex);
      playTrack();
      renderTracks();
    };

    row.addEventListener("click", chooseTrack);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        chooseTrack();
      }
    });

    row.querySelector(".track-like").addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLike(track.realIndex);
    });

    row.querySelector(".track-more").addEventListener("click", (event) => {
      openTrackMenu(event, track.realIndex);
    });

    trackList.appendChild(row);
  });
}

function createPlaylist() {
  const name = playlistNameInput.value.trim();
  const description = playlistDescriptionInput.value.trim();
  const filter = playlistMoodSelect.value;

  if (!name) {
    showToast("toast.noPlaylistName");
    playlistNameInput.focus();
    return;
  }

  const entries = entriesByFilter(filter).slice(0, 6);
  const playlist = {
    id: Date.now(),
    kind: "custom",
    name,
    description,
    filter,
    cover: coverForFilter(filter),
    trackIds: entries.map((track) => track.realIndex)
  };

  userPlaylists.unshift(playlist);
  savePlaylists();
  renderUserPlaylists();
  closePlaylistModalWindow();
  showToast("toast.playlistCreated");
  openPlaylistPage(playlist);
}

function openPlaylistFilter(filter, title, subtitle) {
  openPlaylistPage({
    id: `filter-${filter}`,
    kind: "default",
    filter,
    name: title,
    description: subtitle || t("tracks.filteredSubtitle"),
    cover: coverForFilter(filter)
  });
}

function renderUserPlaylists() {
  playlistMiniList.querySelectorAll(".playlist-mini.user-created").forEach((item) => item.remove());

  userPlaylists.slice(0, 5).forEach((playlist) => {
    const button = document.createElement("button");
    button.className = "playlist-mini user-created";
    button.type = "button";
    button.innerHTML = `
      <img src="${playlist.cover}" alt="">
      <span>
        <b>${playlist.name}</b>
        <small>${playlist.description || t("library.customMix")}</small>
      </span>
    `;

    button.addEventListener("click", () => openPlaylistPage({ ...playlist, kind: "custom" }));

    playlistMiniList.appendChild(button);
  });
}

function renderLibraryView() {
  const defaultCards = defaultPlaylists.map((playlist) => ({
    ...playlist,
    title: playlistTitle(playlist),
    desc: playlistDesc(playlist),
    tag: t("library.defaultMix")
  }));

  const likedCard = {
    id: "liked",
    kind: "default",
    title: t("library.likedCard"),
    desc: t("library.likedDesc"),
    filter: "liked",
    cover: "assets/covers/nowplaying.jpg",
    tag: `${liked.length} ♡`
  };

  const customCards = userPlaylists.map((playlist) => ({
    ...playlist,
    kind: "custom",
    title: playlist.name,
    desc: playlist.description || t("library.customMix"),
    tag: t("library.customMix")
  }));

  trackList.innerHTML = `
    <div class="library-toolbar">
      <div>
        <span class="pill ghost">${t("playlist.detailTag")}</span>
        <h3>${t("library.createTitle")}</h3>
        <p>${t("library.createDesc")}</p>
      </div>
      <button class="primary-btn library-create-btn" type="button">${t("library.createButton")}</button>
    </div>
    <div class="library-grid"></div>
  `;

  trackList.querySelector(".library-create-btn").addEventListener("click", openPlaylistModal);

  const grid = trackList.querySelector(".library-grid");
  const cards = [...customCards, likedCard, ...defaultCards];

  cards.forEach((card) => {
    const button = document.createElement("button");
    button.className = "library-card";
    button.type = "button";
    button.innerHTML = `
      <img src="${card.cover}" alt="">
      <span class="library-tag">${card.tag}</span>
      <b>${card.title}</b>
      <small>${card.desc}</small>
      <em>${t("buttons.openPlaylist")}</em>
    `;

    button.addEventListener("click", () => openPlaylistPage(card));

    grid.appendChild(button);
  });
}

function setView(view) {
  transitionContent(() => {
    currentView = view;
    activePlaylist = null;
    document.body.classList.toggle("profile-active", view === "profile");
    document.body.classList.toggle("settings-active", view === "settings");
    document.body.classList.toggle("settings-active", view === "settings");
    searchAssistant.hidden = view !== "search";
    customTitleText = "";
    customSubtitleText = "";
    updateActiveNav(view);
    if (playlistDetail) playlistDetail.hidden = true;

    if (view === "home") {
      currentFilter = "all";
      currentTitleKey = "tracks.defaultTitle";
      currentSubtitleKey = "tracks.defaultSubtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
    }

    if (view === "search") {
      currentFilter = "all";
      currentTitleKey = "search.title";
      currentSubtitleKey = "search.subtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
      searchInput.focus();
      showToast("toast.searchOpened");
    }

    if (view === "library") {
      currentFilter = "all";
      currentTitleKey = "library.title";
      currentSubtitleKey = "library.subtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
      showToast("toast.libraryOpened");
    }

    if (view === "radio") {
      currentFilter = "new";
      currentTitleKey = "radio.title";
      currentSubtitleKey = "radio.subtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
    }

    if (view === "liked") {
      currentFilter = "all";
      currentTitleKey = "tracks.likedTitle";
      currentSubtitleKey = "tracks.likedSubtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
    }

    if (view === "profile") {
      currentFilter = "all";
      currentTitleKey = "profile.pageTitle";
      currentSubtitleKey = "profile.pageSubtitle";
      tracksTitle.textContent = t(currentTitleKey);
      tracksSubtitle.textContent = t(currentSubtitleKey);
      showToast("toast.profileOpened");
    }

    renderTracks();
  });
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("nyamiLanguage", lang);
  document.documentElement.lang = lang;

  $$('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  $$('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  $$('[data-i18n-title]').forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });

  $$('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  $$('[data-i18n-alt]').forEach((element) => {
    element.alt = t(element.dataset.i18nAlt);
  });

  $$(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  if (currentView === "playlist" && activePlaylist) {
    setPanelCopy(playlistTitle(activePlaylist), playlistDesc(activePlaylist));
  } else {
    tracksTitle.textContent = currentTitleKey ? t(currentTitleKey) : customTitleText;
    tracksSubtitle.textContent = currentSubtitleKey ? t(currentSubtitleKey) : customSubtitleText;
  }

  updatePlayButtons();
  updateCurrentUI();
  updateProfileUI();
  renderUserPlaylists();
  renderTracks();
  renderSearchPopover();
}

// Перемикаємо настрій у кастомному picker модального вікна.
playlistMoodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updatePlaylistMoodPicker(button.dataset.playlistMood);
  });
});

// Підписуємося на всі основні події інтерфейсу.
playBtn.addEventListener("click", togglePlay);

// v36: правий плеєр відкривається тільки по обкладинці треку в нижньому плеєрі.
if (bottomCover) {
  bottomCover.addEventListener("click", (event) => {
    event.stopPropagation();
    openRightPlayerFromTrack();
  });
}

bottomPlayBtn.addEventListener("click", togglePlay);
heroPlayBtn.addEventListener("click", togglePlay);

nextBtn.addEventListener("click", nextTrack);
bottomNextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
bottomPrevBtn.addEventListener("click", prevTrack);

function toggleShuffleMode() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  if (bottomShuffleBtn) bottomShuffleBtn.classList.toggle("active", isShuffle);
  showToast(isShuffle ? "toast.shuffleOn" : "toast.shuffleOff");
}

shuffleBtn.addEventListener("click", toggleShuffleMode);
if (bottomShuffleBtn) bottomShuffleBtn.addEventListener("click", toggleShuffleMode);

shuffleTopBtn.addEventListener("click", randomTrack);
randomBtn.addEventListener("click", randomTrack);

function toggleRepeatMode() {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  if (bottomRepeatBtn) bottomRepeatBtn.classList.toggle("active", isRepeat);
  showToast(isRepeat ? "toast.repeatOn" : "toast.repeatOff");
}

repeatBtn.addEventListener("click", toggleRepeatMode);
if (bottomRepeatBtn) bottomRepeatBtn.addEventListener("click", toggleRepeatMode);

rightLikeBtn.addEventListener("click", () => toggleLike());
bottomLikeBtn.addEventListener("click", () => toggleLike());
heroLikeBtn.addEventListener("click", () => toggleLike());

if (bottomAddBtn) {
  bottomAddBtn.addEventListener("click", () => toggleLike());
}

if (muteBtn) {
  muteBtn.addEventListener("click", toggleMute);
}

["#lyricsBtn", "#queueBtn", "#deviceBtn", "#miniPlayerBtn", "#fullScreenBtn"].forEach((selector) => {
  const button = $(selector);
  if (button) {
    button.addEventListener("click", () => showToast("toast.playerToolLater"));
  }
});

if (closeBottomPlayerBtn) {
  closeBottomPlayerBtn.addEventListener("click", () => setPlayerClosed("bottom", true));
}

if (closeRightPlayerBtn) {
  closeRightPlayerBtn.addEventListener("click", () => setPlayerClosed("right", true));
}

restorePlayerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setPlayerClosed(button.dataset.restorePlayer, false);
  });
});


searchInput.addEventListener("input", () => {
  searchBox.classList.toggle("has-value", searchInput.value.trim().length > 0);
  if (currentView !== "search") setView("search");
  renderTracks();
  showSearchPopover();
});

searchInput.addEventListener("focus", () => {
  if (currentView !== "search") setView("search");
  showSearchPopover();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitSearch();
  }

  if (event.key === "Escape") {
    hideSearchPopover();
    searchInput.blur();
  }
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchBox.classList.remove("has-value");
  renderTracks();
  renderSearchPopover();
  searchInput.focus();
  showToast("toast.searchCleared");
});

closeSearchPopover.addEventListener("click", hideSearchPopover);

clearHistoryBtn.addEventListener("click", () => {
  searchHistory = [];
  saveSearchHistory();
  renderSearchHistory();
  showToast("toast.historyCleared");
});

$$(".search-chips button, .popular-searches button").forEach((button) => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.searchTerm;
    searchBox.classList.add("has-value");
    addSearchHistory(searchInput.value);
    searchInput.focus();
    setView("search");
    renderTracks();
    showSearchPopover();
    showToast("toast.searchChip");
  });
});

document.addEventListener("click", (event) => {
  const insideSearch = searchBox.contains(event.target) || searchPopover.contains(event.target);
  if (!insideSearch) hideSearchPopover();

  const insideTrackMenu = trackMenu && trackMenu.contains(event.target);
  const clickedMore = event.target.closest(".track-more");
  if (!insideTrackMenu && !clickedMore) closeTrackMenu();
});

if (trackMenu) {
  trackMenu.addEventListener("click", handleTrackMenuClick);
}

nowProgress.addEventListener("input", () => setProgress(nowProgress.value));
bottomProgress.addEventListener("input", () => setProgress(bottomProgress.value));

volumeInput.addEventListener("input", () => {
  audio.volume = Number(volumeInput.value) / 100;

  if (audio.volume > 0) {
    previousVolume = audio.volume;
  }

  if (muteBtn) {
    muteBtn.textContent = audio.volume === 0 ? "🔇" : "🔊";
  }

  setRangeFill(volumeInput);
  keepVolumeIcon();
  forceHeadphoneIcon();
  updateHeadphoneIcon();
});

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", updateProgress);
audio.addEventListener("ended", () => {
  if (!isRepeat) nextTrack();
});

$("#themeBtn").addEventListener("click", toggleTheme);
sideThemeBtn.addEventListener("click", toggleTheme);

$("#showAllBtn").addEventListener("click", () => {
  searchInput.value = "";
  $$(".mood-card").forEach((card) => card.classList.remove("active"));
  document.querySelector('[data-filter="all"]').classList.add("active");
  setView("home");
});

$$(".mood-card").forEach((card) => {
  card.addEventListener("click", () => {
    $$(".mood-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    setFilter(card.dataset.filter, card.dataset.titleKey, "tracks.filteredSubtitle");
  });
});

$$(".playlist-mini:not(.user-created)").forEach((playlist) => {
  playlist.addEventListener("click", () => {
    const defaultPlaylist = defaultPlaylistByFilter(playlist.dataset.filter);
    openPlaylistPage(defaultPlaylist);
  });
});

$$(".nav-item").forEach((item) => {
  item.addEventListener("click", () => setView(item.dataset.view));
});

if (profileOpenBtn) {
  profileOpenBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleProfileDropdown();
  });
}


if (profileDropdown) {
  profileDropdown.addEventListener("click", (event) => {
    const button = event.target.closest("[data-profile-menu-action]");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    handleProfileDropdownAction(button.dataset.profileMenuAction);
  });
}

document.addEventListener("click", (event) => {
  if (!profileDropdown || !profileDropdown.classList.contains("open")) return;

  const isInsideMenu = profileDropdown.contains(event.target);
  const isProfileButton = profileOpenBtn?.contains(event.target);

  if (!isInsideMenu && !isProfileButton) {
    closeProfileDropdown();
  }
});


if (sideProfileBtn) {
  sideProfileBtn.addEventListener("click", () => {
    setView("profile");
    requestAnimationFrame(() => mainPanel?.scrollTo({ top: 0, behavior: "smooth" }));
  });
}


$$(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => animateLanguage(button.dataset.lang));
});

playlistPlayBtn.addEventListener("click", playActivePlaylist);
playlistBackBtn.addEventListener("click", () => setView("library"));
playlistDeleteBtn.addEventListener("click", deleteActivePlaylist);

const addPlaylistBtn = $("#addPlaylistBtn");
if (addPlaylistBtn) addPlaylistBtn.addEventListener("click", openPlaylistModal);
$("#openCreateBtn").addEventListener("click", openPlaylistModal);
closePlaylistModal.addEventListener("click", closePlaylistModalWindow);
cancelPlaylistModal.addEventListener("click", closePlaylistModalWindow);
createPlaylistSubmitBtn.addEventListener("click", createPlaylist);
playlistModal.addEventListener("click", (event) => {
  if (event.target === playlistModal) closePlaylistModalWindow();
});

if (profileModal) {
  closeProfileModal.addEventListener("click", closeProfileModalWindow);
  cancelProfileModal.addEventListener("click", closeProfileModalWindow);
  saveProfileBtn.addEventListener("click", saveProfileFromModal);

  [
    profileNameInput,
    profileHandleInput,
    profileStatusInput,
    profileLocationInput,
    profileWebsiteInput,
    profileAvatarInput,
    profileBioInput,
    profileAboutInput
  ].forEach((input) => {
    input.addEventListener("input", updateProfileEditPreview);
  });

  profileAvatarPresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      profileAvatarInput.value = button.dataset.avatarPreset;
      profileDraftAvatarImage = "";
      updateProfileEditPreview();
    });
  });

  profileVibePresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      profileVibeInput.value = button.dataset.profileVibe;
      updateProfileEditPreview();
    });
  });

  profileBannerPresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      profileBannerInput.value = button.dataset.profileBanner;
      profileDraftBannerImage = "";
      updateProfileEditPreview();
    });
  });

  profileAccentPresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      profileAccentInput.value = button.dataset.profileAccent;
      document.documentElement.style.setProperty("--profile-accent", profileAccentColor(profileAccentInput.value));
      document.documentElement.style.setProperty("--profile-accent-soft", `${profileAccentColor(profileAccentInput.value)}2b`);
      updateProfileEditPreview();
    });
  });

  uploadAvatarBtn.addEventListener("click", () => profileAvatarFileInput.click());
  uploadBannerBtn.addEventListener("click", () => profileBannerFileInput.click());

  removeAvatarImageBtn.addEventListener("click", () => {
    profileDraftAvatarImage = "";
    profileAvatarFileInput.value = "";
    updateProfileEditPreview();
  });

  removeBannerImageBtn.addEventListener("click", () => {
    profileDraftBannerImage = "";
    profileBannerFileInput.value = "";
    updateProfileEditPreview();
  });

  profileAvatarFileInput.addEventListener("change", () => {
    const file = profileAvatarFileInput.files?.[0];
    if (file) handleProfileImageUpload(file, "avatar");
  });

  profileBannerFileInput.addEventListener("change", () => {
    const file = profileBannerFileInput.files?.[0];
    if (file) handleProfileImageUpload(file, "banner");
  });

  profileModal.addEventListener("click", (event) => {
    if (event.target === profileModal) closeProfileModalWindow();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && playlistModal.classList.contains("open")) {
    closePlaylistModalWindow();
  }

  if (event.key === "Escape" && profileModal && profileModal.classList.contains("open")) {
    closeProfileModalWindow();
  }

  if (event.key === "Escape") {
    closeTrackMenu();
  }
});


// Додає коротку підсвітку після натискання кнопок нижнього плеєра.
function initDockButtonGlow() {
  const buttons = $$(".bottom-player button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.remove("dock-pressed");
      void button.offsetWidth;
      button.classList.add("dock-pressed");

      window.setTimeout(() => {
        button.classList.remove("dock-pressed");
      }, 420);
    });
  });
}



// v44-auth-events: підключення форми авторизації до Python backend.
authModeButtons.forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
});

if (authForm) {
  authForm.addEventListener("submit", submitAuth);
}

if (authDemoBtn) {
  authDemoBtn.addEventListener("click", continueAsGuest);
}

[authNameInput, authEmailInput, authPasswordInput, authConfirmPasswordInput].forEach((input) => {
  input?.addEventListener("input", clearAuthFieldErrors);
});

// Початкова ініціалізація сторінки після завантаження.
if (localStorage.getItem("nyamiTheme") === "night") {
  document.body.classList.add("night");
}

searchAssistant.hidden = currentView !== "search";
searchBox.classList.toggle("has-value", searchInput.value.trim().length > 0);
renderSearchPopover();
updateThemeButtons();

volumeInput.value = 70;
audio.volume = 0.7;
setRangeFill(nowProgress);
setRangeFill(bottomProgress);
setRangeFill(volumeInput);
initRangeInteractions();
initDockButtonGlow();
loadTrack(currentIndex);
renderUserPlaylists();
applyLanguage(currentLang);
setAuthMode(authMode);
hydrateAuthFromSession();
applyPlayerVisibility();
updatePlayButtons();




// v35-avatar-sync: страховка, щоб аватарка в topbar не зникала після відкриття панелей.
window.setInterval(() => {
  renderTopProfileAvatar();
  keepVolumeIcon();
}, 1200);


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && profileDropdown?.classList.contains("open")) {
    closeProfileDropdown();
  }
});


// v38-initial-avatar-sync: показуємо аватарку і навушники одразу після входу на сайт.
document.addEventListener("DOMContentLoaded", () => {
  renderTopProfileAvatar();
  renderProfileDropdown();
  keepVolumeIcon();
});

window.requestAnimationFrame(() => {
  renderTopProfileAvatar();
  renderProfileDropdown();
  keepVolumeIcon();
});


// v39-profile-editing-fallback: якщо модалка профілю закривається будь-якою кнопкою,
// повертаємо верхню шапку.
document.addEventListener("click", (event) => {
  const closeEditProfile = event.target.closest("#closeProfileModal, #cancelProfileModal, #saveProfileBtn");
  if (closeEditProfile) {
    window.setTimeout(() => {
      const modal = document.getElementById("profileModal");
      const isOpen = modal?.classList.contains("show") || modal?.classList.contains("open") || modal?.getAttribute("aria-hidden") === "false";
      if (!isOpen) {
        document.body.classList.remove("profile-editing-active");
      }
      renderTopProfileAvatar();
      forceHeadphoneIcon();
    }, 80);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    window.setTimeout(() => {
      const modal = document.getElementById("profileModal");
      const isOpen = modal?.classList.contains("show") || modal?.classList.contains("open") || modal?.getAttribute("aria-hidden") === "false";
      if (!isOpen) {
        document.body.classList.remove("profile-editing-active");
      }
      renderTopProfileAvatar();
      forceHeadphoneIcon();
    }, 80);
  }
});


// v39-immediate-ui-sync: показуємо аватарку і навушники без очікування кліку.
function syncPersistentHeaderUi() {
  forceTopbarAvatar();
  renderProfileDropdown?.();
  updateHeadphoneIcon();
}

syncPersistentHeaderUi();

document.addEventListener("DOMContentLoaded", () => {
  syncPersistentHeaderUi();
  window.setTimeout(syncPersistentHeaderUi, 50);
  window.setTimeout(syncPersistentHeaderUi, 250);
});

window.addEventListener("load", () => {
  syncPersistentHeaderUi();
  window.setTimeout(syncPersistentHeaderUi, 300);
});

// Дешева страховка від старих render-функцій, які можуть перезаписати аватарку/іконку.
window.setInterval(syncPersistentHeaderUi, 900);


// v40-initial-sync: аватарка і навушники синхронізуються без кліків.
forceTopbarAvatar();
updateHeadphoneIcon();

document.addEventListener("DOMContentLoaded", () => {
  forceTopbarAvatar();
  updateHeadphoneIcon();
  window.setTimeout(() => {
    forceTopbarAvatar();
    updateHeadphoneIcon();
  }, 80);
});

window.addEventListener("load", () => {
  forceTopbarAvatar();
  updateHeadphoneIcon();
});

window.setInterval(() => {
  forceTopbarAvatar();
  updateHeadphoneIcon();
}, 700);


// v44-file-protocol-warning: авторизація працює тільки через сервер.
if (window.location.protocol === "file:") {
  document.body.classList.add("auth-required");
  setAuthError?.("auth.error.backend");
}



/* ==========================================================
   v45-auth-final: реальна поведінка auth-меню.
   Цей блок працює у capture-фазі і не дає старим handler-ам
   пропускати користувача з будь-яким текстом.
   ========================================================== */

function v45NormalizeLogin(value, method = authMethod) {
  const raw = String(value || "").trim().toLowerCase();

  if (method === "phone") {
    return raw.replace(/[^\d+]/g, "");
  }

  if (method === "username") {
    const clean = raw.replace(/\s+/g, "");
    return clean.startsWith("@") ? clean : `@${clean}`;
  }

  return raw.replace(/\s+/g, "");
}

function v45ValidateLogin(value, method = authMethod) {
  const normalized = v45NormalizeLogin(value, method);

  if (method === "email") {
    return normalized.includes("@") && normalized.split("@").at(-1)?.includes(".") && normalized.length >= 5;
  }

  if (method === "username") {
    const body = normalized.replace(/^@/, "");
    return body.length >= 3 && /^[a-z0-9._-]+$/i.test(body);
  }

  if (method === "phone") {
    const digits = normalized.replace(/\D/g, "");
    return digits.length >= 7;
  }

  return Boolean(normalized);
}

function v45SetAuthMethod(method) {
  authMethod = ["email", "username", "phone"].includes(method) ? method : "email";

  authMethodButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.authMethod === authMethod);
  });

  if (authEmailInput) {
    if (authMethod === "email") {
      authEmailInput.placeholder = "name@email.com";
      authEmailInput.type = "email";
    } else if (authMethod === "username") {
      authEmailInput.placeholder = "@nyami";
      authEmailInput.type = "text";
    } else {
      authEmailInput.placeholder = "+380...";
      authEmailInput.type = "tel";
    }
  }

  clearAuthFieldErrors?.();
}

function v45SetAuthMode(mode) {
  authMode = mode === "register" ? "register" : "login";
  document.body.classList.toggle("auth-login-mode", authMode === "login");

  authModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === authMode);
  });

  if (authSubmitBtn) {
    authSubmitBtn.textContent = t(authMode === "register" ? "auth.registerBtn" : "auth.loginBtn");
    authSubmitBtn.classList.remove("is-loading");
  }

  if (authPasswordInput) {
    authPasswordInput.autocomplete = authMode === "register" ? "new-password" : "current-password";
  }

  clearAuthFieldErrors?.();
}

function v45ValidateAuthForm() {
  clearAuthFieldErrors?.();

  const name = authNameInput?.value.trim() || "";
  const login = authEmailInput?.value.trim() || "";
  const password = authPasswordInput?.value || "";
  const confirm = authConfirmPasswordInput?.value || "";

  if (authMode === "register" && name.length < 2) {
    authNameInput?.classList.add("invalid");
    setAuthError?.("auth.error.name");
    return false;
  }

  if (!v45ValidateLogin(login, authMethod)) {
    authEmailInput?.classList.add("invalid");
    const key = authMethod === "email"
      ? "auth.error.email"
      : authMethod === "username"
        ? "auth.error.username"
        : "auth.error.phone";
    setAuthError?.(key);
    return false;
  }

  if (password.length < 6) {
    authPasswordInput?.classList.add("invalid");
    setAuthError?.("auth.error.password");
    return false;
  }

  if (authMode === "register" && password !== confirm) {
    authConfirmPasswordInput?.classList.add("invalid");
    setAuthError?.("auth.error.confirm");
    return false;
  }

  return true;
}

async function v45BackendRequest(path, options = {}) {
  return apiRequest(path, options);
}

function v45ApplySuccessfulAuth(payload) {
  setAuthToken(payload.token);
  document.body.classList.remove("auth-upgrade-open");

  applyAuthUser(payload);
  applyAuthState();

  document.body.classList.toggle("guest-mode", Boolean(payload?.isGuest));
  setAuthError?.("");
}

async function v45Register() {
  const payload = await v45BackendRequest("/api/auth/register", {
    method: "POST",
    body: {
      method: authMethod,
      name: authNameInput?.value.trim() || "",
      login: v45NormalizeLogin(authEmailInput?.value || "", authMethod),
      password: authPasswordInput?.value || "",
      confirmPassword: authConfirmPasswordInput?.value || "",
      profile: getProfileData()
    }
  });

  v45ApplySuccessfulAuth(payload);
  showToast("toast.registerSuccess");
}

async function v45Login() {
  const payload = await v45BackendRequest("/api/auth/login", {
    method: "POST",
    body: {
      method: authMethod,
      login: v45NormalizeLogin(authEmailInput?.value || "", authMethod),
      password: authPasswordInput?.value || ""
    }
  });

  v45ApplySuccessfulAuth(payload);
  showToast("toast.loginSuccess");
}

async function v45SubmitAuth(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (!v45ValidateAuthForm()) return;

  try {
    authSubmitBtn?.classList.add("is-loading");
    if (authSubmitBtn) authSubmitBtn.textContent = t("auth.loading");

    if (authMode === "register") {
      await v45Register();
    } else {
      await v45Login();
    }
  } catch (error) {
    console.error("v45 auth failed:", error);
    const key = mapAuthError?.(error) || "auth.error.general";
    setAuthError?.(key);
    showToast(key);
  } finally {
    authSubmitBtn?.classList.remove("is-loading");
    if (authSubmitBtn) {
      authSubmitBtn.textContent = t(authMode === "register" ? "auth.registerBtn" : "auth.loginBtn");
    }
  }
}

async function v45ContinueAsGuest(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();

  try {
    const payload = await v45BackendRequest("/api/auth/guest", {
      method: "POST",
      body: {}
    });

    v45ApplySuccessfulAuth(payload);
    document.body.classList.add("guest-mode");
    showToast("toast.guestMode");
  } catch (error) {
    console.error("guest failed:", error);
    const key = mapAuthError?.(error) || "auth.error.backend";
    setAuthError?.(key);
    showToast(key);
  }
}

function v45OpenRegisterFromGuest() {
  document.body.classList.add("auth-upgrade-open", "auth-required");
  v45SetAuthMode("register");
  setAuthError?.("auth.guestBlocked");
}

function v45IsGuest() {
  return Boolean(authState?.isLoggedIn && authState?.isGuest);
}

function v45BlockGuestAction(event) {
  if (!v45IsGuest()) return;

  const blocked = event.target.closest(`
    #bottomLikeBtn,
    #rightLikeBtn,
    #bottomAddBtn,
    [data-profile-menu-action="edit"],
    [data-settings-action="edit-profile"],
    [data-settings-action="clear-likes"],
    [data-settings-action="clear-playlists"],
    [data-settings-action="clear-all"],
    [data-playlist-create],
    #saveProfileBtn
  `);

  if (!blocked) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  v45OpenRegisterFromGuest();
  showToast("auth.guestBlocked");
}

async function v45LogoutUser() {
  await logoutUser();
  document.body.classList.remove("guest-mode", "auth-upgrade-open");
  v45SetAuthMode("login");
}

function v45ApplyAuthVisualState() {
  document.body.classList.toggle("guest-mode", Boolean(authState?.isLoggedIn && authState?.isGuest));
  if (!authState?.isLoggedIn) {
    document.body.classList.remove("guest-mode");
  }
}

// Перепризначаємо setAuthMode, щоб старі виклики теж працювали правильно.
setAuthMode = v45SetAuthMode;

// Перепризначаємо submitAuth, щоб старі виклики не пропускали будь-які дані.
submitAuth = v45SubmitAuth;

// Capture-події мають пріоритет над старими listener-ами.
authForm?.addEventListener("submit", v45SubmitAuth, true);

authDemoBtn?.addEventListener("click", v45ContinueAsGuest, true);

authModeButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    v45SetAuthMode(button.dataset.authMode);
  }, true);
});

authMethodButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    v45SetAuthMethod(button.dataset.authMethod);
  }, true);
});

[authNameInput, authEmailInput, authPasswordInput, authConfirmPasswordInput].forEach((input) => {
  input?.addEventListener("input", () => clearAuthFieldErrors?.(), true);
});

document.addEventListener("click", v45BlockGuestAction, true);

const oldApplyAuthState = applyAuthState;
applyAuthState = function applyAuthStateV45() {
  oldApplyAuthState();
  const shouldShowAuth = !authState?.isLoggedIn || document.body.classList.contains("auth-upgrade-open");
  document.body.classList.toggle("auth-required", shouldShowAuth);
  v45ApplyAuthVisualState();
};

const oldLogoutUser = logoutUser;
logoutUser = async function logoutUserV45() {
  try {
    await oldLogoutUser();
  } finally {
    document.body.classList.remove("guest-mode", "auth-upgrade-open");
    v45SetAuthMode("login");
  }
};

// Якщо у браузері залишився старий demo-auth без backend token — не пускаємо на сайт.
if (!getAuthToken()) {
  authState = {
    isLoggedIn: false,
    isGuest: false,
    name: "",
    handle: ""
  };
  saveAuthState?.();
}

v45SetAuthMethod("email");
v45SetAuthMode("login");
applyAuthState();



/* ==========================================================
   v46-auth-clean:
   Повністю окрема авторизація. Старий authScreen вимкнено CSS.
   Сайт пускає тільки якщо є валідна v46-сесія з backend.
   ========================================================== */

const auth46 = {
  tokenKey: "nyamiV46Token",
  stateKey: "nyamiV46State",
  mode: "login",
  method: "email",
  isGuest: false,
  user: null
};

const auth46Screen = document.getElementById("authV46Screen");
const auth46Form = document.getElementById("authV46Form");
const auth46Title = document.getElementById("authV46Title");
const auth46Desc = document.getElementById("authV46Desc");
const auth46Name = document.getElementById("authV46Name");
const auth46LoginInput = document.getElementById("authV46Login");
const auth46LoginLabel = document.getElementById("authV46LoginLabel");
const auth46Password = document.getElementById("authV46Password");
const auth46Confirm = document.getElementById("authV46Confirm");
const auth46Error = document.getElementById("authV46Error");
const auth46Submit = document.getElementById("authV46Submit");
const auth46Guest = document.getElementById("authV46Guest");
const auth46ModeButtons = Array.from(document.querySelectorAll("[data-auth46-mode]"));
const auth46MethodButtons = Array.from(document.querySelectorAll("[data-auth46-method]"));

function auth46Token() {
  return localStorage.getItem(auth46.tokenKey) || "";
}

function auth46SetToken(token) {
  if (token) {
    localStorage.setItem(auth46.tokenKey, token);
  } else {
    localStorage.removeItem(auth46.tokenKey);
  }
}

function auth46SaveState() {
  localStorage.setItem(auth46.stateKey, JSON.stringify({
    isGuest: auth46.isGuest,
    user: auth46.user
  }));
}

function auth46SetError(key = "") {
  if (!auth46Error) return;
  auth46Error.textContent = key ? t(key) : "";
}

function auth46ClearErrors() {
  [auth46Name, auth46LoginInput, auth46Password, auth46Confirm].forEach((input) => {
    input?.classList.remove("invalid");
  });
  auth46SetError("");
}

function auth46Normalize(value, method = auth46.method) {
  const raw = String(value || "").trim().toLowerCase();

  if (method === "phone") {
    return raw.replace(/[^\d+]/g, "");
  }

  if (method === "username") {
    const clean = raw.replace(/\s+/g, "");
    return clean.startsWith("@") ? clean : `@${clean}`;
  }

  return raw.replace(/\s+/g, "");
}

function auth46ValidateLogin(value, method = auth46.method) {
  const normalized = auth46Normalize(value, method);

  if (method === "email") {
    return normalized.includes("@") && normalized.split("@").at(-1)?.includes(".") && normalized.length >= 5;
  }

  if (method === "username") {
    const body = normalized.replace(/^@/, "");
    return body.length >= 3 && /^[a-z0-9._-]+$/i.test(body);
  }

  if (method === "phone") {
    return normalized.replace(/\D/g, "").length >= 7;
  }

  return false;
}

function auth46SetMode(mode) {
  auth46.mode = mode === "register" ? "register" : "login";
  document.body.classList.toggle("auth-v46-login", auth46.mode === "login");

  auth46ModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.auth46Mode === auth46.mode);
  });

  if (auth46Title) {
    auth46Title.textContent = t(auth46.mode === "register" ? "auth46.registerTitle" : "auth46.loginTitle");
  }

  if (auth46Desc) {
    auth46Desc.textContent = t(auth46.mode === "register" ? "auth46.registerDesc" : "auth46.loginDesc");
  }

  if (auth46Submit) {
    auth46Submit.textContent = t(auth46.mode === "register" ? "auth46.registerBtn" : "auth46.loginBtn");
    auth46Submit.classList.remove("is-loading");
  }

  if (auth46Password) {
    auth46Password.autocomplete = auth46.mode === "register" ? "new-password" : "current-password";
  }

  auth46ClearErrors();
}

function auth46SetMethod(method) {
  auth46.method = ["email", "username", "phone"].includes(method) ? method : "email";

  auth46MethodButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.auth46Method === auth46.method);
  });

  if (auth46LoginInput && auth46LoginLabel) {
    if (auth46.method === "email") {
      auth46LoginInput.type = "email";
      auth46LoginInput.placeholder = "name@email.com";
      auth46LoginLabel.textContent = "Email";
    }

    if (auth46.method === "username") {
      auth46LoginInput.type = "text";
      auth46LoginInput.placeholder = "@nyami";
      auth46LoginLabel.textContent = currentLang === "uk" ? "Нік" : "Handle";
    }

    if (auth46.method === "phone") {
      auth46LoginInput.type = "tel";
      auth46LoginInput.placeholder = "+380...";
      auth46LoginLabel.textContent = currentLang === "uk" ? "Телефон" : "Phone";
    }
  }

  auth46ClearErrors();
}

function auth46Show(reason = "required") {
  document.body.classList.add("auth-v46-required");
  auth46Screen?.setAttribute("aria-hidden", "false");

  if (reason === "upgrade") {
    document.body.classList.add("auth-v46-upgrade");
    auth46SetMode("register");
  }

  // Старый экран и старый state больше не должны влиять.
  document.body.classList.remove("auth-required");
}

function auth46Hide() {
  document.body.classList.remove("auth-v46-required", "auth-v46-upgrade", "auth-required");
  auth46Screen?.setAttribute("aria-hidden", "true");
}

async function auth46Api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = auth46Token();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || payload.ok === false) {
    const error = new Error(payload.message || "API error");
    error.code = payload.error || "API_ERROR";
    error.status = response.status;
    throw error;
  }

  return payload;
}

function auth46MapError(error) {
  const code = error?.code || "";

  if (code === "USER_EXISTS") return "auth46.errorExists";
  if (code === "USER_NOT_FOUND") return "auth46.errorNotFound";
  if (code === "BAD_PASSWORD") return "auth46.errorBadPassword";
  if (code === "PASSWORD_MISMATCH") return "auth46.errorConfirm";
  if (code === "PASSWORD_SHORT") return "auth46.errorPassword";
  if (code === "NAME_SHORT") return "auth46.errorName";
  if (code === "LOGIN_INVALID" || code === "LOGIN_EMPTY") {
    if (auth46.method === "email") return "auth46.errorEmail";
    if (auth46.method === "username") return "auth46.errorUsername";
    return "auth46.errorPhone";
  }

  if (error instanceof TypeError || String(error?.message || "").includes("fetch")) {
    return "auth46.errorBackend";
  }

  return "auth.error.general";
}

function auth46ValidateForm() {
  auth46ClearErrors();

  const name = auth46Name?.value.trim() || "";
  const login = auth46LoginInput?.value.trim() || "";
  const password = auth46Password?.value || "";
  const confirm = auth46Confirm?.value || "";

  if (auth46.mode === "register" && name.length < 2) {
    auth46Name?.classList.add("invalid");
    auth46SetError("auth46.errorName");
    return false;
  }

  if (!auth46ValidateLogin(login, auth46.method)) {
    auth46LoginInput?.classList.add("invalid");
    if (auth46.method === "email") auth46SetError("auth46.errorEmail");
    if (auth46.method === "username") auth46SetError("auth46.errorUsername");
    if (auth46.method === "phone") auth46SetError("auth46.errorPhone");
    return false;
  }

  if (password.length < 6) {
    auth46Password?.classList.add("invalid");
    auth46SetError("auth46.errorPassword");
    return false;
  }

  if (auth46.mode === "register" && password !== confirm) {
    auth46Confirm?.classList.add("invalid");
    auth46SetError("auth46.errorConfirm");
    return false;
  }

  return true;
}

function auth46ApplyPayload(payload) {
  const user = payload?.user || {};
  const profile = user.profile || {};

  auth46.user = user;
  auth46.isGuest = Boolean(payload?.isGuest);
  auth46SaveState();

  authState = {
    isLoggedIn: true,
    isGuest: auth46.isGuest,
    userId: user.id,
    name: user.name || profile.name || "User",
    handle: user.handle || profile.handle || "@user"
  };

  saveAuthState?.();

  const mergedProfile = {
    ...getProfileData(),
    ...profile,
    name: authState.name,
    handle: authState.handle
  };

  localStorage.setItem("nyamiProfile", JSON.stringify(mergedProfile));

  updateProfileUI?.();
  renderTopProfileAvatar?.();
  renderProfileDropdown?.();

  document.body.classList.toggle("guest-mode", auth46.isGuest);
  auth46Hide();
}

async function auth46Register() {
  const payload = await auth46Api("/api/auth/register", {
    method: "POST",
    body: {
      method: auth46.method,
      name: auth46Name?.value.trim() || "",
      login: auth46Normalize(auth46LoginInput?.value || "", auth46.method),
      password: auth46Password?.value || "",
      confirmPassword: auth46Confirm?.value || "",
      profile: getProfileData()
    }
  });

  auth46SetToken(payload.token);
  auth46ApplyPayload(payload);
  showToast?.("toast.auth46Registered");
}

async function auth46LoginUser() {
  const payload = await auth46Api("/api/auth/login", {
    method: "POST",
    body: {
      method: auth46.method,
      login: auth46Normalize(auth46LoginInput?.value || "", auth46.method),
      password: auth46Password?.value || ""
    }
  });

  auth46SetToken(payload.token);
  auth46ApplyPayload(payload);
  showToast?.("toast.auth46LoggedIn");
}

async function auth46SubmitHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (!auth46ValidateForm()) return;

  try {
    auth46Submit?.classList.add("is-loading");
    if (auth46Submit) auth46Submit.textContent = t("auth.loading");

    if (auth46.mode === "register") {
      await auth46Register();
    } else {
      await auth46LoginUser();
    }
  } catch (error) {
    console.error("auth46 failed:", error);
    const key = auth46MapError(error);
    auth46SetError(key);
    showToast?.(key);
  } finally {
    auth46Submit?.classList.remove("is-loading");
    if (auth46Submit) {
      auth46Submit.textContent = t(auth46.mode === "register" ? "auth46.registerBtn" : "auth46.loginBtn");
    }
  }
}

async function auth46GuestHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  try {
    const payload = await auth46Api("/api/auth/guest", {
      method: "POST",
      body: {}
    });

    auth46SetToken(payload.token);
    auth46ApplyPayload(payload);
    document.body.classList.add("guest-mode");
    showToast?.("toast.auth46Guest");
  } catch (error) {
    console.error("guest failed:", error);
    const key = auth46MapError(error);
    auth46SetError(key);
    showToast?.(key);
  }
}

async function auth46Hydrate() {
  // Важливо: старі demo/localStorage сесії ігноруються.
  localStorage.removeItem("nyamiBackendToken");

  if (window.location.protocol === "file:") {
    auth46Show();
    auth46SetError("auth46.errorBackend");
    return;
  }

  const token = auth46Token();
  if (!token) {
    authState = { isLoggedIn: false, isGuest: false, name: "", handle: "" };
    saveAuthState?.();
    document.body.classList.remove("guest-mode");
    auth46Show();
    return;
  }

  try {
    const payload = await auth46Api("/api/auth/me", { method: "GET" });

    if (!payload.authenticated) {
      auth46SetToken("");
      authState = { isLoggedIn: false, isGuest: false, name: "", handle: "" };
      saveAuthState?.();
      document.body.classList.remove("guest-mode");
      auth46Show();
      return;
    }

    auth46ApplyPayload(payload);
    showToast?.("toast.sessionReady");
  } catch (error) {
    console.error("hydrate failed:", error);
    auth46SetToken("");
    authState = { isLoggedIn: false, isGuest: false, name: "", handle: "" };
    saveAuthState?.();
    document.body.classList.remove("guest-mode");
    auth46Show();
    auth46SetError("auth46.errorBackend");
  }
}

function auth46IsGuest() {
  return Boolean(auth46.isGuest || authState?.isGuest);
}

function auth46BlockGuestAction(event) {
  if (!auth46IsGuest()) return;

  const blocked = event.target.closest(`
    #bottomLikeBtn,
    #rightLikeBtn,
    #bottomAddBtn,
    [data-profile-menu-action="edit"],
    [data-settings-action="edit-profile"],
    [data-settings-action="clear-likes"],
    [data-settings-action="clear-playlists"],
    [data-settings-action="clear-all"],
    [data-playlist-create],
    #saveProfileBtn
  `);

  if (!blocked) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  auth46Show("upgrade");
  auth46SetError("auth46.errorGuestBlocked");
  showToast?.("auth46.errorGuestBlocked");
}

async function auth46Logout() {
  try {
    await auth46Api("/api/auth/logout", { method: "POST", body: {} });
  } catch (error) {
    console.warn("auth46 logout api failed:", error);
  }

  auth46SetToken("");
  auth46.user = null;
  auth46.isGuest = false;
  auth46SaveState();

  authState = { isLoggedIn: false, isGuest: false, name: "", handle: "" };
  saveAuthState?.();

  document.body.classList.remove("guest-mode");
  closeProfileDropdown?.();
  auth46SetMode("login");
  auth46Show();

  showToast?.("toast.logoutSuccess");
}

// Перехоплюємо старий logout, щоб він працював через v46.
logoutUser = auth46Logout;

// Перехоплюємо оновлення профілю для backend v46.
syncCurrentProfileToAuthUser = async function syncCurrentProfileToAuthUserV46() {
  if (!auth46Token() || auth46IsGuest()) return;

  try {
    const payload = await auth46Api("/api/profile", {
      method: "PUT",
      body: { profile: getProfileData() }
    });

    if (payload?.profile) {
      const profile = payload.profile;
      localStorage.setItem("nyamiProfile", JSON.stringify({
        ...getProfileData(),
        ...profile
      }));
      updateProfileUI?.();
      renderTopProfileAvatar?.();
      renderProfileDropdown?.();
    }
  } catch (error) {
    console.warn("profile sync failed:", error);
  }
};

// События в capture-фазе, чтобы старые handler-ы не могли сработать первыми.
auth46Form?.addEventListener("submit", auth46SubmitHandler, true);
auth46Guest?.addEventListener("click", auth46GuestHandler, true);

auth46ModeButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    auth46SetMode(button.dataset.auth46Mode);
  }, true);
});

auth46MethodButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    auth46SetMethod(button.dataset.auth46Method);
  }, true);
});

[auth46Name, auth46LoginInput, auth46Password, auth46Confirm].forEach((input) => {
  input?.addEventListener("input", auth46ClearErrors, true);
});

document.addEventListener("click", auth46BlockGuestAction, true);

// Початковий стан нового auth.
auth46SetMethod("email");
auth46SetMode("login");
auth46Hydrate();


/* v53-external-source-player-bridge
   Upload + Direct URL go into the native player.
   YouTube + Spotify stay as external source cards. */
(() => {
  "use strict";

  function fallbackCoverV53(sourceType = "") {
    if (sourceType === "youtube") return "assets/covers/cover3.jpg";
    if (sourceType === "spotify") return "assets/covers/cover4.jpg";
    return "assets/covers/nowplaying.jpg";
  }

  function safeTextV53(value, fallback) {
    const text = String(value ?? "").trim();
    return text || fallback;
  }

  function sourceTypeV53(raw) {
    return String(raw?.sourceType || raw?.provider || "upload").toLowerCase();
  }

  function isPlayableServerTrackV53(raw) {
    const sourceType = sourceTypeV53(raw);
    const audioUrl = raw?.audioUrl || raw?.musicUrl || raw?.file || "";
    return raw?.isPlayable !== false && (sourceType === "upload" || sourceType === "direct") && !!audioUrl;
  }

  function serverTrackKeyV53(track) {
    if (!track) return "";
    if (track.source === "server-v48") return `server:${track.serverId}`;
    return `local:${track.file || ""}:${track.title || ""}:${track.artist || ""}`;
  }

  function normalizePlayableServerTrackV53(raw) {
    const sourceType = sourceTypeV53(raw);
    const audioFile = raw.audioUrl || raw.musicUrl || raw.file || "";
    const coverFile = raw.coverUrl || raw.cover || fallbackCoverV53(sourceType);

    return {
      title: safeTextV53(raw.title, "Untitled"),
      artist: safeTextV53(raw.artist, "Unknown artist"),
      vibe: "new",
      category: "new",
      duration: sourceType === "direct" ? "URL" : "server",
      cover: coverFile,
      file: audioFile,
      source: "server-v48",
      sourceType,
      sourceLabel: raw.sourceLabel || (sourceType === "direct" ? "Direct URL" : "Server"),
      serverId: String(raw.id ?? raw.serverId ?? audioFile),
      uploadedAt: raw.createdAt || raw.updatedAt || "",
      isServerTrack: true,
      isExternalDirect: sourceType === "direct"
    };
  }

  function preserveCurrentTrackAfterMergeV53(previousKey) {
    if (!tracks.length) {
      currentIndex = 0;
      return;
    }

    const nextIndex = previousKey
      ? tracks.findIndex((track) => serverTrackKeyV53(track) === previousKey)
      : currentIndex;

    if (nextIndex >= 0) {
      currentIndex = nextIndex;
    } else {
      currentIndex = Math.max(0, Math.min(currentIndex, tracks.length - 1));
    }
  }

  function refreshMainPlayerUiV53() {
    try { updateCurrentUI(); } catch {}
    try { renderTracks(); } catch {}
    try { renderSearchPopover(); } catch {}
    try { renderUserPlaylists(); } catch {}
    try { updatePlayButtons(); } catch {}
  }

  function mergeServerTracksV53(rawTracks = []) {
    if (!Array.isArray(rawTracks)) rawTracks = [];

    const previousTrack = tracks[currentIndex] || null;
    const previousKey = serverTrackKeyV53(previousTrack);

    const playable = rawTracks
      .filter(isPlayableServerTrackV53)
      .map(normalizePlayableServerTrackV53);

    const external = rawTracks.filter((track) => !isPlayableServerTrackV53(track));

    for (let index = tracks.length - 1; index >= 0; index -= 1) {
      if (tracks[index]?.source === "server-v48") {
        tracks.splice(index, 1);
      }
    }

    tracks.unshift(...playable);
    window.nyamiExternalSourcesV53 = external;

    preserveCurrentTrackAfterMergeV53(previousKey);

    document.body.classList.toggle("has-server-tracks-v48", playable.length > 0);
    document.body.classList.toggle("has-external-sources-v53", external.length > 0);
    refreshMainPlayerUiV53();

    return { playable, external };
  }

  function playServerTrackByIdV53(serverId) {
    const targetIndex = tracks.findIndex((track) => (
      track?.source === "server-v48" &&
      String(track.serverId) === String(serverId)
    ));

    if (targetIndex < 0) return false;

    currentIndex = targetIndex;
    loadTrack(currentIndex);
    playTrack();
    renderTracks();

    return true;
  }

  function playServerTrackV53(rawTrack) {
    if (!isPlayableServerTrackV53(rawTrack)) {
      const page = rawTrack?.pageUrl || rawTrack?.externalUrl;
      if (page) window.open(page, "_blank", "noopener,noreferrer");
      return false;
    }

    const normalized = normalizePlayableServerTrackV53(rawTrack);
    const existingIndex = tracks.findIndex((track) => (
      track?.source === "server-v48" &&
      String(track.serverId) === String(normalized.serverId)
    ));

    if (existingIndex >= 0) {
      currentIndex = existingIndex;
    } else {
      tracks.unshift(normalized);
      currentIndex = 0;
    }

    loadTrack(currentIndex);
    playTrack();
    renderTracks();

    return true;
  }

  function selectTrackByServerIdV53(serverId) {
    const targetIndex = tracks.findIndex((track) => (
      track?.source === "server-v48" &&
      String(track.serverId) === String(serverId)
    ));

    if (targetIndex < 0) return false;

    currentIndex = targetIndex;
    loadTrack(currentIndex);
    updateCurrentUI();
    renderTracks();

    return true;
  }

  audio.addEventListener("loadedmetadata", () => {
    const track = tracks[currentIndex];
    if (!track || track.source !== "server-v48") return;
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const realDuration = formatTime(audio.duration);
    if (track.duration !== realDuration) {
      track.duration = realDuration;
      renderTracks();
    }
  });

  audio.addEventListener("error", () => {
    const track = tracks[currentIndex];
    if (track?.source === "server-v48") {
      isPlaying = false;
      updatePlayButtons();
      showToast("toast.autoplayBlocked");
    }
  });

  window.NyamiPlayerBridgeV52 = {
    mergeServerTracks: (rawTracks) => mergeServerTracksV53(rawTracks).playable,
    playServerTrackById: playServerTrackByIdV53,
    playServerTrack: playServerTrackV53,
    selectTrackByServerId: selectTrackByServerIdV53,
    refreshMainPlayerUi: refreshMainPlayerUiV53
  };

  window.NyamiPlayerBridgeV53 = {
    mergeServerTracks: mergeServerTracksV53,
    playServerTrackById: playServerTrackByIdV53,
    playServerTrack: playServerTrackV53,
    selectTrackByServerId: selectTrackByServerIdV53,
    refreshMainPlayerUi: refreshMainPlayerUiV53,
    isPlayableServerTrack: isPlayableServerTrackV53
  };
})();

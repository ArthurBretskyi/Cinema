<template>
    <!-- Зовнішній контейнер — займає весь вьюпорт по висоті -->
    <section class="hero">

        <!-- ═══════════════════════════════════════════
             ШАР 1: Фонове зображення (backdrop або постер)
             Змінюється при перемиканні фільму через transition
        ════════════════════════════════════════════ -->
        <transition name="hero-bg">
            <!-- :key — Vue бачить що зображення змінилось і запускає анімацію -->
            <div class="hero__bg" :key="movie?.movieId" :style="bgStyle" />
        </transition>

        <!-- ═══════════════════════════════════════════
             ШАР 2: Градієнт знизу
             Темніє знизу — текст завжди читабельний поверх будь-якого постера
        ════════════════════════════════════════════ -->
        <div class="hero__gradient" />

        <!-- ═══════════════════════════════════════════
             ШАР 3: Контент (інфо + стрілки)
             Завжди поверх зображення і градієнту
        ════════════════════════════════════════════ -->
        <div class="hero__content">

            <!-- Інфо про фільм — анімується при зміні активного фільму -->
            <transition name="hero-info">
                <div class="hero__info" :key="movie?.movieId" v-if="movie">

                    <!-- Мітки: рік, вік, жанр, тривалість -->
                    <div class="hero__meta">
                        <span>{{ movie.releaseDate?.split('-')?.[0] }}</span>
                        <span class="hero__meta-dot">·</span>
                        <span>{{ movie.age || '12+' }}</span>
                        <span class="hero__meta-dot">·</span>
                        <span>{{ (movie.genre || []).join(', ') }}</span>
                        <span class="hero__meta-dot">·</span>
                        <span>{{ movie.duration ? `${movie.duration} хв` : '' }}</span>
                    </div>

                    <!-- Назва фільму -->
                    <h1 class="hero__title">{{ movie.title }}</h1>

                    <!-- Опис — показується тільки якщо infoOpen === true -->
                    <!-- max-height + overflow: hidden + transition = плавне розгортання -->
                    <div class="hero__description" :class="{ 'is-open': infoOpen }">
                        <p>{{ movie.description }}</p>
                    </div>

                    <!-- Кнопки дій -->
                    <div class="hero__actions">
                        <!-- Кнопка "Деталі" — розгортає/згортає опис -->
                        <button class="hero__btn hero__btn--info" @click="$emit('toggle-info')">
                            {{ infoOpen ? 'Сховати' : 'Детальніше' }}
                            <!-- Стрілка обертається через CSS клас is-open -->
                            <span class="hero__btn-arrow" :class="{ 'is-open': infoOpen }">↓</span>
                        </button>

                        <!-- Кнопка трейлера — emit вгору до батьківського компонента -->
                        <button class="hero__btn hero__btn--trailer" @click="$emit('play-trailer', movie.trailerUrl)">
                            <font-awesome-icon icon="fa-brands fa-youtube" />
                            Трейлер
                        </button>
                    </div>

                </div>
            </transition>

            <!-- ─── Стрілки навігації ─── -->
            <div class="hero__nav">
                <button class="hero__arrow" @click="$emit('prev')" aria-label="Попередній фільм">‹</button>
                <button class="hero__arrow" @click="$emit('next')" aria-label="Наступний фільм">›</button>
            </div>

        </div>

    </section>
</template>

<script setup>
import { computed } from 'vue'

// ─── Props ───────────────────────────────────────────────────────────────────
// movie    — об'єкт активного фільму (з батьківського компонента)
// infoOpen — чи розгорнутий блок з описом (теж контролює батько)
const props = defineProps({
    movie: { type: Object, default: null },
    infoOpen: { type: Boolean, default: false },
})

// ─── Emits ───────────────────────────────────────────────────────────────────
// Цей компонент нічого сам не змінює — тільки повідомляє батька
// prev         — натиснута стрілка ліворуч
// next         — натиснута стрілка праворуч
// toggle-info  — натиснута кнопка "Детальніше"
// play-trailer — натиснута кнопка трейлера, передає URL
defineEmits(['prev', 'next', 'toggle-info', 'play-trailer'])

// ─── Computed ────────────────────────────────────────────────────────────────
// Стиль фонового зображення — береться backdropUrl або posterUrl фільму
const bgStyle = computed(() => {
    const img = props.movie?.backdropUrl || props.movie?.posterUrl
    if (!img) return {}
    return { backgroundImage: `url(${img})` }
})
</script>

<style lang="scss" scoped>
// ─── Головний контейнер ──────────────────────────────────────────────────────
.hero {
    position: relative;
    width: 100%;
    height: 90vh; // займає 90% висоти вікна браузера
    overflow: hidden;
    display: flex;
    align-items: flex-end; // контент притиснутий до низу
}

// ─── ШАР 1: Фонове зображення ────────────────────────────────────────────────
.hero__bg {
    position: absolute;
    inset: 0; // розтягується на весь батьківський елемент (top/right/bottom/left: 0)
    background-size: cover;
    background-position: center top;
    transform: scale(1.05); // трохи більше ніж контейнер — щоб при transition не було білих країв
}

// ─── ШАР 2: Градієнт ─────────────────────────────────────────────────────────
.hero__gradient {
    position: absolute;
    inset: 0;
    // Прозорий зверху → темний знизу
    background: linear-gradient(to bottom,
            transparent 30%, // перші 30% — повністю прозорі (видно постер)
            rgba(0, 0, 0, 0.6) 65%, // плавний перехід
            rgba(13, 13, 17, 0.95) 100% // знизу майже непрозорий (колір $background-color)
        );
    z-index: 1;
}

// ─── ШАР 3: Контент ──────────────────────────────────────────────────────────
.hero__content {
    position: relative;
    z-index: 2; // поверх градієнту і фону
    width: 100%;
    // padding: 0 0 2.5rem 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
}

// ─── Інфо блок ───────────────────────────────────────────────────────────────
.hero__info {
    flex: 1;
    padding-left: 2rem;
    max-width: 700px;
}

.hero__meta {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    color: $text-color;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
}

.hero__meta-dot {
    color: $decor-color-third; // зелена крапка-розділювач
}

.hero__title {
    font-size: clamp(1.8rem, 4vw, 3rem); // адаптивний розмір: мін 1.8, макс 3rem
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1rem;
    color: $primary-color;
}

// ─── Опис (розгортання) ──────────────────────────────────────────────────────
.hero__description {
    max-height: 0; // схований за замовчуванням
    overflow: hidden;
    transition: max-height 0.4s ease;

    &.is-open {
        max-height: 200px; // розгортається до максимуму
    }

    p {
        color: $text-color;
        line-height: 1.6;
        margin-bottom: 1rem;
        max-width: 600px;
    }
}

// ─── Кнопки ──────────────────────────────────────────────────────────────────
.hero__actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.hero__btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.4rem;
    border-radius: 2rem;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &--info {
        background: transparent;
        border: 1px solid $text-color;
        color: $primary-color;

        &:hover {
            border-color: $decor-color-third;
            color: $decor-color-third;
        }
    }

    &--trailer {
        background: transparent;
        border: 1px solid transparent;
        color: $primary-color;

        &:hover {
            color: $decor-color-third;
        }
    }
}

// Стрілка в кнопці "Детальніше" — обертається при відкритті
.hero__btn-arrow {
    display: inline-block;
    transition: transform 0.3s ease;

    &.is-open {
        transform: rotate(180deg); // ↓ стає ↑
    }
}

// ─── Навігаційні стрілки ─────────────────────────────────────────────────────
.hero__nav {
    display: flex;
    gap: 0.5rem;
    padding-right: 2rem;
    padding-bottom: 0.25rem;
}

.hero__arrow {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: $primary-color;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px); // розмиває те що за кнопкою

    &:hover {
        background: rgba(61, 244, 70, 0.2);
        border-color: $decor-color-third;
        color: $decor-color-third;
    }
}

// ─── Анімації ────────────────────────────────────────────────────────────────

// Фон: плавне перехрещення (crossfade)
// position: absolute на обох станах дозволяє їм перекриватись
.hero-bg-enter-active,
.hero-bg-leave-active {
    transition: opacity 0.7s ease;
    position: absolute;
    inset: 0;
}

.hero-bg-enter-from {
    opacity: 0;
}

.hero-bg-leave-to {
    opacity: 0;
}

// Інфо: з'являється знизу
.hero-info-enter-active {
    transition: opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s; // затримка 0.3s — чекає поки фон зміниться
}

.hero-info-leave-active {
    transition: opacity 0.2s ease;
}

.hero-info-enter-from {
    opacity: 0;
    transform: translateY(16px); // з'являється знизу вгору
}

.hero-info-leave-to {
    opacity: 0;
}
</style>
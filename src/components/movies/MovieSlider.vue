<template>
    <div class="tilt-slider" @keydown.left.prevent="prev" @keydown.right.prevent="next" tabindex="0">
        <button class="nav prev" @click="prev" aria-label="Prev">‹</button>

        <div class="track" ref="trackRef" @pointerdown="onPointerStart" @pointermove="onPointerMove"
            @pointerup="onPointerEnd" @pointerleave="onPointerEnd">
            <div v-for="(m, i) in movies" :key="m.movieId" :class="['item', { active: activeIndex === i }]"
                @click="selectIndex(i)" @pointerenter="onEnter(i, $event)" @pointerleave="onLeave(i)" ref="slideEls">
                <div class="poster-wrap" :style="posterStyle(m)">
                    <img :src="m.posterUrl" :alt="m.title" class="poster" />
                </div>
            </div>
        </div>

        <button class="nav next" @click="next" aria-label="Next">›</button>
    </div>
</template>
  
<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
    movies: { type: Array, default: () => [] },
    activeId: String,
})
const emit = defineEmits(['select'])

const activeIndex = ref(0)
const slideEls = ref([])
const trackRef = ref(null)

// init activeIndex from activeId
onMounted(() => {
    const idx = props.movies.findIndex(m => m.movieId === props.activeId)
    if (idx >= 0) activeIndex.value = idx
    // focus to allow keyboard control
    nextTick(() => trackRef.value?.focus?.())
})

watch(() => props.activeId, (v) => {
    const idx = props.movies.findIndex(m => m.movieId === v)
    if (idx >= 0) activeIndex.value = idx
})

watch(activeIndex, (idx) => {
    emit('select', props.movies[idx])
    // smooth center: scroll the track so active is centered (works if overflow)
    centerActive()
})

function selectIndex(i) {
    activeIndex.value = i
}

function prev() {
    if (props.movies.length === 0) return
    activeIndex.value = (activeIndex.value - 1 + props.movies.length) % props.movies.length
}
function next() {
    if (props.movies.length === 0) return
    activeIndex.value = (activeIndex.value + 1) % props.movies.length
}

// center active slide in track (if overflow)
function centerActive() {
    const track = trackRef.value
    const els = track?.querySelectorAll('.item')
    if (!track || !els || !els[activeIndex.value]) return
    const el = els[activeIndex.value]
    const trackRect = track.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const offset = (elRect.left + elRect.width / 2) - (trackRect.left + trackRect.width / 2)
    track.scrollBy({ left: offset, behavior: 'smooth' })
}

/* pointer-based simple swipe (horizontal) */
let pointer = { startX: 0, dragging: false }
function onPointerStart(e) {
    pointer.startX = e.clientX
    pointer.dragging = true
}
function onPointerMove(e) {
    if (!pointer.dragging) return
    const dx = e.clientX - pointer.startX
    if (Math.abs(dx) > 80) {
        if (dx < 0) next()
        else prev()
        pointer.dragging = false
    }
}
function onPointerEnd() { pointer.dragging = false }

/* tilt effect handlers */
function onEnter(i, ev) {
    const el = ev.currentTarget
    el.style.transition = 'transform 200ms ease'
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const offsetX = ev.clientX - cx
    const offsetY = ev.clientY - cy
    const rx = (-offsetY / rect.height) * 8 // tilt intensity
    const ry = (offsetX / rect.width) * 8
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${activeIndex.value === i ? 1.03 : 1})`
}
function onLeave(i) {
    const els = document.querySelectorAll('.tilt-slider .item')
    const el = els[i]
    if (!el) return
    el.style.transform = ''
    el.style.transition = 'transform 300ms cubic-bezier(.2,.9,.3,1)'
}

/* posterStyle small: add subtle parallax background gradient */
function posterStyle(m) {
    return {}
}
</script>
  
<style scoped lang="scss">
.tilt-slider {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    outline: none;
}

.track {
    display: flex;
    gap: 18px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 18px;
    flex: 1 1 auto;
    scrollbar-width: none;
}

.track::-webkit-scrollbar {
    display: none;
}

.item {
    flex: 0 0 280px;
    height: 460px;
    border-radius: 12px;
    overflow: visible;
    transform-origin: center center;
    transition: transform 300ms, box-shadow 300ms, opacity 300ms;
    cursor: pointer;
    position: relative;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
    will-change: transform;
    opacity: 0.7;
    filter: saturate(0.95) brightness(0.9);
}

.item.active {
    transform: scale(1.06);
    opacity: 1;
    filter: none;
    z-index: 3;
    box-shadow: 0 2px 8px rgba(61, 244, 70, 0.5);

}

.poster-wrap {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.18));
}

.poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    pointer-events: none;
}

.nav {
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    border: none;
    width: 44px;
    height: 44px;
    font-size: 26px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav:hover {
    background: rgba(0, 0, 0, 0.6);
}
</style>
  
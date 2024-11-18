<template>
  <NuxtPage page-key="stories" />
  <h1>Grimm's Stories</h1>
  <div class="page-header">
    <input
      v-model="searchQuery"
      placeholder="Search..."
      class="search-query"
    />
  </div>

  <div class="two-pane-layout">
    <!-- Story table -->
    <div
      class="stories-container"
    >
      <div
        v-if="filteredItems?.length"
        v-for="(item, idx) in filteredItems"
        class="row"
        @click="openSlideout(item?.docId)"
      >
        <h3 class="title"> {{ item?.name }}</h3>
        <div> {{ item?.snippet }}</div>
      </div>
      <div
        v-else
        class="empty-state"
      >
        <p>No stories found</p>
      </div>
    </div>

    <!-- Side pane for story details -->
    <div class="slideout-container">
      <transition name="slideout">
        <div
          v-if="slideoutOpen && singleStory?.content"
          class="slideout-panel"
        >
          {{ singleStory.content }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { StorySnippet, StoryFull } from '@/types'
import { debounce } from '@/utils'

const singleStory: Ref<StoryFull> = ref({} as StoryFull)
const slideoutOpen = ref(false)
const searchQuery = ref('')

const filteredItems: Ref<StorySnippet[] | null> = ref([] as StorySnippet[])

const openSlideout = async(storyId: string) => {
  slideoutOpen.value = true
  const { data, error }= await useFetch<StoryFull>(`/api/stories/${storyId}`)

  if (data.value && !error.value) {
    singleStory.value = data.value
  } else {
    // Too: Handle error with toaster message
  }
}

watch(searchQuery, () => {
  debounce(() => {
    filteredItems.value = query(searchQuery.value)
  }, 750)()
})

onMounted(async() => {
  const { data: allStories } = await useFetch('/api/stories')
  filteredItems.value = allStories.value
})

</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  margin-bottom: 10px;
}

.two-pane-layout {
  display: flex;
  flex-direction: row;
  row-gap: 16px;
  column-gap: 16px;
  background: #fafafa;
  padding: 20px;


  @media only screen and (max-width : 1024px) {
    flex-direction: column;
  }

  .stories-container {
    display: flex;
    flex-direction: column;
    width: 50%;
    row-gap: 20px;
    column-gap: 20px;

    @media only screen and (max-width : 1024px) {
      width: 100%;
    }

    .row {
      background: #ffffff;
      color: #999;
      filter: drop-shadow(0 10px 8px rgba(0,0,0,.04)) drop-shadow(0 4px 3px rgba(0,0,0,.1));
      border-radius: 10px;
      padding: 10px;
      transition: opacity 0.25s ease-in;
      pointer-events: all;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .title {
        font-weight: 800;
      }

      snippet {
        font-size: 10px;
      }
    }
  }

  .slideout-container {
    display: flex;
    background: white;
    height: 100vh;
    width: 400px;
    max-height: 60vh;
    border: 1px solid gray;
    overflow: hidden;
    border-radius: 20px;
    width: 50%;

    @media only screen and (max-width : 1024px) {
      width: 100%;
    }

    .slideout-panel {
      display: flex;
      flex-grow: 1;
      border-radius: 20px;
      padding: 20px;
      height: 100%;
      line-height: 1.75;
      width: 100%;
      font-size: 10px;
      color: black;
      text-overflow: ellipsis;
      overflow: scroll;
      transition: all 0.3s ease-in;
    }
  }
}

/* Transition */

.slideout-enter-active,
.slideout-leave-active {
  transition: opacity 0.3s ease;
}
.slideout-enter-from,
.slideout-leave-to {
  opacity: 0;
}
</style>

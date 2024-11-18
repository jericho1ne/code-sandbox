interface Story {
  docId: string
  name: string
}

export interface StorySnippet extends Story {
  snippet: string
}
export interface StoryFull extends Story {
  content: string
}

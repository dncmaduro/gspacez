export const previewTags = (tags: string[] | null) => {
  if (!tags) {
    return {
      visibleTags: [],
      restTags: 0
    }
  }

  let sum = 0
  let visible = 0
  for (let i = 0; i < tags.length; i++) {
    sum += tags[i].length
    visible++
    if (sum >= 20) {
      break
    }
  }

  return {
    visibleTags: tags.slice(0, visible),
    restTags: tags.length - visible
  }
}

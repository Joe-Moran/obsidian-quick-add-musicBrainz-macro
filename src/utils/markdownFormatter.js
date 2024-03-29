function formatAsWikiLink(textToLinkify) {
  return `[[${textToLinkify}]]`;
}

function formatAsEmbeddedImageLink(imagePath) {
  return `"![img](${imagePath})"`;
}

function formatAsTag(textToTagify) {
  return `#${textToTagify.replace(/\s/g, "-").toLowerCase()}`;
}

function formatAsTags(tags) {
  if (tags.length === 0) return "";
  if (tags.length === 1) return formatAsTag(tags[0]);

  return tags.map((item) => formatAsTag(item.trim())).join(", ");
}

function formatSearchResultSuggestion({ title, artistName, releaseDate, tags = [] }) {
  return `${title} - ${artistName} (${releaseDate}) - ${formatAsTags(tags)}`;
}

function formatAsFrontmatterList(frontmatterValues) {
  return `[${frontmatterValues.join(", ")}]`;
}

export {
  formatAsWikiLink,
  formatAsEmbeddedImageLink,
  formatAsTag,
  formatAsTags,
  formatSearchResultSuggestion,
  formatAsFrontmatterList,
}

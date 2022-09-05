export default class CoverArtPathFactory {
  static buildCoverArtArchivePath(entityId) {
    return `https://coverartarchive.org/release-group/${entityId}/front`;
  }
}

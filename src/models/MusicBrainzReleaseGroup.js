export default class MusicBrainzReleaseGroup {
  constructor(musicBrainzReleaseGroup) {
    this.primaryType = musicBrainzReleaseGroup['primary-type'];
    this.title = musicBrainzReleaseGroup.title;
    this.artist = musicBrainzReleaseGroup.artist;
    this.tags = musicBrainzReleaseGroup.tags;
    this.date = musicBrainzReleaseGroup.date;
    this.id = musicBrainzReleaseGroup.id;
    this.cover = musicBrainzReleaseGroup.cover;
  }
}

export default class ReleaseGroup {
  constructor({id, title, artistName, genres, releaseDate, coverPath}) {
    this.title = title;
    this.artistName = artistName;
    this.genres = genres;
    this.releaseDate = releaseDate;
    this.id = id;
    this.coverPath = coverPath;
  }
}

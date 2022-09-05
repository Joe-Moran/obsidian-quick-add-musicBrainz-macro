const ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN = /[\\,#%&{}/*<>?$'":@]*/g;

import templateValues from "../data/obsidianTemplateAlbumValues";
export default class ObsidianTemplateAlbum {
  constructor({
    musicbrainzId = "",
    title = "",
    releaseDate = "",
    artistName = "",
    genres = "",
    ownedFormats = "",
    rating = "",
    coverPath = "",
  }) {
    this[templateValues.ID] = musicbrainzId;
    this[templateValues.TITLE] = title;
    this[templateValues.RELEASE_DATE] = releaseDate;
    this[templateValues.ARTIST] = artistName;
    this[templateValues.GENRES] = genres;
    this[templateValues.OWNED_FORMATS] = ownedFormats;
    this[templateValues.RATING] = rating;
    this[templateValues.COVER_PATH] = coverPath;
    this.fileName = this.title.replace(ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN, "");
  }

}

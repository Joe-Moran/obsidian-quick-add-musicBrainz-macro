import {
  formatAsWikiLink,
  formatAsEmbeddedImageLink,
  formatAsTags,
} from "../utils/markdownFormatter";
import ObsidianTemplateAlbum from "./ObsidianTemplateAlbum";

export default class ObsidianTemplateAlbumFactory {
  static buildFromQuickAddUserInput({
    id,
    releaseDate,
    title,
    artistName,
    coverPath,
    genres,
    ownedFormats,
    rating,
  }) {
    return new ObsidianTemplateAlbum({
      title: title,
      releaseDate: releaseDate,
      artist: formatAsWikiLink(artistName),
      genres: formatAsTags(genres),
      ownedFormats: formatAsTags(ownedFormats),
      rating,
      coverPath: formatAsEmbeddedImageLink(coverPath),
      musicbrainzId: id,
    });
  }
}

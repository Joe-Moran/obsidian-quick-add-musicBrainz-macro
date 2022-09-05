import {
  formatAsEmbeddedImageLink,
  formatAsFrontmatterList,
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
      date: releaseDate,
      artist: artistName,
      genres: formatAsFrontmatterList(genres),
      formats: formatAsFrontmatterList(ownedFormats),
      rating,
      musicbrainzId: id,
      cover: formatAsEmbeddedImageLink(coverPath),
    });
  }
}

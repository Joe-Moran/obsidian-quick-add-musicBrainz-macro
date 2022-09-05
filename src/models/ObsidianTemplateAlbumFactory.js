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
      releaseDate: releaseDate,
      artistName: artistName,
      genres: formatAsFrontmatterList(genres),
      ownedFormats: formatAsFrontmatterList(ownedFormats),
      rating,
      id: `"${id}"`,
      coverPath: formatAsEmbeddedImageLink(coverPath),
    });
  }
}

import CoverArtPathFactory from "./CoverArtPathFactory";
import ReleaseGroup from "./ReleaseGroup"

const ENTITY_ARTIST_CREDIT_KEY = "artist-credit";
const ENTITY_RELEASE_DATE = 'first-release-date';

export default class ReleaseGroupFactory {

  static buildFromApi(releaseGroupAPIResponse) {
    return new ReleaseGroup({
      id: releaseGroupAPIResponse.id,
      title: releaseGroupAPIResponse.title,
      artistName: releaseGroupAPIResponse[ENTITY_ARTIST_CREDIT_KEY][0].name,
      genres: releaseGroupAPIResponse.tags?.map((tag) => tag.name) || [],
      releaseDate: releaseGroupAPIResponse[ENTITY_RELEASE_DATE],
      coverPath: CoverArtPathFactory.buildCoverArtArchivePath(releaseGroupAPIResponse.id)
    });
  }
}

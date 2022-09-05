import musicBrainzReleaseGroupTypes from "../data/musicBrainzReleaseGroupTypes";
import musicBrainzSearchResultTypes from "../data/musicBrainzSearchResultTypes";
import ReleaseGroupFactory from "./ReleaseGroupFactory";

function isAlbumReleaseGroup(releaseGroup) {
  return releaseGroup["primary-type"] === musicBrainzReleaseGroupTypes.ALBUM;
}

export default class ReleaseGroupSearchResultsFactory {
  static buildAlbumResults(releaseGroupSearchResults) {
    return releaseGroupSearchResults[
      musicBrainzSearchResultTypes.RELEASE_GROUPS
    ]
      .filter(isAlbumReleaseGroup)
      .map(ReleaseGroupFactory.buildFromApi);
  }
}

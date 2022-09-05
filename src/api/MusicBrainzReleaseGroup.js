import { buildRequestPath } from "../utils/musicBrainzRequestBuilder";

const URI = "https://beta.musicbrainz.org/ws/2/release-group";

export default class MusicBrainzReleaseGroup {
  static async get([ release, artist ]) {
    return JSON.parse(
      // eslint-disable-next-line no-undef
      await request({
        url: buildRequestPath(URI, { release, artist }).href,
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "ObsidianQuickAddMacro ( joemoran231@gmail.com )",
        },
      })
    );
  }
}

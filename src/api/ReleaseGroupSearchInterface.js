import { formatSearchResultSuggestion } from "../utils/markdownFormatter";
import quickAddPrompts from "../data/quickAddPrompts";
import ObsidianTemplateAlbumFactory from "../models/ObsidianTemplateAlbumFactory";
import MusicBrainzReleaseGroup from "./MusicBrainzReleaseGroup";
import ReleaseGroupSearchResultsFactory from "../models/ReleaseGroupSearchResultsFactory";

export default class ReleaseGroupSearchInterface {
  constructor(quickAddParams) {
    this.quickAddParams = quickAddParams;
    this.releaseGroupSearchResults = [];
  }

  get api() {
    return this.quickAddParams.quickAddApi;
  }

  async addAlbum() {
    const searchQueryValues = await this.showInitialPrompts();
    const albumSuggestions = await MusicBrainzReleaseGroup.get(
      searchQueryValues
    );
    const userSelections = await this.getUserSelections(
      ReleaseGroupSearchResultsFactory.buildAlbumResults(albumSuggestions)
    );
    return this.setObsidianTemplateValues(userSelections);
  }

  /**
   *
   * @returns {Promise<Object>} The user-entered data for searching for a release
   */
  showInitialPrompts() {
    return Promise.all([this.promptUserForAlbum(), this.promptUserForArtist()]);
  }

  /**
   *
   * @param {ReleaseData[]} suggestions
   * @returns {Promise<ReleaseData} The chosen release with which to proceed adding via QuickAdd, as selected by user
   */
  promptSuggestionsFromSearchResults(suggestions) {
    return this.api.suggester(
      suggestions.map(formatSearchResultSuggestion),
      suggestions
    );
  }

  /**
   *
   * @returns {Promise<object>}
   * @property {string} rating
   * @property {Array<string>} ownedFormats
   */
  promptUserForCustomDataAttributes() {
    return Promise.all([
      this.promptUserForRating(),
      this.promptUserForOwnedFormats(),
    ]).then(([rating, ownedFormats]) => ({
      rating,
      ownedFormats,
    }));
  }

  /**
   * @returns {Promise<Array>} The formats of the release that the user owns; returns empty if user does not own release
   */
  promptUserForOwnedFormats() {
    return this.api.checkboxPrompt(quickAddPrompts.formatsOwned.options);
  }

  /**
   *
   * @returns {Promise<string>} The subjective rating of the release, as enterd by user
   */
  promptUserForRating() {
    return this.api.suggester(
      quickAddPrompts.rating.options,
      quickAddPrompts.rating.options
    );
  }

  /**
   *
   * @returns {Promise<String>} The album title, as entered by user
   */
  promptUserForAlbum() {
    return this.api.inputPrompt(quickAddPrompts.albumTitle);
  }

  /**
   *
   * @returns {Promise<String>} The artist, as entered by user
   */
  promptUserForArtist() {
    return this.api.inputPrompt(quickAddPrompts.artist);
  }

  async getUserSelections(searchResults) {
    const selectedAlbum = await this.promptSuggestionsFromSearchResults(
      searchResults
    );
    const metadataValues = await this.promptUserForCustomDataAttributes();

    return { selectedAlbum, metadataValues };
  }

  setObsidianTemplateValues({ selectedAlbum, metadataValues }) {
    this.quickAddParams.variables =
      ObsidianTemplateAlbumFactory.buildFromQuickAddUserInput({
        ...selectedAlbum,
        ...metadataValues,
      });
  }

  setSearchParameterValues(searchParameterValues) {
    this.searchParameterValues = searchParameterValues;
  }

  searchForReleaseGroups({ albumTitle, artist }) {
    return this.fetchReleaseGroupSearchResults({ release: albumTitle, artist });
  }

  fetchReleaseGroupSearchResults({ release, artist }) {
    return MusicBrainzReleaseGroup.get({ release, artist });
  }
}

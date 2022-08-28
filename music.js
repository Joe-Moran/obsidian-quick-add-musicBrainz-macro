module.exports = {
  entry: start,
  settings: {
    name: "Music Script",
    author: "Joe Moran",
  },
};

const notice = (msg) => new Notice(msg, 5000);

const musicBrainzEntityTypes = {
  RELEASE: 'release',
  RELEASE_GROUP: 'release-group',
};

const musicBrainzEntityQuery = {
  [musicBrainzEntityTypes.RELEASE]: 'releases',
  [musicBrainzEntityTypes.RELEASE_GROUP]: 'release-groups'
};

const ENTITY_ARTIST_CREDIT_KEY = "artist-credit";


function getMusicBrainzEntityQueryByEntityType(entityType) {
  return musicBrainzEntityQuery[entityType];
}

const MUSICBRAINZ_ENTITY_TYPE = musicBrainzEntityTypes.RELEASE_GROUP;

let QuickAdd;
let Settings;

const prompts = {
  albumTitle: "Album: ",
  artist: "Artist: ",
  ownership: "Do you own this record?",
  formatsOwned: {
    label: "Which formats do you own?",
    options: ["CD", "Digital", "Vinyl"],
  },
  rating: {
    label: "Rating?",
    options: ["#todo", "⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
  },
};

async function start(params, settings) {
  init(params, settings);

  const { albumTitle, artist } = await showInitialPrompts();

  const searchResults = await getMusicbrainzReleasesByQueryParams({
    release: albumTitle,
    artist,
  });

  QuickAdd.variables = buildQuickAddTemplateData(
    await promptUserForSelectingSuggestions(searchResults),
    await promptUserForCustomDataAttributes()
  );
}

function init(params, settings) {
  QuickAdd = params;
  Settings = settings;
}

/**
 *
 * @returns {Promise<String>} The album title, as entered by user
 */
function promptUserForAlbum() {
  return QuickAdd.quickAddApi.inputPrompt(prompts.albumTitle);
}

/**
 *
 * @returns {Promise<String>} The artist, as entered by user
 */
function promptUserForArtist() {
  return QuickAdd.quickAddApi.inputPrompt(prompts.artist);
}

/**
 *
 * @returns {Promise<Object>} The user-entered data for searching for a release
 */
function showInitialPrompts() {
  return Promise.all([promptUserForAlbum(), promptUserForArtist()]).then(
    ([albumTitle, artist]) =>
      new Promise((resolve, reject) => {
        if (!albumTitle && !artist) {
          notice("No query entered.");
          reject(new Error("No query entered."));
        }
        resolve({ albumTitle, artist });
      })
  );
}

/**
 *
 * @returns {Promise<object>}
 */
function promptUserForCustomDataAttributes() {
  return Promise.all([
    promptUserForRating(),
    promptUserForisOwnerOfRelease(),
  ]).then(
    ([rating, isOwnerOfRelease]) =>
      new Promise(async (resolve) =>
        resolve({
          rating,
          isOwnerOfRelease,
          ownedFormats: await promptUserForOwnedFormats(isOwnerOfRelease),
        })
      )
  );
}

/**
 *
 * @returns {Promise<boolean>} Whether the user owns the release or not, as entered by user
 */
function promptUserForisOwnerOfRelease() {
  return QuickAdd.quickAddApi.yesNoPrompt(prompts.ownership);
}

/**
 *
 * @param {boolean} isOwnerOfRelease Whether the user owns the release or not
 * @returns {Promise<Array>} The formats of the release that the user owns; returns empty if user does not own release
 */
function promptUserForOwnedFormats(isOwnerOfRelease) {
  return isOwnerOfRelease
    ? QuickAdd.quickAddApi.checkboxPrompt(prompts.formatsOwned.options)
    : new Promise((resolve) => resolve([]));
}

/**
 *
 * @returns {Promise<string>} The subjective rating of the release, as enterd by user
 */
function promptUserForRating() {
  return QuickAdd.quickAddApi.suggester(
    prompts.rating.options,
    prompts.rating.options
  );
}

/**
 *
 * @param {ReleaseData} releaseData The release data from musicbrainz
 * @param {UserInputData} userInputData The data from user input via prompts
 * @returns {QuickAddTemplateData}
 */
function buildQuickAddTemplateData(

  { title, date, artist, genres, id, cover },
  { rating, isOwnerOfRelease, ownedFormats }
) {
  const ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN = /[\\,#%&\{\}\/*<>?$\'\":@]*/g;

  return {
    title: title,
    date: date,
    artist: linkifyEmbedded(artist.name),
    genres: tagifyList(genres),
    formats: tagifyList(ownedFormats),
    isOwnerOfRelease,
    rating,
    fileName: title.replace(ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN, ""),
    cover: linkifyImage(cover),
    musicbrainzId: id,
  };
}

/**
 *
 * @param {ReleaseData[]} suggestions
 * @returns {Promise<ReleaseData} The chosen release with which to proceed adding via QuickAdd, as selected by user
 */
function promptUserForSelectingSuggestions(suggestions) {
  return new Promise((resolve, reject) => {
    QuickAdd.quickAddApi
      .suggester(suggestions.map(formatTitleForSuggestionPrompt), suggestions)
      .then(async (selectedRelease) => {
        if (!selectedRelease) {
          notice("No choice selected.");
          reject(new Error("No choice selected."));
        }

        resolve(selectedRelease);
      });
  });
}

/**
 *
 * @param {object} release The release data from searching Musicbrainz
 * @returns {ReleaseData}
 */
function buildReleaseData(release) {

  return {
    title: release.title,
    artist: release[ENTITY_ARTIST_CREDIT_KEY][0],
    genres: release.tags?.map((tag) => tag.name) ?? [],
    date: release['first-release-date'],
    id: release.id,
    cover: buildCoverArtArchiveFrontCoverPath(release.id)
  };
}

function formatTitleForSuggestionPrompt({ title, artist, date, tags = [] }) {
  return `${title} - ${artist.name} (${date}) - ${tagifyList(tags)}`;
}

/**
 *
 * @param {object} queryParams
 * @throws {Error} Will throw Error if no releases are found
 * @returns {ReleaseData[]} The release results from searching for a release
 */
async function getMusicbrainzReleasesByQueryParams(queryParams) {
  const MUSICBRAINZ_API_URL = `https://beta.musicbrainz.org/ws/2/${MUSICBRAINZ_ENTITY_TYPE}`;
  const searchResults = await fetchMusicbrainzReleases(
    buildRequestPath(
      MUSICBRAINZ_API_URL,
      queryParams
    ).href
  );

  const responseEntity = getMusicBrainzEntityQueryByEntityType(MUSICBRAINZ_ENTITY_TYPE);
  const responseEntities = searchResults[responseEntity].filter((searchResult) => searchResult['primary-type'] === 'Album');
  if (!responseEntities || !responseEntities.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }

  return responseEntities.map(buildReleaseData);
}

function linkifyEmbedded(textToLinkify) {
  return `[[${textToLinkify}]]`;
}

function linkifyImage(imagePath) {
  return `![img|200](${imagePath})`;
}

function tagify(textToTagify) {
  return `#${textToTagify.replace(/\s/, "-").toLowerCase()}`;
}

function tagifyList(list) {
  if (list.length === 0) return "";
  if (list.length === 1) return tagify(list[0]);

  return list.map((item) => tagify(item.trim())).join(", ");
}

/**
 *
 * @param {object} queryParams
 * @returns {string} The query string for requests to musicbrainz API.
 */
function buildQueryString(queryParams) {
  return Object.entries(queryParams).reduce(
    (previous, [queryParamKey, queryParamValue]) =>
      `${previous} AND ${queryParamKey}:${queryParamValue}`,
    ""
  );
}

/**
 *
 * @param {string} url
 * @returns {object[]}
 */
async function fetchMusicbrainzReleases(url) {

  return JSON.parse(
    await request({
      url,
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ObsidianQuickAddMacro ( joemoran231@gmail.com )",
      },
    })
  );
}

function buildRequestPath(url, queryParams) {
  let finalURL = new URL(url);
  if (queryParams) {
    finalURL.searchParams.append("query", buildQueryString(queryParams));
    finalURL.searchParams.append("fmt", "json");
  }
  return finalURL;
}

function buildCoverArtArchiveFrontCoverPath(entityId) {
  return `https://coverartarchive.org/${MUSICBRAINZ_ENTITY_TYPE}/${entityId}/front`;
}

/**
 * @typedef {Object} ReleaseData The formatted, and most important, data for a release from musicbrainz
 * @property {string} title The title of the release
 * @property {string} artist The artist who released...the release
 * @property {string[]} genres The genres rellated to the release
 * @property {string} date The data the release was...released
   @property {string} id The the musicbrainz release id
 */

/**
 * @typedef {object} UserInputData The additional input data, from QuickAdd prompts, to use for {@link QuickAddTemplateData}
 * @property {string} rating The rate of the release: 1-5, or #todo
 * @property {boolean} isOwnerOfRelease Whether the user owns the release
 * @property {string[]} ownedFormats The list of formats of the release that the user owns
 */

/**
 * @typedef {object} QuickAddTemplateData The data used in an Obsidian Markdown template via QuickAdd
 * @property {string} title The title of the release
 * @property {string} artist The artist who released...the release
 * @property {string} genres The list of genres related to the release; comma-separated
 * @property {string} date The data the release was...released
 * @property {string} musicbrainzId The the musicbrainz release id
 * @property {boolean} isOwnerOfRelease Whether the user owns this release
 * @property {string} formats The list of formats of the release that the user owns; comma-separated
 * @property {string} rating The rating of the release: 1-5 or #todo
 * @property {string} fileName The name of the markdown file to be generated via template
 * @property {string} cover The path of the release cover at {@link https://coverartarchive.org| cover art archive}
 * @property {string} musicbrainzId The id of the release at {@link https://musicbrainz.org| musicbrainz}
 */

const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

const ARTIST_CREDIT_KEY = "artist-credit";
const API_URL = "https://beta.musicbrainz.org/ws/2/release";

module.exports = {
  entry: start,
  settings: {
    name: "Music Script",
    author: "Joe Moran",
  },
};

let QuickAdd;
let Settings;

const prompts = {
  albumTitle: "Album: ",
  artist: "Artist: ",
  ownership: "Own?",
  formatsOwned: {
    label: "Which Formats?",
    options: ["CD", "Digital", "Vinyl"],
  },
  rating: {
    label: "Rating?",
    options: ["#todo", "⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
  },
};

function init(params, settings) {
  QuickAdd = params;
  Settings = settings;
}

async function start(params, settings) {
  init(params, settings);

  const { albumTitle, artist } = await showInitialPrompts();

  const searchResults = await fetchMusicBrainzReleasesByQueryParams({
    release: albumTitle,
    artist,
  });

  QuickAdd.variables = buildQuickAddVariables(
    await promptUserForSelectingSuggestions(searchResults),
    await promptUserForCustomDataAttributes()
  );
}

/**
 *
 * @returns {Promise<String>}
 */
function promptUserForAlbum() {
  return QuickAdd.quickAddApi.inputPrompt(prompts.albumTitle);
}

/**
 *
 * @returns {Promise<String>}
 */
function promptUserForArtist() {
  return QuickAdd.quickAddApi.inputPrompt(prompts.artist);
}

/**
 *
 * @returns {Promise<Object>}
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

function promptUserForCustomDataAttributes() {
  return Promise.all([
    promptUserForRating(),
    promptUserForOwnershipStatus(),
  ]).then(
    ([rating, ownershipStatus]) =>
      new Promise(async (resolve) =>
        resolve({
          rating,
          ownershipStatus,
          ownedFormats: await promptUserForOwnedFormats(ownershipStatus),
        })
      )
  );
}

function promptUserForOwnershipStatus() {
  return QuickAdd.quickAddApi.yesNoPrompt(prompts.ownership);
}

function promptUserForOwnedFormats(ownershipStatus) {
  return ownershipStatus
    ? QuickAdd.quickAddApi.checkboxPrompt(prompts.formatsOwned.options)
    : new Promise((resolve) => resolve([]));
}

function promptUserForRating() {
  return QuickAdd.quickAddApi.suggester(
    prompts.rating.options,
    prompts.rating.options
  );
}

function buildQuickAddVariables(
  { title, date, artist, genres },
  { rating, ownershipStatus, ownedFormats }
) {
  return {
    title: title,
    date: date,
    artist: linkify(artist.name),
    genres: tagifyList(genres),
    formats: tagifyList(ownedFormats),
    ownership: ownershipStatus,
    rating: rating,
    fileName: replaceIllegalFileNameCharactersInString(title),
  };
}

function promptUserForSelectingSuggestions(suggestions) {
  return new Promise((resolve, reject) => {
    QuickAdd.quickAddApi
      .suggester(suggestions.map(formatTitleForSuggestion), suggestions)
      .then((selectedRelease) => {
        if (!selectedRelease) {
          notice("No choice selected.");
          reject(new Error("No choice selected."));
        }

        resolve(selectedRelease);
      });
  });
}

function buildReleaseClientModel(release) {
  return {
    title: release.title,
    artist: release[ARTIST_CREDIT_KEY][0],
    genres: release.tags?.map((tag) => tag.name) ?? [],
    date: release.date,
  };
}

function formatTitleForSuggestion({ title, artist, date, tags = [] }) {
  return `${title} - ${artist.name} (${date}) - ${tags.toString()}`;
}

/**
 *
 * @param {object} queryParams
 * @returns
 */
async function fetchMusicBrainzReleasesByQueryParams(queryParams) {
  const searchResults = await apiGet(API_URL, queryParams);

  if (!searchResults.releases || !searchResults.releases.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }

  return searchResults.releases.map(buildReleaseClientModel);
}

function linkify(textToLinkify) {
  return `[[${textToLinkify}]]`;
}

function tagify(textToTagify) {
  return `#${textToTagify}`;
}

function tagifyList(list) {
  if (list.length === 0) return "";
  if (list.length === 1) return tagify(list[0]);

  return list.map((item) => tagify(item.trim())).join(", ");
}

function linkifyList(list) {
  if (list.length === 0) return "";
  if (list.length === 1) return linkify(list[0]);

  return list.map((item) => linkify(item.trim())).join(", ");
}

function replaceIllegalFileNameCharactersInString(string) {
  return string.replace(/[\\,#%&\{\}\/*<>?$\'\":@]*/g, "");
}

/**
 *
 * @param {object} queryParams
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
 * @param {object} queryParams
 * @param {}
 * @returns
 */
async function apiGet(url, queryParams) {
  let finalURL = new URL(url);
  if (queryParams) {
    finalURL.searchParams.append("query", buildQueryString(queryParams));
    finalURL.searchParams.append("fmt", "json");
  }

  return JSON.parse(
    await request({
      url: finalURL.href,
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ObsidianQuickAddMacro ( joemoran231@gmail.com )",
      },
    })
  );
}

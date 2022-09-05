import ReleaseGroupSearchResultsFactory from "./ReleaseGroupSearchResultsFactory";

it("Builds ReleaseGroupSearchResults as expected", () => {
  expect(
    ReleaseGroupSearchResultsFactory.buildAlbumResults({
      "release-groups": [
        {
          "primary-type": "Album",
          id: "2",
          title: "test title",
          "artist-credit": [{ name: "artist 1" }, { name: "artist 2" }],
          tags: [{ name: "tag1" }, { name: "tag2" }],
          "first-release-date": "10-23-2008",
        },
      ],
    })
  ).toEqual([{
    id: "2",
    title: "test title",
    artistName: "artist 1",
    genres: ["tag1", "tag2"],
    releaseDate: "10-23-2008",
    coverPath: "https://coverartarchive.org/release-group/2/front",
  }]);
});

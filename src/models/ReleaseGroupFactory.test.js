// eslint-disable-next-line import/namespace
import ReleaseGroupFactory from "./ReleaseGroupFactory";

it("Builds expected data from ReleaseGroupFactory.buildFromApi", () => {
  expect(
    ReleaseGroupFactory.buildFromApi({
      id: "1",
      title: "test",
      "artist-credit": [{ name: "test artist" }, { name: "test 2 artist" }],
      tags: [{ name: "tag1" }, { name: "tag2" }],
      "first-release-date": "10-10-2020",
    })
  ).toEqual({
    id: "1",
    title: "test",
    releaseDate: "10-10-2020",
    artistName: "test artist",
    genres: ["tag1", "tag2"],
    coverPath: "https://coverartarchive.org/release-group/1/front",
  });
});

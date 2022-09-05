import {
  formatAsEmbeddedImageLink,
  formatAsTag,
  formatAsWikiLink,
  formatSearchResultSuggestion,
} from "./markdownFormatter";

it('Formats an embedded image link from formatAsEmbeddedImageLink(param) as "![img|200](PARAM)"', () => {
  expect(formatAsEmbeddedImageLink("www.test.com/img")).toEqual(
    "![img|200](www.test.com/img)"
  );
});

it('Formats a wiki link from formatAsWikiLink(param) as "[[PARAM]]"', () => {
  expect(formatAsWikiLink("test time")).toEqual("[[test time]]");
});

it('Formats a string with a "#" (hash) in front when formatAsTag is called', () => {
  expect(formatAsTag("test tag or something")).toMatch(/^#.*/);
});

it("Formats a string with dashes replacing whitespace when formatAsTag is called", () => {
  expect(formatAsTag("test tag or something")).toEqual(
    "#test-tag-or-something"
  );
});

it("Formats search result suggestion as expected when calling formatSearchResultSuggestion", () => {
  expect(
    formatSearchResultSuggestion({
      title: "test",
      artistName: "Bucky",
      releaseDate: "10-10-1000",
      tags: ["hip hop", "soul"],
    })
  ).toEqual("test - Bucky (10-10-1000) - #hip-hop, #soul");
});

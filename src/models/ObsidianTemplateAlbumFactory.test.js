import ObsidianTemplateAlbumFactory from "./ObsidianTemplateAlbumFactory"

it('Builds expected data from ObsidanTemplateAlbumFactory.buildFromQuickAddUserInput', () => {
  expect(ObsidianTemplateAlbumFactory.buildFromQuickAddUserInput({
    id: '1',
    releaseDate: '10-10-1222',
    artistName: 'test artist',
    title: 'An Album!',
    genres: ['hip hop', 'soul'],
    ownedFormats: ['CD', 'vinyl'],
    rating: "⭐⭐⭐⭐⭐",
    coverPath: 'www.path.com'
  })).toEqual({
    id: '1',
    date: '10-10-1222',
    artist: 'test artist',
    title: 'An Album!',
    genres:  "[hip hop, soul]",
    formats: '[CD, vinyl]',
    fileName: 'An Album!',
    rating: "⭐⭐⭐⭐⭐",
    path: '![img|200](www.path.com)'
  })
})

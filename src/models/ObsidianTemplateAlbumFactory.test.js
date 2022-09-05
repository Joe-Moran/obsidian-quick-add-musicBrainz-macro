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
    musicbrainzId: '1',
    releaseDate: '10-10-1222',
    artist: '[[test artist]]',
    title: 'An Album!',
    genres:  "#hip-hop, #soul",
    ownedFormats: '#cd, #vinyl',
    rating: "⭐⭐⭐⭐⭐",
    coverPath: '![img|200](www.path.com)'
  })
})

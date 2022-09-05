import ReleaseGroupSearchInterface from "./src/api/ReleaseGroupSearchInterface";
export default async (params) => {
  await new ReleaseGroupSearchInterface(params).addAlbum();
};

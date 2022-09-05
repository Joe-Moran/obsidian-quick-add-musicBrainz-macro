import { writeFile } from "fs/promises"
import { mdxToMd } from "mdx-to-md"

export default async () => {
  const template = await mdxToMd("C:/Users/Joe/Documents/workspace/obsidian-quick-add-musicBrainz-macro/src/template.mdx");
  await writeFile("./dist/template.md", template);
}

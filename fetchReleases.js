// fetchReleases.js
import fs from 'fs';
import fetch from 'node-fetch';

const author = 'Jonius7';
const table = [
  { name: "MoreBackpacks", originalVersion: "2.2.2" },
  { name: "Brewcraft", originalVersion: "1.3.3" },
  { name: "MineChem", originalVersion: "5.0.5.406" },
  { name: "Electrodynamics", originalVersion: "0.3.5" },
  { name: "NoMoreRecipeConflict", repo: "YetAnotherRecipeConflictFixer" },
  { name: "Mystcraft NEI Plugin", repo: "mystcraft-nei-plugin" },
  { name: "Faithful32 [Texture Pack]", repo: "Faithful32-1.7.10" },
  { name: "NotEnoughItems (GTNH)", repo: "NotEnoughItems" },
];

async function main() {
  const data = await Promise.all(
    table.map(async (mod) => {
      const repoName = mod.repo || mod.name;

      try {
        const res = await fetch(`https://api.github.com/repos/${author}/${repoName}/releases`);
        if (!res.ok) return { ...mod, latestVersion: "No release", releaseDate: null, assets: [] };

        const releases = await res.json();
        const latest = releases.find(r => !r.prerelease) || null;

        let validAsset = null;
        if (latest && latest.assets && latest.assets.length > 0) {
          validAsset = latest.assets.find(a => !a.name.includes("-api")) || null;
        }

        return {
          ...mod,
          latestVersion: latest ? latest.tag_name : "No release",
          releaseDate: latest ? latest.published_at : null,
          assets: validAsset ? [validAsset] : [],
        };
      } catch {
        return { ...mod, latestVersion: "No release", releaseDate: null, assets: [] };
      }
    })
  );

  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  console.log('data.json updated!');
}

main();

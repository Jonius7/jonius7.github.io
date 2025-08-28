import fs from "fs";
import fetch from "node-fetch";

const author = "Jonius7";

const table = [
  { name: "MoreBackpacks", originalVersion: "2.2.2", changes: "Updated outdated Forestry API causing crashes", originalAuthor: "Enosphorous, LordBlackHole" },
  { name: "Brewcraft", originalVersion: "1.3.3", changes: "NEI support for Brewery<br />Return potion bottles on manually filling<br />Vanilla Potions NEI lookups and fixes", originalAuthor: "Enosphorous, LordBlackHole" },
  { name: "MineChem", originalVersion: "5.0.5.406", changes: "[did not make any changes, just rebuilt latest from Github]<br />Fix crash with BetterBuildersWands", originalAuthor: "jakimfett" },
  { name: "Electrodynamics", originalVersion: "0.3.5", changes: "Fix crash with IHL Tools & Machines (IC2 Addon)", originalAuthor: "Calclavia<br/>leytilera (bugfixes)" },
  { name: "NoMoreRecipeConflict", repo: "YetAnotherRecipeConflictFixer", provider: "CurseForge", link: "https://www.curseforge.com/minecraft/mc-mods/recipeconflict-fixer", originalVersion: "0.3", changes: "Fix to work on other mods' Crafting Tables (eg: Tinkers' Construct, Natura)", originalAuthor: "stimmedcow, GotoLink" },
  { name: "Mystcraft NEI Plugin", repo: "mystcraft-nei-plugin", originalVersion: "02.01.08", changes: 'Fix <a href="https://github.com/GTNewHorizons/NotEnoughItems/issues/596">java.lang.NoSuchFieldError: children</a>', originalAuthor: "heldplayer" },
  { name: "Faithful32 [Texture Pack]", repo: "Faithful32-1.7.10", noBadge: true, changes: "Update Rotarycraft images to v23", originalAuthor: "" },
  { name: "NotEnoughItems (GTNH)", repo: "NotEnoughItems", noBadge: true, changes: "Just <pre>handlers.csv</pre>, no mod work", originalAuthor: "" },
];

async function fetchData() {
  const data = await Promise.all(
    table.map(async (repo) => {
      const repoName = repo.repo || repo.name;

      try {
        const relRes = await fetch(`https://api.github.com/repos/${author}/${repoName}/releases`, {
          headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
        });
        const releases = await relRes.json();

        // Use first release with valid assets (skip "-api")
        const validRelease = releases.find(r => r.assets?.some(a => !a.name.includes("-api"))) || {};
        const assets = validRelease.assets?.filter(a => !a.name.includes("-api")) || [];

        return {
          ...repo,
          latestVersion: validRelease.tag_name || "No release",
          releaseDate: validRelease.published_at || null,
          assets
        };
      } catch (err) {
        return { ...repo, latestVersion: "No release", releaseDate: null, assets: [] };
      }
    })
  );

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  console.log("data.json created!");
}

fetchData();

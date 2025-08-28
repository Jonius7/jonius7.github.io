import Link from "next/link";

// static repo list
const author = "Jonius7";
const table = [
  { name: "MoreBackpacks", originalVersion: "2.2.2", changes: "Updated outdated Forestry API causing crashes", originalAuthor: "Enosphorous, LordBlackHole" },
  {
    name: "Brewcraft",
    originalVersion: "1.3.3",
    changes: `NEI support for Brewery<br />
      Return potion bottles on manually filling<br />
      Vanilla Potions NEI lookups and fixes`,
    originalAuthor: "Enosphorous, LordBlackHole",
  },
  {
    name: "MineChem",
    originalVersion: "5.0.5.406",
    changes: `[did not make any changes, just rebuilt latest from Github]<br />
      Fix crash with BetterBuildersWands`,
    originalAuthor: "jakimfett",
  },
  {
    name: "Electrodynamics",
    originalVersion: "0.3.5",
    changes: "Fix crash with IHL Tools & Machines (IC2 Addon)",
    originalAuthor: `Calclavia<br/>leytilera (bugfixes)`,
  },
  {
    name: "NoMoreRecipeConflict",
    repo: "YetAnotherRecipeConflictFixer",
    provider: "CurseForge",
    link: "https://www.curseforge.com/minecraft/mc-mods/recipeconflict-fixer",
    originalVersion: "0.3",
    changes: "Fix to work on other mods' Crafting Tables (eg: Tinkers' Construct, Natura)",
    originalAuthor: "stimmedcow, GotoLink",
  },
  {
    name: "Mystcraft NEI Plugin",
    repo: "mystcraft-nei-plugin",
    originalVersion: "02.01.08",
    changes: `Fix <a href="https://github.com/GTNewHorizons/NotEnoughItems/issues/596">java.lang.NoSuchFieldError: children</a>`,
    originalAuthor: "heldplayer",
  },
  {
    name: "Faithful32 [Texture Pack]",
    repo: "Faithful32-1.7.10",
    noBadge: true,
    changes: "Update Rotarycraft images to v23",
    originalAuthor: "",
  },
  {
    name: "NotEnoughItems (GTNH)",
    repo: "NotEnoughItems",
    noBadge: true,
    changes: "Just <pre>handlers.csv</pre>, no mod work",
    originalAuthor: "",
  },
];

export default async function Home() {
  // fetch data for all repos
  const data = await Promise.all(
    table.map(async (repo) => {
      const repoName = repo.repo || repo.name;

      // Fetch repo info
      const repoRes = await fetch(`https://api.github.com/repos/${author}/${repoName}`, {
        headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
        next: { revalidate: 3600 },
      });
      const repoJson = await repoRes.json();

      // Fetch latest release
      let relJson = {};
      try {
        const relRes = await fetch(`https://api.github.com/repos/${author}/${repoName}/releases/latest`, {
          headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
          next: { revalidate: 3600 },
        });
        if (relRes.ok) {
          relJson = await relRes.json();
        } else {
          relJson = { assets: [], tag_name: null, published_at: null };
        }
      } catch (err) {
        relJson = { assets: [], tag_name: null, published_at: null };
      }
      
      return {
        ...repo,
        description: repoJson.description || "",
        latestVersion: relJson.tag_name || "No release",
        releaseDate: relJson.published_at || null,
        assets: relJson.assets || [],
      };
    })
  );

  return (
    <>
      <div className="base">
        <div className="content pure-u-1">
          <h1 id="main-title">Welcome to the Jonius7 Website!</h1>

          <p>
            <a href="https://github.com/Jonius7/SteamUI-OldGlory" target="_blank" rel="noopener noreferrer">
              SteamUI-OldGlory
            </a>{" "}
            - A set of tweaks to the Steam Library UI
          </p>

          <p className="centered-p">
            &emsp;Latest Version:&nbsp;
            <img
              alt="GitHub release (latest by date including pre-releases)"
              src="https://img.shields.io/github/v/release/Jonius7/SteamUI-OldGlory?display_name=release&include_prereleases&label=%20%20&style=flat-square"
              height="27"
            />
          </p>

          <p>
            <a href="https://www.youtube.com/channel/UCUwcJ5V5F7eGZUbEq3vV-WA" target="_blank" rel="noopener noreferrer">
              Youtube
            </a>{" "}
            - Jonius7
          </p>

          <p>
            <a href="https://www.youtube.com/watch?v=q16iqgbWRUE" target="_blank" rel="noopener noreferrer">
              Minecraft
            </a>{" "}
            - I have bugfixes and updates for Minecraft mods
          </p>

          <p>
            <Link href="/minecraft">Keeping Minecraft Mods Updated</Link>{" "}
            - Building a modpack, can use a table format to check when mods are updating
          </p>

          <table className="tg">
            <thead>
              <tr>
                <th>Mod</th>
                <th>Version</th>
                <th>Original<br />Version</th>
                <th>Changes</th>
                <th>Original<br />Author</th>
                <th>Direct<br />Download</th>
              </tr>
            </thead>
            <tbody>
              {data.map((mod, index) => (
                <tr key={index}>
                  <td>
                    <a
                      href={
                        mod.provider === "CurseForge"
                          ? mod.link
                          : mod.repo
                          ? `https://github.com/${author}/${mod.repo}`
                          : `https://github.com/${author}/${mod.name}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mod.name}
                    </a>
                  </td>
                  <td>
                    {!mod.noBadge && (
                      <img
                        src={`https://img.shields.io/github/v/release/${author}/${mod.repo || mod.name}?display_name=release&include_prereleases&label=%20&style=flat-square`}
                        height="27"
                      />
                    )}
                  </td>
                  <td>{mod.originalVersion}</td>
                  <td dangerouslySetInnerHTML={{ __html: mod.changes }} />
                  <td dangerouslySetInnerHTML={{ __html: mod.originalAuthor }} />
                  <td>
                    {mod.assets && mod.assets.length > 0 ? (
                      (() => {
                        const validAsset = mod.assets.find(asset => !asset.name.includes("-api"));
                        return validAsset ? (
                          <a href={validAsset.browser_download_url} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        ) : (
                          "No release"
                        );
                      })()
                    ) : (
                      "No release"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <footer>
        <div className="content">
          <a href="https://github.com/Jonius7/jonius7.github.io" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </div>
      </footer>
    </>
  );
}

import Link from "next/link"

// static repo list
const repos = [
  { name: "Applied-Energistics-2-Unofficial", author: "GTNewHorizons" },
  { name: "NotEnoughItems", author: "GTNewHorizons" },
  { name: "Botania", author: "GTNewHorizons" },
  { name: "ProjectRed", author: "GTNewHorizons" },
  { name: "TCNEIAdditions", author: "GTNewHorizons" },
  { name: "BloodMagic", author: "GTNewHorizons" },
  { name: "BloodArsenal", author: "GTNewHorizons" },
  { name: "Natura", author: "GTNewHorizons" },
  { name: "Mantle", author: "GTNewHorizons" },
  { name: "EnderCore", author: "GTNewHorizons" },
  { name: "Hodgepodge", author: "GTNewHorizons" },
  { name: "CoreTweaks", author: "GTNewHorizons" },
  { name: "ForestryMC", author: "GTNewHorizons" },
  { name: "NotEnoughEnergistics", author: "GTNewHorizons" },
  { name: "TinkersConstruct", author: "GTNewHorizons" },
  { name: "Avaritia", author: "GTNewHorizons" },
  { name: "Avaritiaddons", author: "GTNewHorizons" },
  { name: "BetterQuesting", author: "GTNewHorizons" }
];

function formatRelativeDate(dateString) {
  if (!dateString) return "No release";
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffWeeks > 6) return rtf.format(-diffWeeks, "week");
  if (diffDays > 0) return rtf.format(-diffDays, "day");
  if (diffHours > 0) return rtf.format(-diffHours, "hour");
  if (diffMin > 0) return rtf.format(-diffMin, "minute");
  return "just now";
}

export default async function Home() {
  const data = await Promise.all(
    repos.map(async (repo) => {
      // Fetch repo info (for description)
      const repoRes = await fetch(
        `https://api.github.com/repos/${repo.author}/${repo.name}`,
        { next: { revalidate: 3600 } }
      );
      const repoJson = await repoRes.json();

      // Fetch latest release
      const relRes = await fetch(
        `https://api.github.com/repos/${repo.author}/${repo.name}/releases/latest`,
        { next: { revalidate: 3600 } }
      );
      const relJson = await relRes.json();

      return {
        ...repo,
        description: repoJson.description,
        latestVersion: relJson.tag_name,
        releaseDate: relJson.published_at,
      };
    })
  );

  // --- Fetch CurseForge mods ---
  /*let curseData = [];
  try {
    const cfRes = await fetch(
      "https://api.curseforge.com/v1/mods/search?gameId=432&index=0&pageSize=20",
      {
        headers: {
          Accept: "application/json",
          "x-api-key": "process.env.CURSEFORGE_API_KEY || """,
        },
        next: { revalidate: 3600 },
      }
    );

    if (cfRes.ok) {
      curseData = await cfRes.json();
      console.log(curseData);
    } else {
      const text = await cfRes.text();
      console.error("CurseForge API error:", cfRes.status, text);
    }
  } catch (err) {
    console.error("CurseForge fetch error:", err);
  }*/


  return (
    <div className="base">
      <div className="content pure-u-1">
        <h1 id="main-title">Keeping Minecraft Mods Updated</h1>
        <table className="tg">
          <thead>
            <tr>
              <th>Mod</th>
              <th>Version</th>
              <th>Description</th>
              <th>Author</th>
              <th>
                Release
                <br />
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((mod, index) => (
              <tr key={index}>
                <td>
                  <a
                    href={`https://github.com/${mod.author}/${mod.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mod.name}
                  </a>
                </td>
                <td>
                  <img
                    alt="GitHub release"
                    src={`https://img.shields.io/github/v/release/${mod.author}/${mod.name}?display_name=release&include_prereleases&label=%20&style=flat-square`}
                    height="27"
                  />
                </td>
                <td>{mod.description}</td>
                <td>{mod.author}</td>
                <td>
                  {formatRelativeDate(mod.releaseDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer>
        <div className="content">
          <Link href="../" rel="noopener noreferrer">Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}

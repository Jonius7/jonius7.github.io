"use client";

import releasesData from './data.json';

export default function Home() {
  const data = releasesData;

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
              alt="GitHub release (latest by date)"
              src="https://img.shields.io/github/v/release/Jonius7/SteamUI-OldGlory?display_name=release&label=%20%20&style=flat-square"
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
            <a href="/minecraft">Keeping Minecraft Mods Updated</a>{" "}
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
                      href={mod.provider === "CurseForge"
                        ? mod.link
                        : mod.repo
                        ? `https://github.com/${author}/${mod.repo}`
                        : `https://github.com/${author}/${mod.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mod.name}
                    </a>
                  </td>
                  <td>
                    {!mod.noBadge && (
                      <img
                        src={`https://img.shields.io/github/v/release/${author}/${mod.repo || mod.name}?display_name=release&label=%20&style=flat-square`}
                        height="27"
                      />
                    )}
                  </td>
                  <td>{mod.originalVersion}</td>
                  <td dangerouslySetInnerHTML={{ __html: mod.changes || "" }} />
                  <td dangerouslySetInnerHTML={{ __html: mod.originalAuthor || "" }} />
                  <td>
                    {mod.assets && mod.assets.length > 0 ? (
                      <a href={mod.assets[0].browser_download_url} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
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

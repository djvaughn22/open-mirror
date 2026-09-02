// ─────────────────────────────────────────────────────────────────────────────
// Issue, list and revoke school reporting links.
//
//   npm run credential -- issue --school sluh --label "SLUH athletics office"
//   npm run credential -- list
//   npm run credential -- revoke --id <credential-id>
//
// The token is printed ONCE, here, and never stored — only its SHA-256 hash
// goes to the database. If the school loses the link, issue a new one and
// revoke the old; there is deliberately no way to recover the original.
//
// Where it writes depends on the environment: with DATABASE_URL set it goes to
// Postgres, which is what production reads. Without one it writes local files,
// which is fine for development and useless for a real school.
// ─────────────────────────────────────────────────────────────────────────────

import { databaseUrl, sportsRepository } from "../src/lib/sports/repo/index.ts";
import { issueCredential, reportingLink } from "../src/lib/sports/submit/credentials.ts";
import { ST_LOUIS } from "../src/lib/sports/metros/stLouis.ts";
import { STUDIO } from "../src/lib/products.ts";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main() {
  const command = process.argv[2];
  const repo = sportsRepository();

  if (!databaseUrl()) {
    console.warn(
      "! No DATABASE_URL is set, so this writes to local files.\n" +
        "  A link issued here will NOT work on the deployed site.\n",
    );
  }

  if (command === "issue") {
    const schoolId = arg("school");
    const label = arg("label") ?? "";
    if (!schoolId || !label) {
      console.error('Usage: npm run credential -- issue --school <schoolId> --label "Who holds it"');
      process.exit(2);
    }
    const school = ST_LOUIS.schools.find((s) => s.id === schoolId);
    if (!school) {
      console.error(`Unknown school "${schoolId}". Ids live in src/lib/sports/metros/stLouisSchools.ts.`);
      process.exit(2);
    }

    const { credential, token } = await issueCredential(repo, { schoolId: school.id, label });
    console.log(`\nIssued a reporting link for ${school.name}.`);
    console.log(`  credential id : ${credential.id}`);
    console.log(`  scoped to     : ${school.id} (this link cannot report any other school)`);
    console.log(`\n  SEND THIS LINK, THEN DELETE IT FROM WHEREVER YOU PASTED IT:\n`);
    console.log(`  ${reportingLink(STUDIO.url, token)}\n`);
    console.log("  It is shown once. Only its hash is stored, so it cannot be recovered.\n");
    return;
  }

  if (command === "list") {
    const all = await repo.listCredentials();
    if (all.length === 0) {
      console.log("No reporting links have been issued.");
      return;
    }
    console.log(`${all.length} reporting link(s) — tokens are not stored and cannot be shown:\n`);
    for (const c of all) {
      const state = c.revokedAt ? `REVOKED ${c.revokedAt.slice(0, 10)}` : "active";
      console.log(
        `  ${c.id}  ${c.schoolId.padEnd(24)} ${state.padEnd(20)} used ${c.useCount}x` +
          (c.lastUsedAt ? ` (last ${c.lastUsedAt.slice(0, 10)})` : "") +
          `\n      ${c.label}`,
      );
    }
    return;
  }

  if (command === "revoke") {
    const id = arg("id");
    if (!id) {
      console.error("Usage: npm run credential -- revoke --id <credential-id>");
      process.exit(2);
    }
    const done = await repo.revokeCredential(id, new Date().toISOString());
    console.log(done ? `Revoked ${id}. It stops working on the next request.` : `No active credential with id ${id}.`);
    return;
  }

  console.error("Commands: issue | list | revoke");
  process.exit(2);
}

main().then(
  () => process.exit(0),
  (error) => {
    // Never print the error object raw: it can contain the connection string.
    console.error(`Failed: ${error instanceof Error ? error.message : "unknown error"}`);
    process.exit(1);
  },
);

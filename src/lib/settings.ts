import { prisma } from "./prisma";

const SETTINGS_ID = "default";

const DEFAULT_PROVIDERS = [
  { name: "claude", command: "claude", enabled: true },
  { name: "gemini", command: "gemini", enabled: false },
  { name: "codex", command: "codex", enabled: false },
];

export async function getGlobalSettings() {
  let settings = await prisma.globalSettings.findUnique({
    where: { id: SETTINGS_ID },
  });
  if (!settings) {
    settings = await prisma.globalSettings.create({
      data: { id: SETTINGS_ID, cliProviders: DEFAULT_PROVIDERS },
    });
  }
  return settings;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateGlobalSettings(data: any) {
  return prisma.globalSettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });
}

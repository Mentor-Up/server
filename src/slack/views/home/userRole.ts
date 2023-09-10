import { Blocks } from 'slack-block-builder';

export const buildUserRoleSection = (role: string) => {
  return [Blocks.Section().text(`*Your Role:* ${role}`), Blocks.Divider()];
};

import { getPlatformStore } from "../../../db/store";

export function exportsRepository() {
  const store = getPlatformStore();

  return {
    listExports(workspaceId: string) {
      return store.exports.records.filter(
        (record) => record.workspaceId === workspaceId,
      );
    },
  };
}

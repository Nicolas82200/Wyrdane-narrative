export interface Chapter {
  id: string;
  title: string;
  description?: string;

  startingSceneId: string;

  sceneIds: string[];
}
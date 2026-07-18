export type VaultItemType = "file" | "folder";

export type VaultItem = {
  id: string;
  name: string;
  type: VaultItemType;
  mime?: string;
  size: number;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
  starred: boolean;
  deletedAt?: string | null;
  /** Public share token for staging links */
  shareToken?: string | null;
  /** data URL for staging persistence */
  dataUrl?: string;
};

export type VaultInvite = {
  id: string;
  email: string;
  createdAt: string;
};

export type VaultState = {
  items: VaultItem[];
  invites?: VaultInvite[];
};

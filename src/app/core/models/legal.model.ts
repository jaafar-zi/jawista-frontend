// legal.model.ts
export interface LegalSection {
  id: string;
  titleKey: string;
  contentKey: string;
}

export interface LegalPageConfig {
  pageTitleKey: string;
  lastUpdatedKey: string;
  sections: LegalSection[];
}
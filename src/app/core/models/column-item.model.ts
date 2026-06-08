export type ColumnSize = 'large' | 'small' | 'medium';

export interface ColumnItem {
  labelKey:       string;
  ctaTextKey:     string;
  ctaSubLabelKey: string;
  image:          string;
  link:           string;
  isExternal:     boolean;
  size:           ColumnSize;
}
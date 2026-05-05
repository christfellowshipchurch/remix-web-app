export interface ChurchRole {
  id: string;
  title: string;
  description: string;
  /** Optional longer description shown when "Read more" is expanded. */
  expandedDescription?: string;
}

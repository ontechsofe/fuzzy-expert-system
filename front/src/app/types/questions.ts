export interface Questions {
  label: string;
  fields: field[]
}

interface field {
  type: string;
  label: string;
  options: string[];
}

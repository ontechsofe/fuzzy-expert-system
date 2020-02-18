export interface Questions {
  label: string;
  formGroup: string;
  fields: field[]
}

interface field {
  type: string;
  label: string;
  placeholder: string;
  options: string[];
}

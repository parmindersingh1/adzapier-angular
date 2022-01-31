import { FormControl, ValidatorFn } from "@angular/forms";

export const trimValidator: ValidatorFn = (control: FormControl) => {
    if(control.value == null){
        return null;
    }
    if (control.value.startsWith(' ')) {
      return {
        'trimError': { value: 'Control has leading whitespace' }
      };
    }
    if (control.value.endsWith(' ')) {
      return {
        'trimError': { value: 'Control has trailing whitespace' }
      };
    }
    return null;
  };
  
// Single source of truth for all form control styling.
// No imports — plain string constants only.

// Control surface (text / select / textarea / date)
export const formControlBaseStyles: string =
  'h-[46px] box-border rounded-[10px] px-4 py-2.5 w-full bg-gray border border-dark-navy/10 focus:outline-none focus:ring-0';

export const formControlFocusStyles: string =
  'focus:h-[48px] focus:bg-white focus:border-2 focus:border-ocean focus:shadow-[0_0_0_3px_rgba(0,146,188,0.15)]';

export const formControlErrorStyles: string =
  'h-[48px] border-2 border-alert bg-white';

export const formControlDisabledStyles: string =
  'opacity-50 cursor-not-allowed bg-gray';

export const formControlLeadingIconStyles: string = 'pl-10';

export const formControlTrailingIconStyles: string = 'pr-10';

// Typography
export const formLabelStyles: string =
  'text-[20px] leading-5 text-dark-navy font-bold';

export const formHelperTextStyles: string = 'text-base leading-4 text-navy';

export const formErrorMessageStyles: string =
  'text-[20px] leading-5 text-alert flex items-center gap-1.5';

// For Radix modal forms that use native inputs inside Form.Control
export const nativeCheckboxStyles: string =
  'size-5 rounded-[4px] border-2 border-[#d1d5db] bg-white checked:bg-ocean checked:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20 accent-ocean';

export const nativeRadioStyles: string =
  'size-5 rounded-full border-2 border-[#d1d5db] bg-white checked:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20 accent-ocean';

// Group containers
export const formCheckboxGroupStyles: string = 'flex flex-col gap-2';

export const formRadioGroupStyles: string = 'flex flex-col gap-2.5';

// Back-compat re-exports (primitives currently export these from their own files).
// These are ready-to-use single className strings with base + focus styles combined.
export const defaultTextInputStyles: string =
  'box-border h-[46px] rounded-[10px] px-4 py-2.5 w-full bg-gray border border-dark-navy/10 focus:outline-none focus:ring-0 focus:h-[48px] focus:bg-white focus:border-2 focus:border-ocean focus:shadow-[0_0_0_3px_rgba(0,146,188,0.15)]';

export const defaultSelectInputStyles: string = defaultTextInputStyles;

export const defaultDateInputStyles: string = defaultTextInputStyles;

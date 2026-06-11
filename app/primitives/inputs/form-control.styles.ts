import { cn } from '~/lib/utils';

/** Placeholder / empty select prompt (navy @ 60%, 16px / 400 / 24px) */
export const formControlPlaceholderStyles = cn(
  'placeholder:text-base placeholder:font-normal placeholder:leading-6',
  'placeholder:text-[rgba(0,79,113,0.6)] placeholder:tracking-[-0.312px]',
  'invalid:text-[rgba(0,79,113,0.6)] [&>option]:text-text-primary',
);

/** Default text/select/date control surface (Figma Form UX) */
export const formControlBaseStyles = cn(
  'box-border w-full overflow-x-hidden rounded-[10px]',
  'border border-dark-navy/10 bg-gray px-4 py-2.5',
  'h-[46px] text-text-primary',
  'outline-none ring-0',
  'transition-[height,border-color,background-color,box-shadow]',
  'focus:h-[48px] focus:border-2 focus:border-ocean focus:bg-white',
  'focus:shadow-[0_0_0_3px_rgba(0,146,188,0.2)]',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'data-[invalid=true]:border-2 data-[invalid=true]:border-alert',
  formControlPlaceholderStyles,
);

export const formControlFocusStyles =
  'focus:h-[48px] focus:border-2 focus:border-ocean focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,146,188,0.2)]';

export const formControlErrorStyles = cn(
  'box-border w-full rounded-[10px]',
  'border-2 border-alert bg-white px-4 py-2.5',
  'h-[48px] text-text-primary outline-none ring-0',
);

export const formControlDisabledStyles = 'cursor-not-allowed opacity-60';

export const formControlLeadingIconStyles = 'pl-10';

export const formControlTrailingIconStyles = 'pr-10';

/** Textarea — same chrome as inputs, fluid height */
export const formTextareaBaseStyles = cn(
  'box-border w-full overflow-x-hidden rounded-[10px]',
  'border border-dark-navy/10 bg-gray px-4 py-2.5',
  'min-h-[120px] text-text-primary',
  'outline-none ring-0',
  'transition-[border-color,background-color,box-shadow]',
  'focus:border-2 focus:border-ocean focus:bg-white',
  'focus:shadow-[0_0_0_3px_rgba(0,146,188,0.2)]',
  'disabled:cursor-not-allowed disabled:opacity-60',
);

export const formTextareaErrorStyles = cn(
  'box-border w-full rounded-[10px]',
  'border-2 border-alert bg-white px-4 py-2.5',
  'min-h-[120px] text-text-primary outline-none ring-0',
  'focus:border-2 focus:border-alert',
  'focus:shadow-[0_0_0_3px_rgba(180,35,24,0.2)]',
);

/** Field / option labels (#00354D, 14px / 500 / 20px line-height) */
export const formLabelStyles = cn(
  'text-sm font-medium leading-5 text-dark-navy tracking-[-0.15px]',
  'transition-colors duration-150',
);

/** Label turns ocean when a text/select/textarea control in the field wrapper is focused */
export const formFieldFocusLabelStyles =
  'focus-within:[&:has(input:not([type=checkbox]):not([type=radio]):focus,select:focus,textarea:focus)_label]:text-ocean';

/** Radix modal field labels (typography only; use formFieldStackStyles for 12px gaps) */
export const formCompactFieldLabelStyles = cn(formLabelStyles, 'block');

/** 12px vertical gap between label, control, and error message */
export const formFieldStackStyles = cn(
  'flex flex-col gap-3',
  formFieldFocusLabelStyles,
);

/** Radix Form.Field invalid — shown after submit, not via native :invalid on load */
export const formFieldInvalidControlStyles = cn(
  formFieldFocusLabelStyles,
  'data-[invalid]:[&_textarea]:border-2 data-[invalid]:[&_textarea]:border-alert',
  'data-[invalid]:[&_textarea]:focus:border-2 data-[invalid]:[&_textarea]:focus:border-alert',
  'data-[invalid]:[&_textarea]:focus:shadow-[0_0_0_3px_rgba(180,35,24,0.2)]',
  'data-[invalid]:[&_select]:border-2 data-[invalid]:[&_select]:border-alert',
  'data-[invalid]:[&_select]:focus:border-2 data-[invalid]:[&_select]:focus:border-alert',
  'data-[invalid]:[&_select]:focus:shadow-[0_0_0_3px_rgba(180,35,24,0.2)]',
  'data-[invalid]:[&_input:not([type=checkbox]):not([type=radio])]:border-2',
  'data-[invalid]:[&_input:not([type=checkbox]):not([type=radio])]:border-alert',
  'data-[invalid]:[&_input:not([type=checkbox]):not([type=radio])]:focus:border-2',
  'data-[invalid]:[&_input:not([type=checkbox]):not([type=radio])]:focus:border-alert',
  'data-[invalid]:[&_input:not([type=checkbox]):not([type=radio])]:focus:shadow-[0_0_0_3px_rgba(180,35,24,0.2)]',
  'data-[invalid]:[&_input[type=checkbox]]:border-2',
  'data-[invalid]:[&_input[type=checkbox]]:border-alert',
  'data-[invalid]:[&_input[type=checkbox]]:bg-white',
  'data-[invalid]:[&_input[type=checkbox]:checked]:border-alert',
  'data-[invalid]:[&_input[type=checkbox]:checked]:bg-alert',
  'data-[invalid]:[&_input[type=radio]]:border-2',
  'data-[invalid]:[&_input[type=radio]]:border-alert',
);

/** Checkbox / radio option labels beside controls */
export const formCheckboxOptionLabelStyles = cn(
  formLabelStyles,
  'cursor-pointer select-none',
);

export const formHelperTextStyles = 'text-base leading-4 text-navy';

/** Inline / Radix validation error row (#B42318, 14px / 400 / 20px) */
export const formErrorMessageStyles = cn(
  'flex items-center gap-1.5 text-sm font-normal leading-5 text-alert tracking-[-0.15px]',
);

export const formRequiredMarkerStyles = 'text-ocean mr-1';

export const formRequiredHintStyles =
  'ml-1 font-normal italic text-text-secondary';

/** Native checkbox for Radix Form.Control */
export const nativeCheckboxStyles = cn(
  'size-5 shrink-0 cursor-pointer appearance-none rounded-[6px]',
  'border-2 border-form-stroke-muted bg-white bg-center bg-no-repeat',
  'checked:border-ocean checked:bg-ocean checked:bg-[image:var(--cf-checkbox-tick)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/30',
  'disabled:cursor-not-allowed disabled:opacity-60',
);

/** Native radio for Radix Form.Control */
export const nativeRadioStyles = cn(
  'size-5 shrink-0 cursor-pointer appearance-none rounded-full',
  'border-2 border-form-stroke-muted bg-white',
  'checked:border-ocean checked:bg-[radial-gradient(circle,var(--color-ocean)_45%,var(--color-white)_36%)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/30',
  'disabled:cursor-not-allowed disabled:opacity-60',
);

export const formCheckboxGroupStyles = 'flex flex-col gap-2';

export const formRadioGroupVerticalStyles = 'flex flex-col gap-2.5';

export const formRadioGroupHorizontalStyles = 'flex flex-row flex-wrap gap-2.5';

/** Custom checkbox control (peer pattern) */
export const formCheckboxControlStyles = cn(
  'peer size-5 shrink-0 appearance-none rounded-[6px]',
  'border-2 border-form-stroke-muted bg-white transition-colors duration-150',
  'checked:border-ocean checked:bg-ocean',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/30',
  'disabled:cursor-not-allowed disabled:border-ocean/40 disabled:bg-ocean-subdued',
  'aria-invalid:border-alert',
);

export const formCheckboxControlCheckedStyles =
  'checked:border-ocean checked:bg-ocean';

export const formCheckboxControlErrorStyles = cn(
  '!border-2 !border-alert bg-white',
  'checked:!border-alert checked:!bg-alert',
);

export const formCheckboxLabelStyles = 'text-text-primary font-normal';

export const formCheckboxLabelDisabledStyles =
  'text-neutral-default font-normal';

/** Custom radio faux control */
export const formRadioControlOuterStyles = cn(
  'flex size-5 shrink-0 items-center justify-center rounded-full',
  'border-2 bg-white transition duration-200',
);

export const formRadioControlOuterSelectedStyles = 'border-ocean';

export const formRadioControlOuterUnselectedStyles = 'border-form-stroke-muted';

export const formRadioControlOuterDisabledStyles =
  'border-ocean/40 bg-ocean-subdued';

export const formRadioControlOuterErrorStyles = 'border-alert';

export const formRadioControlInnerStyles =
  'rounded-full bg-ocean transition-opacity duration-200';

export const formRadioControlInnerSelectedStyles = 'opacity-100';

export const formRadioControlInnerUnselectedStyles = 'opacity-0';

export const formRadioLabelStyles = 'text-text-primary select-none';

/** Back-compat aliases */
export const defaultTextInputStyles = formControlBaseStyles;

export const defaultSelectInputStyles = cn(
  formControlBaseStyles,
  'appearance-none pr-10',
);

export const defaultDateInputStyles = formControlBaseStyles;

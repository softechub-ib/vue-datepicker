/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CalendarStylesProp,
  DateValue,
  DayjsLocale,
  InputStylesProp,
  Size,
} from './types';
import VueDatePicker from './components/VueDatePicker.vue';

type VueDatePickerProps = {
  modelValue: DateValue | DateValue[];
  range?: boolean;
  monthPicker?: boolean;
  yearPicker?: boolean;
  size?: Size;
  name?: string;
  placeholder?: string;
  locale?: DayjsLocale;
  startWeekOnMonday?: boolean;
  hideTodayMark?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  error?: boolean;
  dark?: boolean;
  min?: DateValue;
  max?: DateValue;
  inputStyles?: InputStylesProp;
  calendarStyles?: CalendarStylesProp;
};

declare function __VLS_template(): {
  attrs: Partial<{}>;
  slots: {
    calendarIcon?(_: {}): any;
    clearIcon?(_: {}): any;
    leftHeaderButtonIcon?(_: {}): any;
    rightHeaderButtonIcon?(_: {}): any;
  };
  refs: {
    container: HTMLButtonElement;
    calendar: HTMLDivElement;
  };
  rootEl: HTMLButtonElement;
};

type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;

declare const __VLS_component: import('vue').DefineComponent<
  VueDatePickerProps,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {} & {
    'update:modelValue': (value: string | string[]) => any;
  },
  string,
  import('vue').PublicProps,
  Readonly<VueDatePickerProps> &
    Readonly<{
      'onUpdate:modelValue'?: ((value: string | string[]) => any) | undefined;
    }>,
  {
    size: Size;
    range: boolean;
    monthPicker: boolean;
    yearPicker: boolean;
    startWeekOnMonday: boolean;
    hideTodayMark: boolean;
    min: string | number | Date | null;
    max: string | number | Date | null;
    disabled: boolean;
    error: boolean;
    name: string;
    placeholder: string;
    locale: DayjsLocale;
    clearable: boolean;
    dark: boolean;
    inputStyles: InputStylesProp;
    calendarStyles: CalendarStylesProp;
  },
  {},
  {},
  {},
  string,
  import('vue').ComponentProvideOptions,
  false,
  {},
  HTMLButtonElement
>;

declare const _default: __VLS_WithTemplateSlots<
  typeof __VLS_component,
  __VLS_TemplateResult['slots']
>;

type __VLS_WithTemplateSlots<T, S> = T & {
  new (): {
    $slots: S;
  };
};

export default VueDatePicker as typeof _default;
export type {
  CalendarStylesProp,
  DateValue,
  DayjsLocale,
  InputStylesProp,
  Size,
};

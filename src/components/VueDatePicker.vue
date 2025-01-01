<script setup lang="ts">
import {
  CalendarStylesProp,
  CalendarValue,
  DateString,
  DateValue,
  DayjsLocale,
  InputStylesProp,
  Size,
  Year,
} from '@/types';
import { computed, nextTick, ref, watch } from 'vue';
import {
  defaultCalendarStyles,
  defaultInputStyles,
  formatDate,
} from '@/helpers';
import { flip, useFloating } from '@floating-ui/vue';
import VueCalendar from './VueCalendar.vue';
import dayjs from '@/dayjs-with-locales';
import deepMerge from 'lodash.merge';
import { useClickOutside } from '@/composables/clickOutside';

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
  clearable?: boolean;
  disabled?: boolean;
  error?: boolean;
  dark?: boolean;
  min?: DateValue;
  max?: DateValue;
  inputStyles?: InputStylesProp;
  calendarStyles?: CalendarStylesProp;
};

const props = withDefaults(defineProps<VueDatePickerProps>(), {
  range: false,
  monthPicker: false,
  yearPicker: false,
  size: 'medium',
  name: 'datepicker-input',
  placeholder: undefined,
  locale: 'en',
  startWeekOnMonday: false,
  clearable: true,
  disabled: false,
  error: false,
  dark: false,
  min: undefined,
  max: undefined,
  inputStyles: (props) => defaultInputStyles(!!props.dark),
  calendarStyles: (props) => defaultCalendarStyles(!!props.dark),
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void;
}>();

const container = ref<HTMLDivElement>();
const calendar = ref<HTMLDivElement>();
const open = ref<boolean>(false);

const inputValue = computed({
  get: () => {
    return props.range
      ? Array.isArray(props.modelValue)
        ? props.modelValue.map((date) =>
            date ? formatDate(date, getInputValueFormat()) : '',
          )
        : ['', '']
      : props.modelValue
        ? formatDate(
            props.modelValue as string | number | Date,
            getInputValueFormat(),
          )
        : '';
  },
  set: (value) => emit('update:modelValue', value),
});

const inputDisplay = computed(() => {
  return isRange.value && inputValue.value[0]
    ? `${formatDate(inputValue.value[0], getInputDisplayFormat())} - ${inputValue.value[1] ? formatDate(inputValue.value[1], getInputDisplayFormat()) : ''}`
    : !isRange.value && typeof inputValue.value === 'string'
      ? formatDate(inputValue.value, getInputDisplayFormat())
      : '';
});

const isRange = computed(() => props.range && Array.isArray(inputValue.value));

const mergedInputStyles = computed(() =>
  deepMerge(defaultInputStyles(props.dark), props.inputStyles),
);

const mergedCalendarStyles = computed(() =>
  deepMerge(defaultCalendarStyles(props.dark), props.calendarStyles),
);

const contentStyles = computed(() => floatingStyles.value);

const { floatingStyles, update: setFloatingUpdate } = useFloating(
  container,
  calendar,
  {
    placement: 'bottom-start',
    middleware: [flip()],
  },
);

useClickOutside(container, () => {
  open.value && (open.value = false);
});

function getInputValueFormat() {
  return props.yearPicker
    ? 'YYYY'
    : props.monthPicker
      ? 'YYYY-MM'
      : 'YYYY-MM-DD';
}

function getInputDisplayFormat() {
  return props.yearPicker
    ? 'YYYY'
    : props.monthPicker
      ? 'MMM YYYY'
      : 'DD. MMM YYYY';
}

function setOpen() {
  if (props.disabled) return;

  const nextOpen = !open.value;

  if (nextOpen) setFloatingUpdate();

  open.value = nextOpen;
}

async function setValue(value: '' | DateString | CalendarValue | Year) {
  isRange.value
    ? inputValue.value[0] && !inputValue.value[1]
      ? (inputValue.value = [inputValue.value[0], value].sort())
      : (inputValue.value = [value, ''])
    : (inputValue.value = value);

  await nextTick();

  if (isRange.value && !inputValue.value[1]) return;

  setOpen();
}

function click() {
  setOpen();
}

function clear() {
  isRange.value ? (inputValue.value = ['', '']) : (inputValue.value = '');
}

watch(
  () => props.locale,
  (newLocale) => {
    dayjs.locale(newLocale);
  },
  { immediate: true },
);
</script>

<template>
  <button
    ref="container"
    :key="props.locale"
    class="sib-datepicker"
    :class="{
      'sib-datepicker--small': props.size === 'small',
      'sib-datepicker--medium': props.size === 'medium',
      'sib-datepicker--large': props.size === 'large',
      'sib-datepicker--disabled': props.disabled,
      'sib-datepicker--error': props.error,
    }"
    :disabled="props.disabled"
    aria-label="Datepicker input"
    type="button"
    @click="click"
  >
    <div class="sib-datepicker__selection">
      <div
        class="sib-datepicker__selection__calendar-icon"
        aria-label="Calendar icon"
      >
        <slot name="calendarIcon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="tw-mr-2 tw-text-muted-foreground tw-size-4"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            ></path>
          </svg>
        </slot>
      </div>
      <input
        :value="inputDisplay"
        class="sib-datepicker__input"
        :placeholder="props.placeholder"
        tabindex="-1"
        type="text"
      />
      <input :name="props.name" :value="inputValue" type="hidden" />
      <button
        v-if="!props.disabled && props.clearable"
        class="sib-datepicker__selection__clear-icon"
        :class="{
          'sib-datepicker__selection__clear-icon--invisible': !inputValue,
        }"
        aria-label="Clear value"
        type="button"
        @click.stop="clear"
      >
        <slot name="clearIcon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="tw-ml-1 tw-text-muted-foreground tw-size-5"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m17 8-9 9m0-9 9 9"
            ></path>
          </svg>
        </slot>
      </button>
    </div>
    <div
      v-show="open"
      ref="calendar"
      class="sib-datepicker__calendar-wrapper"
      :style="contentStyles"
      @click.stop
    >
      <VueCalendar
        :opened="open"
        :value="inputValue"
        :range="isRange"
        :month-picker="props.monthPicker"
        :year-picker="props.yearPicker"
        :start-week-on-monday="props.startWeekOnMonday"
        :min="props.min ? formatDate(props.min, 'YYYY-MM-DD') : undefined"
        :max="props.max ? formatDate(props.max, 'YYYY-MM-DD') : undefined"
        :styles="mergedCalendarStyles"
        @change="setValue"
      >
        <template #leftNavButtonIcon>
          <slot name="leftNavButtonIcon" />
        </template>
        <template #rightNavButtonIcon>
          <slot name="rightNavButtonIcon" />
        </template>
      </VueCalendar>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.sib-datepicker {
  font-family: inherit;
  display: flex;
  width: 100%;
  padding: 0;
  border: v-bind('mergedInputStyles.container.border');
  border-radius: v-bind('mergedInputStyles.container.borderRadius');
  background-color: v-bind('mergedInputStyles.container.backgroundColor');

  &:hover {
    border: v-bind('mergedInputStyles.container.hoverBorder');
  }

  &--small {
    .sib-datepicker__selection {
      padding: v-bind('mergedInputStyles.container.small.paddingY')
        v-bind('mergedInputStyles.container.small.paddingX');

      &__calendar-icon {
        svg {
          width: v-bind('mergedInputStyles.container.small.calendarIcon.size');
          height: v-bind('mergedInputStyles.container.small.calendarIcon.size');
        }
      }

      &__clear-icon {
        svg {
          width: v-bind('mergedInputStyles.container.small.clearIcon.size');
          height: v-bind('mergedInputStyles.container.small.clearIcon.size');
        }
      }
    }
  }

  &--medium {
    .sib-datepicker__selection {
      padding: v-bind('mergedInputStyles.container.medium.paddingY')
        v-bind('mergedInputStyles.container.medium.paddingX');

      &__calendar-icon {
        svg {
          width: v-bind('mergedInputStyles.container.medium.calendarIcon.size');
          height: v-bind(
            'mergedInputStyles.container.medium.calendarIcon.size'
          );
        }
      }

      &__clear-icon {
        svg {
          width: v-bind('mergedInputStyles.container.medium.clearIcon.size');
          height: v-bind('mergedInputStyles.container.medium.clearIcon.size');
        }
      }
    }
  }

  &--large {
    .sib-datepicker__selection {
      padding: v-bind('mergedInputStyles.container.large.paddingY')
        v-bind('mergedInputStyles.container.large.paddingX');

      &__calendar-icon {
        svg {
          width: v-bind('mergedInputStyles.container.large.calendarIcon.size');
          height: v-bind('mergedInputStyles.container.large.calendarIcon.size');
        }
      }

      &__clear-icon {
        svg {
          width: v-bind('mergedInputStyles.container.large.clearIcon.size');
          height: v-bind('mergedInputStyles.container.large.clearIcon.size');
        }
      }
    }
  }

  &--disabled {
    opacity: v-bind('mergedInputStyles.container.disabled.opacity');
    pointer-events: none;
  }

  &--error {
    border-color: v-bind('mergedInputStyles.container.error.borderColor');
    background-color: v-bind(
      'mergedInputStyles.container.error.backgroundColor'
    );

    &:hover {
      border-color: v-bind('mergedInputStyles.container.error.borderColor');
    }
  }

  &__selection {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;

    &__calendar-icon {
      display: flex;
      color: v-bind('mergedInputStyles.selection.calendarIcon.color');
      margin-inline-end: v-bind(
        'mergedInputStyles.selection.calendarIcon.marginRight'
      );
    }

    &__clear-icon {
      display: flex;
      color: v-bind('mergedInputStyles.selection.clearIcon.color');
      padding: 0;
      margin-inline-start: v-bind(
        'mergedInputStyles.selection.clearIcon.marginLeft'
      );
      border: none;
      background-color: transparent;
      cursor: pointer;

      &--invisible {
        visibility: hidden;
        pointer-events: none;
      }
    }
  }

  &__input {
    color: v-bind('mergedInputStyles.input.color');
    font-family: inherit;
    font-size: v-bind('mergedInputStyles.input.fontSize');
    line-height: v-bind('mergedInputStyles.input.lineHeight');
    flex-grow: 1;
    min-width: 0;
    border: none;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    background-color: transparent;
    pointer-events: none;
    user-select: none;
  }

  &__calendar-wrapper {
    z-index: v-bind('mergedInputStyles.calendarWrapper.zIndex');
  }
}
</style>

## @softechub-ib/vue-datepicker

[![License](https://img.shields.io/npm/l/@softechub-ib/vue-datepicker)](https://github.com/softechub-ib/vue-datepicker/blob/main/LICENSE) [![npm](https://img.shields.io/npm/v/@softechub-ib/vue-datepicker)](https://www.npmjs.com/package/@softechub-ib/vue-datepicker) ![Downloads](https://img.shields.io/npm/dm/@softechub-ib/vue-datepicker) [![Open issues](https://img.shields.io/github/issues-raw/softechub-ib/vue-datepicker)](https://github.com/softechub-ib/vue-datepicker/issues) ![CI](https://img.shields.io/github/actions/workflow/status/softechub-ib/vue-datepicker/ci-coverage-upload.yml?branch=main&label=CI) [![Coverage Status](https://coveralls.io/repos/github/softechub-ib/vue-datepicker/badge.svg?branch=main)](https://coveralls.io/github/softechub-ib/vue-datepicker?branch=main)

### Datepicker solution for Vue 3 that offers:

- Single date picker
- Range date picker
- Month picker
- Year picker
- Locale support
- Start week on Sunday or Monday
- Full style configuration for input and calendar
- Dark and light theme
- Accessibility
- Type definitions

### Playground

[Datepicker Playground](https://stackblitz.com/edit/softechub-ib-vue-datepicker?file=src%2Fcomponents%2FSingleDatePicker.vue)

## Install

```shell
# npm
npm install @softechub-ib/vue-datepicker

# yarn
yarn add @softechub-ib/vue-datepicker

# pnpm
pnpm add @softechub-ib/vue-datepicker

# bun
bun add @softechub-ib/vue-datepicker
```

### Import and register component

**Global**

```ts
import { createApp } from "vue";
import App from "./App.vue";

import VueDatePicker from "@softechub-ib/vue-datepicker";
import "@softechub-ib/vue-datepicker/dist/style.css";

const app = createApp(App);
app.component("VueDatePicker", VueDatePicker);
app.mount("#app");
```

**Local**

```vue
<script setup>
import { ref } from "vue";
import VueDatePicker from "@softechub-ib/vue-datepicker";
import "@softechub-ib/vue-datepicker/dist/style.css";

const date = ref();
</script>

<template>
  <VueDatePicker v-model="date" />
</template>
```

**Types**

```ts
import type {
  CalendarStylesProp, // calendar-styles
  DateValue, // min, max, model-value (DateValue | DateValue[])
  DayjsLocale, // locale
  InputStylesProp, // input-styles
  Size, // size
} from "@softechub-ib/vue-datepicker";
```

## Props

| Prop                 | Required | Type                                                                                                     | Default value           |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------- | ----------------------- |
| model-value          | yes      | `string \| number \| Date \| null \| undefined \| (string \| number \| Date \| null \| undefined)[]`     |                         |
| range                | no       | `boolean`                                                                                                | `false`                 |
| month-picker         | no       | `boolean`                                                                                                | `false`                 |
| year-picker          | no       | `boolean`                                                                                                | `false`                 |
| size                 | no       | `"small" \| "medium" \| "large"`                                                                         | `"medium"`              |
| name                 | no       | `string`                                                                                                 | `"datepicker-input"`    |
| placeholder          | no       | `string`                                                                                                 | `undefined`             |
| locale               | no       | [DayjsLocale](https://cdn.jsdelivr.net/npm/dayjs@1/locale.json) (union type of key values from the link) | `"en"`                  |
| start-week-on-monday | no       | `boolean`                                                                                                | `false`                 |
| clearable            | no       | `boolean`                                                                                                | `true`                  |
| disabled             | no       | `boolean`                                                                                                | `false`                 |
| error                | no       | `boolean`                                                                                                | `false`                 |
| dark                 | no       | `boolean`                                                                                                | `false`                 |
| min                  | no       | `string \| number \| Date \| null \| undefined`                                                          | `undefined`             |
| max                  | no       | `string \| number \| Date \| null \| undefined`                                                          | `undefined`             |
| input-styles         | no       | [InputStylesProp](#input-styles-prop)                                                                    | `defaultInputStyles`    |
| calendar-styles      | no       | [CalendarStylesProp](#calendar-styles-prop)                                                              | `defaultCalendarStyles` |

<a name="input-styles-prop"></a>

**InputStylesProp**

Each prop of `InputStylesProp` can be changed, but it is optional. At the end, custom styles will be merged with `defaultInputStyles`.

```ts
type Unit = "%" | "px" | "em" | "rem";

type InputStylesProp = {
  container?: {
    border?: string;
    hoverBorder?: string;
    borderRadius?: `${number}${Unit}`;
    backgroundColor?: string;
    small?: {
      paddingX?: `${number}${Unit}`;
      paddingY?: `${number}${Unit}`;
      calendarIcon?: {
        size?: `${number}${Unit}`;
      };
      clearIcon?: {
        size?: `${number}${Unit}`;
      };
    };
    medium?: {
      paddingX?: `${number}${Unit}`;
      paddingY?: `${number}${Unit}`;
      calendarIcon?: {
        size?: `${number}${Unit}`;
      };
      clearIcon?: {
        size?: `${number}${Unit}`;
      };
    };
    large?: {
      paddingX?: `${number}${Unit}`;
      paddingY?: `${number}${Unit}`;
      calendarIcon?: {
        size?: `${number}${Unit}`;
      };
      clearIcon?: {
        size?: `${number}${Unit}`;
      };
    };
    disabled?: {
      opacity?: `${number}`;
    };
    error?: {
      borderColor?: string;
      backgroundColor?: string;
    };
  };
  selection?: {
    calendarIcon?: {
      color?: string;
      marginRight?: `${number}${Unit}`;
    };
    clearIcon?: {
      color?: string;
      marginLeft?: `${number}${Unit}`;
    };
  };
  input?: {
    fontSize?: `${number}${Unit}`;
    lineHeight?: `${number}${Unit}`;
    color?: string;
  };
  calendarWrapper?: {
    zIndex?: `${number}`;
  };
};
```

<a name="calendar-styles-prop"></a>

**CalendarStylesProp**

Each prop of `CalendarStylesProp` can be changed, but it is optional. At the end, custom styles will be merged with `defaultCalendarStyles`.

```ts
type Unit = "%" | "px" | "em" | "rem";

type CalendarStylesProp = {
  container?: {
    width?: `${number}px`;
    paddingX?: `${number}${Unit}`;
    paddingY?: `${number}${Unit}`;
    border?: string;
    borderRadius?: `${number}${Unit}`;
    backgroundColor?: string;
    boxShadow?: string;
  };
  header?: {
    marginBottom?: `${number}${Unit}`;
  };
  headerButton?: {
    padding?: `${number}${Unit}`;
    color?: string;
    border?: string;
    borderRadius?: `${number}${Unit}`;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    iconSize?: `${number}${Unit}`;
    restricted?: {
      opacity?: `${number}`;
    };
  };
  headerDateItem?: {
    fontSize?: `${number}${Unit}`;
    fontWeight?: `${number}`;
    lineHeight?: `${number}${Unit}`;
    color?: string;
    paddingX?: string;
    paddingY?: string;
    borderRadius?: `${number}${Unit}`;
    hoverBackgroundColor?: string;
  };
  table?: {
    fontSize?: `${number}${Unit}`;
    gap?: `${number}${Unit}`;
  };
  tableHead?: {
    fontWeight?: `${number}`;
  };
  tableHeadItem?: {
    color?: string;
  };
  tableBody?: {
    fontWeight?: `${number}`;
  };
  tableBodyRow?: {
    days?: {
      marginTop?: `${number}${Unit}`;
    };
    monthsYears?: {
      marginBottom?: `${number}${Unit}`;
    };
  };
  tableBodyItem?: {
    borderRadius?: `${number}${Unit}`;
    color?: string;
    hoverBackgroundColor?: string;
    offset?: {
      color?: string;
      hoverColor?: string;
      opacity?: `${number}`;
    };
    current?: {
      border?: string;
    };
    restricted?: {
      color?: string;
      opacity?: `${number}`;
    };
    selected?: {
      color?: string;
      backgroundColor?: string;
    };
  };
};
```

## Slots

- `calendarIcon` (Input calendar icon)
- `clearIcon` (Input clear icon)
- `leftHeaderButtonIcon` (Calendar left header button icon)
- `rightHeaderButtonIcon` (Calendar right header button icon)

## License

Copyright © 2024-present [softechub-ib](https://github.com/softechub-ib)

[MIT](https://github.com/softechub-ib/vue-datepicker/blob/master/LICENSE)

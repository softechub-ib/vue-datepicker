<script setup lang="ts">
import { CalendarStylesProp, InputStylesProp } from '@/types/index';
import VueDatePicker from '@/components/VueDatePicker.vue';
import { ref } from 'vue';

const date = ref('2024-12-11');
const locale = ref<'en' | 'sr'>('en');
const dark = ref(false);
const inputStyles = ref<InputStylesProp>({
  container: {
    // borderRadius: '10px',
  },
  calendarWrapper: {
    zIndex: '16',
  },
});
const calendarStyles = ref<CalendarStylesProp>({
  container: {
    // width: '372px',
    // paddingX: '24px',
    // borderRadius: '10px',
  },
  table: {
    // gap: '16px',
  },
  tableBodyRow: {
    days: {
      // marginTop: '6px',
    },
    monthsYears: {
      // marginBottom: '48px',
    },
  },
});

function change() {
  dark.value = !dark.value;
  locale.value = 'sr';
  calendarStyles.value.container &&
    (calendarStyles.value.container.width = '272px');
}
</script>

<template>
  <button @click="change">Click me</button>
  <VueDatePicker
    v-model="date"
    :locale="locale"
    :start-week-on-monday="locale === 'sr'"
    :min="new Date('2024-12-05')"
    :max="null"
    :dark="dark"
    :input-styles="inputStyles"
    :calendar-styles="calendarStyles"
  />
  <p style="position: relative; z-index: 15">TEST z-index</p>
</template>

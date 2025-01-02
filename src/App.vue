<script setup lang="ts">
import { CalendarStylesProp, InputStylesProp } from '@/types';
import VueDatePicker from '@/components/VueDatePicker.vue';
import { ref } from 'vue';

const date = ref();
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
}
</script>

<template>
  <button @click="change">Click me</button>
  <p>Date value: {{ date }}</p>
  <VueDatePicker
    v-model="date"
    range
    :locale="locale"
    :start-week-on-monday="locale === 'sr'"
    :min="'2024-09-15'"
    :max="null"
    :dark="dark"
    :input-styles="inputStyles"
    :calendar-styles="calendarStyles"
  />
  <p style="position: relative; z-index: 15">TEST z-index</p>
</template>

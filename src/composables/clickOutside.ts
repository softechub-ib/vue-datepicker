import { Ref, onBeforeUnmount, onMounted } from 'vue';

export function useClickOutside<E extends HTMLElement>(
  element: Ref<E | undefined>,
  callback: () => void,
) {
  onMounted(() => window.addEventListener('click', click));
  onBeforeUnmount(() => window.removeEventListener('click', click));

  const click = (event: MouseEvent) => {
    if (
      event.target === element.value ||
      event.composedPath().includes(<E>element.value)
    ) {
      return;
    }

    typeof callback === 'function' && callback();
  };
}

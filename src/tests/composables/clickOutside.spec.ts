import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { useClickOutside } from '@/composables/clickOutside';

describe('useClickOutside', () => {
  let elementRef: any;
  let callback: Mock;

  beforeEach(() => {
    callback = vi.fn();
    elementRef = ref<HTMLElement | undefined>(undefined);
  });

  it('Calls callback when clicking outside of the element', async () => {
    const TestComponent = {
      setup() {
        useClickOutside(elementRef, callback);

        return { elementRef };
      },
      template: `<div ref="elementRef">Click me!</div>`,
    };

    const wrapper = mount(TestComponent);

    const divElement = wrapper.find('div').element;
    elementRef.value = divElement;

    const event = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it('Does not call callback when clicking inside the element', async () => {
    const TestComponent = {
      setup() {
        useClickOutside(elementRef, callback);

        return { elementRef };
      },
      template: `<div ref="elementRef">Click me!</div>`,
    };

    const wrapper = mount(TestComponent);

    const divElement = wrapper.find('div').element;
    elementRef.value = divElement;

    const event = new MouseEvent('click', { bubbles: true });
    divElement.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('Removes event listener when component is unmounted', async () => {
    const removeListener = vi.fn();
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi
      .spyOn(window, 'removeEventListener')
      .mockImplementation(removeListener);

    const TestComponent = {
      setup() {
        useClickOutside(elementRef, callback);

        return { elementRef };
      },
      template: `<div ref="elementRef">Click me!</div>`,
    };

    const wrapper = mount(TestComponent);

    expect(addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    await wrapper.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );
  });
});

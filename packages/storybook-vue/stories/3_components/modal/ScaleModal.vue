<template>
  <scale-modal
    :custom-class="customClass"
    :heading="heading"
    :size="size"
    :variant="size"
    :opened="opened"
    :duration="duration"
    :close-button-label="closeButtonLabel"
    :align-actions="alignActions"
    :styles="styles"
    @scaleClose="scaleClose"
    @scaleOpen="scaleOpen"
    @scaleBeforeClose="scaleBeforeClose"
  >
    <slot name="close"></slot>
    <slot></slot>
    <slot name="actions"></slot>
  </scale-modal>
</template>

<script>
import { action } from "@storybook/addon-actions";

const scaleCloseAction = action('scaleClose');

export default {
  props: {
    customClass: String,
    heading: { type: String, default: 'Today is your lucky day' },
    size: String,
    variant: String,
    opened: Boolean,
    duration: { type: Number, default: 200 },
    closeButtonLabel: String,
    alignActions: { type: String, default: 'right' },
    styles: { type: String },
  },
  methods: {
    scaleOpen($event) {
      action("scaleOpen");
      this.$emit("scaleOpen", $event);
    },
    'scale-open'($event) {
      action("scale-open");
      this.$emit("scale-open", $event);
    },
    scaleBeforeClose($event) {
      action("scaleBeforeClose");
      this.$emit("scaleBeforeClose", $event);
    },
    'scale-before-close'($event) {
      action("scale-before-close");
      this.$emit("scale-before-close", $event);
    },
    scaleClose($event) {
      action("scaleClose");
      this.$emit("scaleClose", $event);
    },
    'scale-close'($event) {
      action("scale-close");
      this.$emit("scale-close", $event);
    },
  }
};
</script>

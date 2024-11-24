<template>
  <div
    v-if="visible"
    :class="[
      'fixed top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full z-50 p-4 rounded-lg shadow-lg',
      type === 'success' ? 'bg-green-700 text-white' : 'bg-red-500 text-white'
    ]"
  >
    <div class="flex justify-between items-center">
      <span>{{ message }}</span>
      <button @click="hide" class="text-xl font-bold ml-4">&times;</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "success", // "success" or "error"
    },
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    hide() {
      this.visible = false;
    },
  },
  mounted() {
    // Automatically hide the notification after 3 seconds
    setTimeout(() => {
      this.visible = false;
    }, 3000);
  },
};
</script>

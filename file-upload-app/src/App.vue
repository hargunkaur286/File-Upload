<template>
  <div class="min-h-screen bg-green-50">
    <!-- Navbar -->
    <nav class="bg-green-500 text-white py-4 px-6 shadow-md z-50 sticky top-0">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">lendwire</h1>
        <ul class="flex space-x-6">
          <li><a href="#" class="hover:underline">Home</a></li>
          <li><a href="#" class="hover:underline">About</a></li>
          <li><a href="#" class="hover:underline">Contact</a></li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div class="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        <!-- Left Section: Heading and Description -->
        <div class="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Upload Files,
Anywhere, Anytime</h2>
          <p class="text-gray-600 text-lg mb-6">
            Quickly upload your files with drag-and-drop or browsing. Optimized for efficiency and accessibility.
          </p>
        </div>

        <!-- Right Section: File Upload -->
        <div class="lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
          <div
            class="border-2 border-dashed border-green-500 rounded-lg p-8 text-center hover:bg-green-50 transition relative"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div class="text-green-500 text-4xl">
              <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <p class="text-gray-700 mt-4">
              Drag & drop files or
              <span
                class="text-green-500 underline cursor-pointer"
                @click="openFilePicker"
                >Browse</span
              >
            </p>
            <p class="text-sm text-gray-500 mt-1">Supported formats: JPEG, PNG, PDF</p>
            <input
              type="file"
              id="fileInput"
              ref="fileInput"
              class="hidden"
              multiple
              @change="onFileChange"
            />
          </div>

          <div v-if="files.length" class="mt-6">
            <h3 class="text-lg font-semibold mb-3 text-gray-800">
              Uploading - {{ files.length }} file(s)
            </h3>
            <div v-for="(file, index) in files" :key="index" class="mb-3">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-800 truncate">{{ file.name }}</p>
                <button class="text-red-500" @click="removeFile(index)">×</button>
              </div>
              <div class="w-full bg-gray-200 rounded-lg h-2 mt-1">
                <div
                  class="bg-green-500 h-2 rounded-lg"
                  :style="{ width: uploadProgress[index] + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <button
            class="w-full bg-green-500 text-white rounded-lg py-2 mt-6 font-semibold hover:bg-green-600 transition"
            @click="uploadFiles"
            :disabled="files.length === 0"
          >
            UPLOAD FILES
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      files: [],
      uploadedFiles: [],
      uploadProgress: [],
      notification: {
        visible: false,
        type: "success",
        message: "",
      },
    };
  },
  methods: {
    onFileChange(event) {
      this.files = Array.from(event.target.files);
      this.uploadProgress = new Array(this.files.length).fill(0);
    },
    openFilePicker() {
      this.$refs.fileInput.click();
    },
    handleDrop(event) {
      this.files = Array.from(event.dataTransfer.files);
      this.uploadProgress = new Array(this.files.length).fill(0);
    },
    async uploadFiles() {
      const promises = this.files.map((file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        return axios.post("http://localhost:4000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            this.uploadProgress[index] = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
        });
      });

      try {
        const responses = await Promise.all(promises);

        if (responses.every((response) => response.status === 200)) {
          this.notification = {
            visible: true,
            type: "success",
            message: "Files uploaded successfully!",
          };
          this.uploadedFiles = this.files.map((file) => file.name);
          this.files = [];
          this.uploadProgress = [];
        } else {
          this.notification = {
            visible: true,
            type: "error",
            message: "Some files failed to upload.",
          };
        }
      } catch (error) {
        console.error(error);
        this.notification = {
          visible: true,
          type: "error",
          message: "Error uploading files. Please try again.",
        };
      }
    },
    removeFile(index) {
      this.files.splice(index, 1);
      this.uploadProgress.splice(index, 1);
    },
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>

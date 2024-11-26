<template>
  <div class="min-h-screen bg-green-50">
    <nav class="bg-green-600 text-white py-4 px-6 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">lendwire</h1>
        <ul class="flex space-x-6">
          <li><a href="#" class="hover:underline">Home</a></li>
          <li><a href="#" class="hover:underline">About</a></li>
          <li><a href="#" class="hover:underline">Contact</a></li>
        </ul>
      </div>
    </nav>

    <div class="flex flex-col items-center justify-center mt-12 px-4">
      <header class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Upload Your Files</h2>
        <p class="text-gray-600 mt-2">
          Easily upload multiple files to our platform. Drag and drop or browse
          to get started.
        </p>
      </header>

      <div class="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">
          Upload
        </h1>
        <div
          class="border-2 border-dashed border-green-500 rounded-lg p-8 text-center hover:bg-green-100 transition relative"
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
          <p class="text-sm text-gray-500 mt-1">
            Supported formats: JPEG, PNG, PDF
          </p>
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

        <div v-if="uploadedFiles.length" class="mt-6">
          <h3 class="text-lg font-semibold mb-3 text-gray-800">Uploaded</h3>
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="flex items-center justify-between bg-green-100 rounded-lg p-2 mb-2"
          >
            <p class="text-sm text-green-700 truncate">{{ file }}</p>
            <button class="text-red-500" @click="removeUploadedFile(index)">
              ×
            </button>
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
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      files: [],
      uploadedFiles: [],
      uploadProgress: [],
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
      const toast = useToast(); // Ensure useToast is initialized properly
      const formData = new FormData();

      // Append all files to FormData
      this.files.forEach((file) => {
        formData.append("file", file);
      });

      try {
        const response = await axios.post("http://localhost:4000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success("Files uploaded successfully!");

          // Add files to uploadedFiles and reset progress
          this.uploadedFiles = [...this.files.map((file) => file.name)];
          this.files = [];
          this.uploadProgress = [];
        } else {
          toast.error("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Error uploading files. Please try again.");
      }
    },
    removeFile(index) {
      this.files.splice(index, 1);
      this.uploadProgress.splice(index, 1);
    },
    removeUploadedFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>

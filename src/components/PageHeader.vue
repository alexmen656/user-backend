<template>
    <div class="col">
        <h1 class="h3 mb-0">
            {{ title }}
            <span v-if="isOfflineMode" class="badge bg-warning ms-2">
                <i class="bi bi-wifi-off me-1"></i>
                Offline Mode
            </span>
        </h1>
        <p class="text-muted">{{desc}}</p>
    </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    isOfflineMode: Boolean,
    title: String,
    desc: String
  }
}
</script>
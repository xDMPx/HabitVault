<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
    formSubmitted: [name: string, description: string]
}>()

const props = defineProps<{
    habit?: {
        name: string
        description: string
    }
}>()

watch(() => props.habit, (newHabit, _oldHabit) => {
    if (newHabit !== undefined) {
        formData.value.name = newHabit.name
        formData.value.description = newHabit.description
    }
})

const formData = ref({
    name: props.habit?.name ?? "",
    description: props.habit?.description ?? ""
})

function handleFormSubmit() {
    emit('formSubmitted', formData.value.name, formData.value.description)
    formData.value.name = ""
    formData.value.description = ""
}
</script>

<template>

    <form @submit.prevent="handleFormSubmit">
        <div class="form-control">
            <label class="label">
                <span class="label-text">Name</span>
            </label>
            <input type="name" placeholder="name" class="input input-bordered" v-model="formData.name" required />
        </div>
        <div class="form-control">
            <label class="label">
                <span class="label-text">Description</span>
            </label>
            <textarea placeholder="Description" class="textarea textarea-bordered textarea-lg w-full"
                v-model="formData.description" required></textarea>
        </div>
        <div class="form-control mt-6">
            <button class="btn btn-primary">Submit</button>
        </div>
    </form>

</template>

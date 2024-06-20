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
const showAlert = ref(false)
const alertText = ref([""])

function handleFormSubmit() {
    if (!isValidHabitName(formData.value.name)) {
        showAlert.value = true
        alertText.value = ["Invalid habit name",
            "Length between 3 to 20 characters.",
            "Must start with a capital letter.",
            "Can contain letters, numbers, periods, commas and '|', '/', '\\', '_', '-'."]
        return
    }
    else if (formData.value.description.length > 140) {
        showAlert.value = true
        alertText.value = ["Habit description too long"]
        return
    }

    emit('formSubmitted', formData.value.name, formData.value.description)
    formData.value.name = ""
    formData.value.description = ""
    showAlert.value = false
}

function isValidHabitName(username: string): Boolean {
    const usernameRegex = /^[A-Z][a-zA-Z0-9.,|/\_-]{2,19}$/
    return usernameRegex.test(username)
}
</script>

<template>
    <div role="alert" class="alert flex alert-error" v-if="showAlert">
        <div class="grow">
            <p v-for="alert in alertText">
                {{ alert }}
            </p>
        </div>
        <button class="flex">
            <span class="grow material-symbols-outlined" @click="showAlert = false">
                close
            </span>
        </button>
    </div>
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

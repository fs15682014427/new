<script setup>
import { nextTick, ref } from "vue";
import { ElInput } from "element-plus";

defineProps({
  dynamicTags: {
    type: Array,
    default: () => []
  }
})

const $emits = defineEmits(['onAddTag'])

const inputValue = ref("");
// const dynamicTags = ref(["亲爱的", "Daisy"]);
const inputVisible = ref(false);
const InputRef = ref();

const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    // dynamicTags.value.push(inputValue.value);
    $emits('onAddTag', inputValue.value)
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>


<template>
  <div>
    <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          class="mx-1"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="ml-1 w-20"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button
          v-else
          class="button-new-tag ml-1"
          size="small"
          @click="showInput"
        >
          + 新增
        </el-button>
  </div>
</template>
<style lang="scss" scoped>
.mx-1{
  margin-left: 10px;
}
.ml-1{
  margin-left: 10px;
}

.w-20{
  width: 100px;
}
</style>
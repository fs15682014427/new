<script setup>
import { ref } from "vue";

const basicForm = ref({
  per_description: '',
  flaw: '',
  incentive: ''
});
</script>
<template>
  <div class="basic-form">
    <el-form label-position="top" :model="basicForm">
      <el-form-item label="核心设定">
        
          <el-input
          v-model="basicForm.per_description"
          :autosize="{ minRows: 6, maxRows: 10 }"
          type="textarea"
          placeholder="Tips：⻆⾊的基础内容，包括背景故事、⾝份特征、⾏为或习惯"
        />
      </el-form-item>
      <el-form-item label="缺陷">
        <el-input
          v-model="basicForm.flaw"
          :autosize="{ minRows: 4, maxRows: 10 }"
          type="textarea"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="动机">
        <el-input
          v-model="basicForm.incentive"
          :autosize="{ minRows: 4, maxRows: 10 }"
          type="textarea"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="声音特征">
        <el-select
          class="m-2"
          placeholder="声音特征"
          disabled
        >
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.basic-form {
  width: 600px;
  border: 1px solid red;

}
</style>

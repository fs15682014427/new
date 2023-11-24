<script setup>
import { ref } from 'vue'
import AliasTag from '@/components/AliasTags.vue'

const options = [
  {
    value: '1',
    label: '男',
  },
  {
    value: '0',
    label: '女',
  },
  {
    value: '2',
    label: '无定义',
  },
  
]

const ageStage = [
  {
    value: '1',
    label: '童年',
  },
  {
    value: '2',
    label: '青春期',
  },
  {
    value: '3',
    label: '青年',
  },
  {
    value: '4',
    label: '中年',
  },
  {
    value: '5',
    label: '晚年',
  },
  {
    value: '6',
    label: '无定义',
  },
]

const aliasTages = ref(["亲爱的", "Daisy"])
const identityTags = ref(["sdf", "sdfy"])
const hobbyTags = ref(['c','d','f'])
const roleForm = ref({
  name: '',
  alias: aliasTages,
  sex: '',
  identity: identityTags,
  age_stage: '',
  hobby: hobbyTags
})

const handleAddTag = (val) => {
  console.log(val)
}

</script>
<template>
  <div class="role-form">
    <el-form label-position="top" :model="roleForm">
      <el-form-item label="名称">
        <el-input style="width: 199px;" v-model="roleForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="别称">
        <div class="tag">
          <AliasTag :dynamicTags="aliasTages" @onAddTag="handleAddTag"></AliasTag>
        </div>
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="roleForm.sex"
          class="m-2"
          placeholder="请选择性别"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份">
        <AliasTag :dynamicTags="identityTags"></AliasTag>
      </el-form-item>
      <el-form-item label="年龄阶段">
        <el-select
          v-model="roleForm.age_stage"
          class="m-2"
          placeholder="请选择年龄阶段"
        >
          <el-option
            v-for="item in ageStage"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="兴趣爱好">
        <AliasTag :dynamicTags="hobbyTags"></AliasTag>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.role-form{
  width: 600px;
  border: 1px solid red;

  .tag{
    background: skyblue;
    width: 100%;

  }
}
</style>

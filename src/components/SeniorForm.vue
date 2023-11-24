<script setup>
import { ref } from "vue";
import AliasTag from "@/components/AliasTags.vue";

const personalityTag = ref(["温柔善良", "骄傲", "爱搞笑"]);

const seniorForm = ref({
  personality: personalityTag,
  dimension: [],
  incentive: "",
  knowledge: '',
  knowledge_bases: '',
  style: '',
  long_term_memory: true,
  relationships: false,
  value1: 50,
  value2: 50,
  value3: 50,
  value4: 50,
  value5: 50,
  value6: 50,
});
</script>
<template>
  <div class="senior-form">
    <el-form label-position="top" :model="seniorForm">
      <el-form-item label="性格特征">
        <AliasTag :dynamicTags="personalityTag"></AliasTag>
      </el-form-item>
      <el-form-item label="性格维度">
        <div>
          <span>内向</span>
          <el-slider v-model="seniorForm.value1"/>
          <span>外向</span>
        </div>
        <div>
          <span>不安全感</span>
          <el-slider v-model="seniorForm.value2"/>
          <span>自信</span>
        </div>
        <div>
          <span>女性化</span>
          <el-slider v-model="seniorForm.value3"/>
          <span>男性化</span>
        </div>
        <div>
          <span>佛系</span>
          <el-slider v-model="seniorForm.value4"/>
          <span>积极</span>
        </div>
        <div>
          <span>保守</span>
          <el-slider v-model="seniorForm.value5"/>
          <span>开放</span>
        </div>
        <div>
          <span>情绪稳定</span>
          <el-slider v-model="seniorForm.value6"/>
          <span>敏感</span>
        </div>
      </el-form-item>
      <el-form-item label="个人知识">
        <el-input
          v-model="seniorForm.knowledge"
          :autosize="{ minRows: 4, maxRows: 10 }"
          type="textarea"
          placeholder="Tips：⼀⾏填写⼀个知识"
        />
      </el-form-item>
      <el-form-item label="说话风格">
        <el-input
          v-model="seniorForm.style"
          :autosize="{ minRows: 4, maxRows: 10 }"
          type="textarea"
          placeholder="Tips：说话⻛格⽰例"
        />
      </el-form-item>
      <el-form-item>
        <span>长期记忆</span>

        <el-switch
          v-model="seniorForm.long_term_memory"
          inline-prompt
          active-text="开启"
          inactive-text="关闭"
        />
      </el-form-item>
      <el-form-item>
        <span>用户关系</span>

        <el-switch
          v-model="seniorForm.relationships"
          inline-prompt
          active-text="开启"
          inactive-text="关闭"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.senior-form {
  width: 600px;
  border: 1px solid red;
}
</style>

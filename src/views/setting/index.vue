<script setup>
import { ref, onMounted, nextTick, onBeforeMount } from "vue";
import RoleForm from "@/components/RoleForm.vue";
import BasicForm from "@/components/BasicForm.vue";
import SeniorForm from "@/components/SeniorForm.vue";
import {
  reqGetAllKnowledge,
  reqAddOrUpdateKnowledge,
  reqDeleteKnowledge,
  reqSaveSetting,
} from "@/api/user";
import { Plus } from "@element-plus/icons-vue";
import AliasTag from "@/components/AliasTags.vue";
import { ElInput } from "element-plus";
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'

let $router = useRouter()
let userStore = useUserStore()
let active = ref(0);
let notShow = false
let temperature = ref(0.3);
let tokens_to_generate = ref(4096);
let top_p = ref(5);
let background = ref("");
let checked = false;
let knowledges = ref([]);
let dialogFormVisible = ref(false);


let knowledgeParams = ref({
  description: "",
  info: "",
  name: "",
});

const options = [
  {
    value: "男",
    label: "男",
  },
  {
    value: "女",
    label: "女",
  },
  {
    value: "无定义",
    label: "无定义",
  },
];

const ageStage = [
  {
    value: "童年",
    label: "童年",
  },
  {
    value: "青春期",
    label: "青春期",
  },
  {
    value: "青年",
    label: "青年",
  },
  {
    value: "中年",
    label: "中年",
  },
  {
    value: "晚年",
    label: "晚年",
  },
  {
    value: "无定义",
    label: "无定义",
  },
];

const aliasTages = ref([]);
const aliasInputValue = ref("");
const aliasInputVisible = ref(false);
const AliasInputRef = ref();
const identityTags = ref([]);
const identityInputValue = ref("");
const identityInputVisible = ref(false);
const IdentityInputRef = ref();
const hobbyTags = ref([]);
const hobbyInputValue = ref("");
const hobbyInputVisible = ref(false);
const HobbyInputRef = ref();
const personalityTags = ref([]);
const personalityInputValue = ref("");
const personalityInputVisible = ref(false);
const PersonalityInputRef = ref();
const regRule = ref(false)
const roleForm = ref({
  name: "",
  alias: aliasTages.value,
  sex: "",
  identity: identityTags.value,
  age_stage: "",
  hobby: hobbyTags.value,
});
const basicForm = ref({
  per_description: "",
  flaw: "",
  incentive: "",
});
const seniorForm = ref({
  personality: personalityTags.value,
  dimension: [50, 50, 50, 50, 50, 50],
  knowledge: "",
  knowledge_bases: [],
  style: "",
  long_term_memory: false,
  relationships: false,
});



const handleAliasClose = (tag) => {
  aliasTages.value.splice(aliasTages.value.indexOf(tag), 1);
};

const showAliasInput = () => {
  aliasInputVisible.value = true;
  nextTick(() => {
    AliasInputRef.value.input.focus();
  });
};

const handleAliasInputConfirm = () => {
  if (aliasInputVisible.value) {
    aliasTages.value.push(aliasInputValue.value);
  }
  aliasInputVisible.value = false;
  aliasInputVisible.value = "";
};

const handleIdentityClose = (tag) => {
  identityTags.value.splice(identityTags.value.indexOf(tag), 1);
};

const showIndentityInput = () => {
  identityInputVisible.value = true;
  nextTick(() => {
    IdentityInputRef.value.input.focus();
  });
};

const handleIdentityInputConfirm = () => {
  if (identityInputVisible.value) {
    identityTags.value.push(identityInputValue.value);
  }
  identityInputVisible.value = false;
  identityInputVisible.value = "";
};

const handleHobbyClose = (tag) => {
  hobbyTags.value.splice(hobbyTags.value.indexOf(tag), 1);
};

const showHobbyInput = () => {
  hobbyInputVisible.value = true;
  nextTick(() => {
    HobbyInputRef.value.input.focus();
  });
};

const handleHobbyInputConfirm = () => {
  if (hobbyInputVisible.value) {
    hobbyTags.value.push(hobbyInputValue.value);
  }
  hobbyInputVisible.value = false;
  hobbyInputVisible.value = "";
};

const handlePersonalityClose = (tag) => {
  personalityTags.value.splice(personalityTags.value.indexOf(tag), 1);
};

const showPersonalityInput = () => {
  personalityInputVisible.value = true;
  nextTick(() => {
    PersonalityInputRef.value.input.focus();
  });
};

const handlePersonalityInputConfirm = () => {
  if (personalityInputVisible.value) {
    personalityTags.value.push(personalityInputValue.value);
  }
  personalityInputVisible.value = false;
  personalityInputVisible.value = "";
};

const onClickRegForm = () => {
  if (active.value == 0 && roleForm.value.name == "") {
    regRule.value = true
  } else {
    regRule.value = false
    active.value++
  }
}
const onClickConfirm = async () => {
  let transferArr = []
  for (let i = 0; i < seniorForm.value.knowledge_bases.length; i++) {
    if (!transferArr.includes(seniorForm.value.knowledge_bases[i])) {
      transferArr.push(seniorForm.value.knowledge_bases[i])
    }
  }
  seniorForm.value.knowledge_bases = transferArr
  localStorage.setItem("name", roleForm.value.name)

  let settingParams = ref({
    ...roleForm.value,
    ...basicForm.value,
    ...seniorForm.value,
    temperature: temperature.value,
    tokens_to_generate: tokens_to_generate.value,
    top_p: top_p.value,
    background: background.value,
    user_id: userStore.userId,
    sound: ''
  });

  if (JSON.parse(localStorage.getItem("userInfo")).data.local_param) {
    settingParams.value.id = JSON.parse(localStorage.getItem("userInfo")).data.local_param.id
  }
  let result = await reqSaveSetting(settingParams.value)

  if (result.code == 200) {
    $router.push('/chatgpt')
  }
};

onMounted(() => {


  userStore.reqGetUserInfo().then(res => {
    const userInfoMessage = res
    getAllKnowledge();
    if (userInfoMessage.data.local_param) {
      const userInfo = userInfoMessage

      aliasTages.value = userInfo.data.local_param.alias
      identityTags.value = userInfo.data.local_param.identity
      hobbyTags.value = userInfo.data.local_param.hobby
      personalityTags.value = userInfo.data.local_param.personality
      background.value = userInfo.data.local_param.background
      tokens_to_generate.value = userInfo.data.local_param.tokens_to_generate
      temperature.value = userInfo.data.local_param.temperature
      top_p.value = userInfo.data.local_param.top_p
      roleForm.value = {
        name: userInfo.data.local_param.name,
        alias: userInfo.data.local_param.alias,
        sex: userInfo.data.local_param.sex,
        identity: userInfo.data.local_param.identity,
        age_stage: userInfo.data.local_param.age_stage,
        hobby: userInfo.data.local_param.hobby,
      }
      basicForm.value = {
        per_description: userInfo.data.local_param.per_description,
        flaw: userInfo.data.local_param.flaw,
        incentive: userInfo.data.local_param.incentive,
      }
      seniorForm.value = {
        personality: userInfo.data.local_param.personality,
        dimension: userInfo.data.local_param.dimension,
        knowledge: userInfo.data.local_param.knowledge ? userInfo.data.local_param.knowledge : '',
        knowledge_bases: userInfo.data.local_param.knowledge_bases,
        style: userInfo.data.local_param.style,
        long_term_memory: userInfo.data.local_param.long_term_memory,
        relationships: userInfo.data.local_param.relationships,
      }
    }
  })
});

// onBeforeMount(() => {



// })
const onClickAddKnowledges = () => {
  dialogFormVisible.value = true;
  knowledgeParams.value.id = 0;
  knowledgeParams.value.name = "";
  knowledgeParams.value.description = "";
  knowledgeParams.value.info = "";
};

const onClickUpdateKnowledges = (row) => {
  dialogFormVisible.value = true;
  Object.assign(knowledgeParams.value, row);
};

const onClickDeleteBtn = async (id) => {
  let result = await reqDeleteKnowledge(id);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getAllKnowledge();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

const onClickCancelBtn = () => { };

const handleLongChange = (val) => {
  seniorForm.value.long_term_memory = val
}

const handleRelationshipsChange = (val) => {
  seniorForm.value.relationships = val
}
const getAllKnowledge = () => {
  userStore.reqGetUserInfo().then(result => {
    reqGetAllKnowledge().then((res) => {
      knowledges.value = res.data
      knowledges.value.forEach(item => {
        result.data.local_param.knowledge_bases.forEach(obj => {
          if (String(item.id) === String(obj)) {
            item.checked = true
          }
        })
      })
    });
  })
};
const handleChecked = (val) => {
  let transferArr = []
  if (val.checked) {
    seniorForm.value.knowledge_bases.push(val.id)
  } else {
    for (let i = 0; i < seniorForm.value.knowledge_bases.length; i++) {
      if (seniorForm.value.knowledge_bases[i] == val.id) {
        seniorForm.value.knowledge_bases.splice(i, 1)
      }
    }
  }
};

const onClickCancel = () => {
  dialogFormVisible.value = false;
};

const onClickSaveConfirm = async () => {
  let result = await reqAddOrUpdateKnowledge(knowledgeParams.value);
  if (result.code == 200) {
    dialogFormVisible.value = false;
    ElMessage({
      type: "success",
      message: knowledgeParams.value.id ? "修改成功" : "编辑成功",
    });
    getAllKnowledge();
  } else {
    ElMessage({
      type: "error",
      message: knowledgeParams.value.id ? "修改失败" : "编辑失败",
    });
    dialogFormVisible.value = false;
  }
};
</script>

<template>
  <div style="padding: 20px;">
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="角色档案" />
      <el-step title="基础设定" />
      <el-step title="高级设定" />
      <el-step title="宇宙观设定" />
      <el-step title="模型设置" />
    </el-steps>
    <div class="role-box" v-show="active == 0">
      <div class="role-container">
        <h3 class="role-title">角色档案</h3>
        <div class="role-form">
          <el-form label-position="top" :model="roleForm">
            <el-form-item label="名称">
              <el-input v-model="roleForm.name" placeholder="请输入名称" />
              <p v-show="regRule" style="color: red;margin: 0;font-size: 12px;">名称不可缺少!</p>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="roleForm.sex" class="m-2" placeholder="请选择性别">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄阶段">
                  <el-select v-model="roleForm.age_stage" class="m-2" placeholder="请选择年龄阶段">
                    <el-option v-for="item in ageStage" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="别称">
              <div class="tag">
                <el-tag v-for="tag in aliasTages" :key="tag" class="mx-1" closable :disable-transitions="false"
                  @close="handleAliasClose(tag)">
                  {{ tag }}
                </el-tag>
                <el-input v-if="aliasInputVisible" ref="AliasInputRef" v-model="aliasInputValue" class="ml-1 w-20"
                  size="small" @keyup.enter="handleAliasInputConfirm" @blur="handleAliasInputConfirm" />
                <el-button v-else class="button-new-tag ml-1" size="small" @click="showAliasInput">
                  + 新增
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="身份">
              <div class="tag">
                <el-tag v-for="tag in identityTags" :key="tag" class="mx-1" closable :disable-transitions="false"
                  @close="handleIdentityClose(tag)">
                  {{ tag }}
                </el-tag>
                <el-input v-if="identityInputVisible" ref="IdentityInputRef" v-model="identityInputValue"
                  class="ml-1 w-20" size="small" @keyup.enter="handleIdentityInputConfirm"
                  @blur="handleIdentityInputConfirm" />
                <el-button v-else class="button-new-tag ml-1" size="small" @click="showIndentityInput">
                  + 新增
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="兴趣爱好">
              <div class="tag">
                <el-tag v-for="tag in hobbyTags" :key="tag" class="mx-1" closable :disable-transitions="false"
                  @close="handleHobbyClose(tag)">
                  {{ tag }}
                </el-tag>
                <el-input v-if="hobbyInputVisible" ref="HobbyInputRef" v-model="hobbyInputValue" class="ml-1 w-20"
                  size="small" @keyup.enter="handleHobbyInputConfirm" @blur="handleHobbyInputConfirm" />
                <el-button v-else class="button-new-tag ml-1" size="small" @click="showHobbyInput">
                  + 新增
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="role-box" v-show="active == 1">
      <div class="role-container">
        <h3 class="role-title">基础设定</h3>
        <div class="basic-form">
          <el-form label-position="top" :model="basicForm">
            <el-form-item label="核心设定">
              <el-input v-model="basicForm.per_description" :autosize="{ minRows: 6, maxRows: 10 }" type="textarea"
                placeholder="Tips：⻆⾊的基础内容，包括背景故事、⾝份特征、⾏为或习惯" />
            </el-form-item>
            <el-form-item label="缺陷">
              <el-input v-model="basicForm.flaw" :autosize="{ minRows: 4, maxRows: 10 }" type="textarea"
                placeholder="请输入" />
            </el-form-item>
            <el-form-item label="动机">
              <el-input v-model="basicForm.incentive" :autosize="{ minRows: 4, maxRows: 10 }" type="textarea"
                placeholder="请输入" />
            </el-form-item>
            <el-form-item label="声音特征">
              <el-select class="m-2" placeholder="声音特征" disabled>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="role-box" v-show="active == 2">
      <div class="role-container">
        <h3 class="role-title">高级设定</h3>
        <div class="senior-form">
          <el-form label-position="top" :model="seniorForm">
            <el-form-item label="性格特征">
              <div class="tag">
                <el-tag v-for="tag in personalityTags" :key="tag" class="mx-1" closable :disable-transitions="false"
                  @close="handlePersonalityClose(tag)">
                  {{ tag }}
                </el-tag>
                <el-input v-if="personalityInputVisible" ref="PersonalityInputRef" v-model="personalityInputValue"
                  class="ml-1 w-20" size="small" @keyup.enter="handlePersonalityInputConfirm"
                  @blur="handlePersonalityInputConfirm" />
                <el-button v-else class="button-new-tag ml-1" size="small" @click="showPersonalityInput">
                  + 新增
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="性格维度">
              <div class="dimension-box">
                <el-row>
                  <el-col :span="12">
                    <div class="dimension-content">
                      <span>内向</span>
                      <el-slider :show-tooltip="notShow" :min="0" :max="10" :step="1" v-model="seniorForm.dimension[0]" />
                      <span>外向</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="dimension-content">
                      <span>不安全感</span>
                      <el-slider :show-tooltip="notShow" :min="0" :max="10" :step="1" v-model="seniorForm.dimension[1]" />
                      <span>自信</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <div class="dimension-content">
                      <span>女性化</span>
                      <el-slider :show-tooltip="notShow" :min="0" :max="10" :step="1" v-model="seniorForm.dimension[2]" />
                      <span>男性化</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="dimension-content">
                      <span>佛系</span>
                      <el-slider :show-tooltip="notShow" :min="0" :max="10" :step="1" v-model="seniorForm.dimension[3]" />
                      <span>积极</span>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <div class="dimension-content">
                      <span>保守</span>
                      <el-slider :show-tooltip="notShow" :min="0" :max="10" :step="1" v-model="seniorForm.dimension[4]" />
                      <span>开放</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="dimension-content">
                      <span>情绪稳定</span>
                      <el-slider :show-tooltip="notShow" :min="0" :max="10" :step="1" v-model="seniorForm.dimension[5]" />
                      <span>敏感</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="个人知识">
              <el-input v-model="seniorForm.knowledge" :autosize="{ minRows: 4, maxRows: 10 }" type="textarea"
                placeholder="Tips：⼀⾏填写⼀个知识" />
            </el-form-item>
            <el-form-item label="说话风格">
              <el-input v-model="seniorForm.style" :autosize="{ minRows: 4, maxRows: 10 }" type="textarea"
                placeholder="Tips：说话⻛格⽰例" />
            </el-form-item>
            <el-form-item>
              <el-row style="width: 100%">
                <el-col :span="12">
                  <div class="switch-box">
                    <span>长期记忆</span>
                    <el-switch v-model="seniorForm.long_term_memory" inline-prompt active-text="开启" inactive-text="关闭"
                      @change="handleLongChange" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="switch-box">
                    <span>用户关系</span>
                    <el-switch v-model="seniorForm.relationships" inline-prompt active-text="开启" inactive-text="关闭"
                      @change="handleRelationshipsChange" />
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="role-box" v-show="active == 3">
      <div class="role-container">
        <h3 class="role-title">宇宙观设定</h3>
        <div class="knowledge-wrapper">
          <p>背景核心描述</p>
          <el-input v-model="background" :autosize="{ minRows: 4, maxRows: 10 }" type="textarea" placeholder="请输入" />
          <div class="knowledge-top">
            <span>知识库</span>
            <el-button type="primary" :icon="Plus" @click="onClickAddKnowledges">新增知识库</el-button>
          </div>
          <div class="knowledge-box">
            <ul>
              <li v-for="item in knowledges" :key="item.id">
                <div class="custom-table">
                  <div class="knowledge-name">
                    <el-checkbox size="large" :label="item.name" v-model="item.checked" :value="item.id"
                      @change="handleChecked(item)" />
                  </div>
                  <div>
                    <el-button type="primary" @click="onClickUpdateKnowledges(item)">编辑</el-button>

                    <el-popconfirm :title="`您确定要删除${item.name}吗?`" width="300px" @confirm="onClickDeleteBtn(item.id)"
                      @cancel="onClickCancelBtn">
                      <template #reference>
                        <el-button type="danger">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="role-box" v-show="active == 4">
      <div class="role-container">
        <h3 class="role-title">模型设置</h3>
        <div class="model-setting">
          <div class="model-slider">
            <span>最大单词数</span>
            <el-slider v-model="tokens_to_generate" :min="1" :max="16384" show-input />
          </div>
          <div class="model-slider">
            <span>保留词比例</span>
            <el-slider v-model="temperature" :min="0.1" :max="1" :step="0.1" show-input />
          </div>
          <div class="model-slider">
            <span>随机数</span>
            <el-slider v-model="top_p" :min="0.1" :max="1" :step="0.1" show-input />
          </div>
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <el-button type="primary" @click="active--" :disabled="active == 0" typ>上一步</el-button>
      <el-button type="primary" @click="onClickRegForm" :disabled="active == 4">下一步</el-button>
      <!-- <el-button type="primary" @click="active++" :disabled="active == 4">下一步</el-button> -->
      <el-button type="primary" @click="onClickConfirm" v-show="active == 4">保存</el-button>
    </div>
  </div>
  <el-dialog width="60%" v-model="dialogFormVisible" :title="knowledgeParams.id ? '编辑知识库' : '新增知识库'" center>
    <div class="dialog-form">
      <el-form label-position="top">
        <el-form-item label="知识库名称">
          <el-input placeholder="请输入名称" v-model="knowledgeParams.name"></el-input>
        </el-form-item>
        <el-form-item label="描述（选填）">
          <el-input v-model="knowledgeParams.description" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"
            placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="具体知识">
          <el-input v-model="knowledgeParams.info" :autosize="{ minRows: 4, maxRows: 10 }" type="textarea"
            placeholder="Tips：⼀⾏⼀个知识" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="onClickCancel">取消</el-button>
      <el-button type="primary" @click="onClickSaveConfirm"> 保存 </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.role-box {
  width: 80%;
  margin: 0 auto;

  .role-container {
    width: 50%;
    margin: 0 auto;

    .role-title {
      text-align: center;
    }

    .tag {
      width: 100%;
      border: 1px solid #dcdfe6;
    }

    .dimension-box {
      width: 100%;

      .dimension-content {
        display: flex;
        align-items: center;
        justify-content: center;

        .el-slider {
          width: 200px;
          margin: 0 15px;
        }
      }
    }

    .switch-box {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}

.model-setting {
  margin: 0 auto;

  .model-slider {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;

    & span {
      display: block;
      width: 15%;
    }

    .el-slider {
      width: 400px;
    }
  }
}

.knowledge-wrapper {
  width: 800px;

  .knowledge-top {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .knowledge-box {
    ul {
      margin: 0;
      padding: 0;

      li {
        list-style: none;
        border: 1px solid #dcdfe6;
        margin-bottom: 10px;
        padding: 0 10px;

        .custom-table {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .knowledge-name {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
  }
}

.dialog-form {
  width: 80%px;
  margin: 0 auto;
}

.footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.mx-1 {
  margin-left: 10px;
}

.ml-1 {
  margin-left: 10px;
}

.w-20 {
  width: 100px;
}
</style>

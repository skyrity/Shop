<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示信息栏 -->
      <el-alert
        title="注意：只允许为第三分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选中商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectCategorieKeys"
            :options="categorieList"
            :props="{
              expandTrigger: 'hover',
              label: 'name',
              value: 'id',
              children: 'children',
              checkStrictly: false
            }"
            @change="handleCategorieChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 参数选中页签  -->
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <!-- 动态参数区域 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮区域 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 参数显示表格区域 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 扩展区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.vals"
                  :key="index"
                  closable
                  @close="tagClose(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.tagInputVisible"
                  v-model="scope.row.tagInputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleTagInputConfirm(scope.row)"
                  @blur="handleTagInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showTagInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editAttributeDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteAttributeDialog(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数区域 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >

          <el-table :data="onlyTabData" border stripe>
            <!-- 静态属性扩展区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.vals"
                  :key="index"
                  closable
                  @close="tagClose(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.tagInputVisible"
                  v-model="scope.row.tagInputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleTagInputConfirm(scope.row)"
                  @blur="handleTagInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showTagInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editAttributeDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteAttributeDialog(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttribute">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttribute">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表
      categorieList: [],
      // 选中的商品列表id
      selectCategorieKeys: [],
      activeTabName: 'many',
      attributeList: '',
      // 动态参数数据
      manyTabData: [],
      // 静态参数数据
      onlyTabData: [],
      // 控制增加对话框的显示与否
      addDialogVisible: false,
      addForm: {
        name: ''
      },
      addFormRules: {
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {
        name: ''
      },
      editFormRules: {
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCategroieList()
    console.log('categorieList', this.categorieList)
  },
  computed: {
    isBtnDisabled() {
      return this.selectCategorieKeys.length !== 3
    },
    categorieId() {
      if (this.selectCategorieKeys.length === 3) {
        return this.selectCategorieKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeTabName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    async getCategroieList() {
      const { data: res } = await this.$http.get('categories.do', {
        params: { query: 3 }
      })
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }
      this.categorieList = res.result_data
    },

    // 获取参数的列表数据
    async getParamsData() {
      // 必须保证选中商品分类的第3级
      if (this.selectCategorieKeys.length !== 3) {
        this.selectCategorieKeys = []
        return
      }

      console.log('selectCategorieKeys', this.selectCategorieKeys)

      const { data: res } = await this.$http.get(
        `categories.do/${this.categorieId}/attributes`,
        {
          params: { sel: this.activeTabName }
        }
      )
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }

      res.result_data.forEach(item => {
        if (item.vals) {
          item.vals = item.vals.split(',')
        } else {
          item.vals = []
        }
        item.tagInputVisible = false
        item.tagInputValue = ''
      })

      this.attributeList = res.result_data
      console.log('res.result_data', res.result_data)

      // 动态参数
      if (this.activeTabName === 'many') {
        this.manyTabData = res.result_data
      } else {
        this.onlyTabData = res.result_data
      }
    },
    // 选择商品列表
    handleCategorieChange() {
      this.getParamsData()
    },
    handleTabClick(tab, event) {
      console.log(tab, event)
      this.getParamsData()
    },
    // 编辑动态参数属性
    editAttributeDialog(attribute) {
      this.editForm = attribute
      this.editDialogVisible = true
    },
    // 删除动态参数属性
    async deleteAttributeDialog(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '是否确定永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })

      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        'categories.do/attributes/' + id
      )
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }
      this.getParamsData()
      this.$message.success('删除商品分类成功！')
    },
    // 编辑静态属性
    editOnlyAttribute(attribute) {},
    // 删除静态参数属性
    deleteOnlyAttribute(id) {},

    // 关闭增加参数对话框
    handleAddClose() {},
    async addAttribute() {
      const { data: res } = await this.$http.post(
        `categories.do/${
          this.selectCategorieKeys[this.selectCategorieKeys.length - 1]
        }/attributes`,
        this.$qs.stringify({
          name: this.addForm.name,
          sel: this.activeTabName
        })
      )
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }

      this.$message.success(`增加${this.titleText}成功!`)
      this.getParamsData()
      this.addDialogVisible = false
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    async editAttribute() {
      const { data: res } = await this.$http.put(
        `categories.do/attributes/${this.editForm.id}`,
        this.$qs.stringify({
          name: this.editForm.name
        })
      )
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }

      this.$message.success(`编辑${this.titleText}成功!`)
      this.getParamsData()
      this.editDialogVisible = false
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    handleTagInputConfirm(row) {
      this.editAttributeVals(row)
    },

    async editAttributeVals(row) {
      if (row.tagInputValue.trim().length === 0) {
        row.tagInputValue = ''
        row.tagInputVisible = false
        return
      }
      row.vals.push(row.tagInputValue.trim())
      row.tagInputValue = ''
      row.tagInputVisible = false
      const { data: res } = await this.$http.put(
        `categories.do/attributes/${row.id}`,
        this.$qs.stringify({
          name: row.name,
          vals: row.vals.join(',')
        })
      )
      if (res.result_code !== 0) {
        return this.$message.error('修改参数属性失败！')
      }
      this.$message.success('修改参数属性成功！')
    },
    showTagInput(row) {
      // console.log(this.$refs)
      row.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },

    tagClose(row, i) {
      // 删除数组元素
      row.vals.splice(i, 1)
      this.editAttributeVals(row)
    }
  }
}
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}

.el-tag + .el-tag {
  margin-left: 15px;
}
.button-new-tag {
  margin-left: 15px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 15px;
  vertical-align: bottom;
}
</style>

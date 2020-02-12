<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      <tree-table
        :data="categorieList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        stripe
        :show-row-hover="false"
      >
        <!-- 是否有效模板 -->
        <template slot="isActive" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.delete"></i>
          <i class="el-icon-error" v-if="!scope.row.delete"></i>
        </template>
        <!-- 排序 -->
        <template slot="level" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.level == 0"
            >一级</el-tag
          >
          <el-tag type="success" size="mini" v-if="scope.row.level == 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-if="scope.row.level == 2"
            >三级</el-tag
          >
        </template>

        <!-- 操作模板 -->
        <template slot="options" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editCategorieDialog(scope.row)"
            size="mini"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCategorie(scope.row.id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageIndex"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddClose"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectParentCategorieKeys"
            :options="parentCategorieList"
            :props="{
              expandTrigger: 'hover',
              label: 'name',
              value: 'id',
              children: 'children',
              checkStrictly: true
            }"
            @change="handleParentCategorieChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategorie">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商品分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditClose"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategorie">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表数据
      categorieList: [],
      // 查询条件对象
      queryInfo: {
        query: '3',
        pageIndex: 1,
        pageSize: 5
      },
      // 总记录条数
      total: 0,
      columns: [
        { label: '分类名称', prop: 'name' },
        { label: '是否有效', type: 'template', template: 'isActive' },
        { label: '排序', type: 'template', template: 'level' },
        { label: '操作', type: 'template', template: 'options' }
      ],
      // 是否显示添加商品分类对话框
      addDialogVisible: false,
      addForm: {
        name: '',
        pid: 0,
        level: 0
      },
      addFormRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级商品列表
      parentCategorieList: [],
      // 被选择的父级商品列表选项 ids
      selectParentCategorieKeys: [],
      // 是否显示编辑商品分类对话框
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCategorieList()
  },
  methods: {
    // 获得商品分类列表
    async getCategorieList() {
      const { data: res } = await this.$http.get('categories.do', {
        params: this.queryInfo
      })
      if (res.result_code !== 0) {
        return this.$message.error('获得商品分类失败！')
      }
      this.categorieList = res.result_data.dataList
      this.total = res.result_data.totalRecord
    },
    // 点击商品分类编辑按钮
    editCategorieDialog(categorie) {
      this.editForm = categorie
      this.editDialogVisible = true
    },
    // 改变分页大小
    handleSizeChange(newSize) {
      console.log('页面大小：' + newSize)
      this.queryInfo.pageSize = newSize
      this.getCategorieList()
    },
    // 改变页码
    handleCurrentChange(currentPage) {
      console.log('当前页：' + currentPage)
      this.queryInfo.pageIndex = currentPage
      this.getCategorieList()
    },
    // 显示增加分类对话框
    showAddDialog() {
      // 获得数据
      this.getParentCategorieList()
      this.addDialogVisible = true
    },
    handleAddClose() {
      console.log('handleAddClose', this.$refs.addFormRef)
      this.$refs.addFormRef.resetFields()
      this.selectParentCategorieKeys = []
      this.addForm.level = 0
      this.addForm.pid = 0
    },

    // 获得父级的商品列表
    async getParentCategorieList() {
      const { data: res } = await this.$http.get('categories.do', {
        params: { query: 2 }
      })
      console.log('getParentCategorieList', res)
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }
      this.parentCategorieList = res.result_data
    },

    // 修改父级分类选择
    handleParentCategorieChange() {
      console.log('handleParentCategorieChange', this.selectParentCategorieKeys)
      // 如果length>0证明已经选中父级分类
      if (this.selectParentCategorieKeys.length > 0) {
        // eslint-disable-next-line standard/computed-property-even-spacing
        this.addForm.pid = this.selectParentCategorieKeys[
          this.selectParentCategorieKeys.length - 1
        ]
        this.addForm.level = this.selectParentCategorieKeys.length
      } else {
        this.addForm.pid = 0
        this.addForm.level = 0
      }
      console.log('handleParentCategorieChange', this.addForm)
    },
    // 增加商品分类操作
    addCategorie() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return

        const { data: res } = await this.$http.post(
          'categories.do',
          this.addForm
        )
        if (res.result_code !== 0) {
          return this.$message.error(res.result_msg)
        }
        this.getCategorieList()
        this.addDialogVisible = false
        this.$message.success('增加分类成功！')
      })
    },
    // 编辑商品分类操作
    editCategorie() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return

        const { data: res } = await this.$http.put(
          'categories.do/' + this.editForm.id,
          { name: this.editForm.name }
        )
        if (res.result_code !== 0) {
          return this.$message.error(res.result_msg)
        }
        this.getCategorieList()
        this.editDialogVisible = false
        this.$message.success('编辑分类成功！')
      })
    },
    handleEditClose() {
      console.log('handleEditClose', this.$refs.editFormRef)
      this.$refs.editFormRef.resetFields()
    },
    // 删除商品分类操作
    async deleteCategorie(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '是否确定永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.delete('categories.do/' + id)
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }
      this.getCategorieList()
      this.$message.success('删除商品分类成功！')
    }
  }
}
</script>

<style lang="less" scoped>
.el-icon-success {
  color: lightgreen;
}
.el-icon-error {
  color: red;
}
.el-cascader {
  width: 100%;
}
</style>

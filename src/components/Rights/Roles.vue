<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="addRoleDialog">添加角色</el-button>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcentter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcentter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="角色描述" prop="memo"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSettingDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 增加角色的对话框 -->
    <el-dialog
      title="增加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="handleAddRoleDialogClose"
    >
      <!-- 对话框内容主体区域 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="说明" prop="memo">
          <el-input v-model="addRoleForm.memo"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="handleEditRoleDialogClose"
    >
      <!-- 对话框内容主体区域 -->
      <el-form :model="editRoleForm" ref="editRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editRoleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="说明" prop="memo">
          <el-input v-model="editRoleForm.memo"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="settingDialogVisible"
      width="50%"
      @close="handleSettingDialogClose"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="deffKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      // 是否显示分配权限对话框
      settingDialogVisible: false,
      // 权限树形列表数据
      rightList: [],

      treeProps: {
        children: 'children',
        label: 'authName'
      },

      // 默认选择的节点数组id
      deffKeys: [],
      // 保存当前选择的角色id
      roleId: '',
      // 是否显示增加对话窗口
      addRoleDialogVisible: false,
      // 增加角色窗口数据
      addRoleForm: {},
      addRoleFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      editRoleForm: {},
      // 是否显示编辑对话窗口
      editRoleDialogVisible: false
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles.do')
      if (res.result_code !== 0) {
        this.$message.error('获取角色列表失败！')
      }

      this.roleList = res.result_data
    },
    // 显示编辑对话框
    showEditDialog(role) {
      console.log('显示编辑对话框(待完成)')
      this.editRoleForm = role
      this.editRoleDialogVisible = true
    },
    // 删除角色操作
    showDelete(role) {
      console.log('删除角色操作(待完成)')
    },
    // 显示分配权限对话框
    async showSettingDialog(role) {
      const { data: res } = await this.$http.get('rights.do/tree')
      if (res.result_code !== 0) {
        return this.$message.error('获取权限树形信息列表失败！')
      }
      this.rightList = res.result_data
      // 获得所在角色的权限数组
      this.getLeafKeys(role, this.deffKeys)
      this.roleId = role.id
      console.log(res)
      this.settingDialogVisible = true
    },
    handleSettingDialogClose() {
      this.deffKeys = []
    },
    // 根据Id删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除！')
      }
      console.log('确认了删除！roleId=' + role.id + ',rightId=' + rightId)
      const { data: res } = await this.$http.delete(
        `roles.do/${role.id}/rightId/${rightId}`
      )
      if (res.result_code !== 0) {
        return this.$message.info('删除角色权限失败！')
      }
      role.children = res.result_data.children
      console.log('roleList.children', role.children)
      console.log('res.result_data.children', res.result_data.children)
    },
    getLeafKeys(node, arr) {
      if (node.level === 2) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        return this.getLeafKeys(item, arr)
      })
    },
    // 增加角色权限处理
    async addRoleRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log('keys', keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles.do/${this.roleId}/rightIds/${idStr}`
      )
      if (res.result_code !== 0) {
        return this.$message.error('分配角色权限失败！')
      }
      this.$message.success('分配角色权限成功！')
      this.getRoleList()
      this.settingDialogVisible = false
    },
    // 打开增加角色对话框
    addRoleDialog() {
      // 让增加角色对话框显示
      this.addRoleDialogVisible = true
    },
    // 关闭角色对话框处理函数
    handleAddRoleDialogClose() {},
    // 增加角色
    async addRole() {
      console.log('addRoleForm', this.addRoleForm)
      const { data: res } = await this.$http.post('roles.do', this.addRoleForm)

      if (res.result_code !== 0) {
        return this.$message.error('增加角色失败！')
      }
      this.$message.success('增加角色成功！')
      this.addRoleDialogVisible = false
      this.getRoleList()
    },

    // 编辑角色
    async editRole() {
      console.log('editRoleForm', this.editRoleForm)
      const { data: res } = await this.$http.put(
        `roles.do/${this.editRoleForm.id}`,
        {
          name: this.editRoleForm.name,
          memo: this.editRoleForm.memo
        }
      )

      if (res.result_code !== 0) {
        return this.$message.error('编辑角色失败！')
      }
      this.$message.success('编辑角色成功！')
      this.editRoleDialogVisible = false
      this.getRoleList()
    },
    // 删除角色
    async deleteUser(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '是否确定永久删除该角色, 是否继续?',
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
      const { data: res } = await this.$http.delete('roles.do/' + id)
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }
      this.getRoleList()
      this.$message.info('完成删除！')
    },
    handleEditRoleDialogClose() {
      this.editRoleForm = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcentter {
  display: flex;
  align-items: center;
}
</style>

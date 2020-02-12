<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="userName" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="roleName" label="角色"> </el-table-column>
        <el-table-column prop="state" label="状态">
          <!-- 作用域插槽，可以获得该列数据 -->
          <template slot-scope="item">
            <!-- {{ item.row }} -->
            <el-switch
              v-model="item.row.state"
              @change="userStateChange(item.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="item">
            <!-- 修改按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(item.row)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="showDeleteDialog(item.row)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showRoleDialog(item.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageIndex"
        :page-sizes="[10, 30, 60, 100]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.password"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 編輯用户的对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名称">
          <el-input v-model="editForm.userName" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="当前的用户">
          <el-input v-model="editRoleForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前的角色">
          <el-input v-model="editRoleForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表得参数对象
      queryInfo: {
        query: '',
        pageIndex: 1,
        pageSize: 30
      },
      //   总记录数
      total: 0,
      //   总页数
      totalPage: 0,
      //   用户列表
      userList: [],
      //   控制添加用户对话框的显示与隐藏
      addDialogVisible: false,

      //   添加表单的数据
      addForm: {
        userName: '',
        password: '',
        mobile: '',
        email: ''
      },

      // 添加表单的验证规则
      addFormRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      //   控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      //   编辑表单的数据
      editForm: {},
      editFormRules: {
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 角色列表
      roleList: [],
      // 选择的角色id值
      selectedRoleId: '',

      // 显示用户分配角色对话框
      editRoleDialogVisible: false,
      editRoleForm: {},
      editRoleFormRules: {}
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users.do', {
        params: this.queryInfo
      })
      console.log('users.do', res)
      if (res.result_code !== 0) {
        this.$message.error('获取用户列表失败！')
      }
      this.total = res.result_data.totalRecord
      this.totalPage = res.result_data.totolPage
      this.userList = res.result_data.dataList
    },
    // 监听分页大小变化
    handleSizeChange(newSize) {
      console.log('页面大小：' + newSize)
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // currentPage 改变时会触发
    handleCurrentChange(currentPage) {
      console.log('当前页：' + currentPage)
      this.queryInfo.pageIndex = currentPage
      this.getUserList()
    },
    // 监听Switch 开关状态的改变
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users.do/${userInfo.id}/state/${userInfo.state}`
      )
      if (res.result_code !== 0) {
        userInfo.state = !userInfo.state
        return this.$message.error('修改用户状态失败！')
      }
      this.$message.success('修改用户状态成功！')
    },
    // 添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 增加用户
    addUser() {
      this.$refs['addFormRef'].validate(async valid => {
        console.log(valid)
        if (!valid) return

        // 发起添加用户的网络请求
        const { data: res } = await this.$http.post('users.do', this.addForm)
        console.log('adduser', res)
        if (res.result_code !== 0) {
          return this.$message.error(res.result_msg)
        }
        this.$message.success('增加用户成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 点击编辑按钮弹出编辑框
    showEditDialog(userInfo) {
      console.log('点击编辑按钮,id')
      this.editForm = userInfo
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        console.log('editUser.validate', valid)
        if (!valid) return
        // 发起编辑用户的网络请求
        const { data: res } = await this.$http.put(
          'users.do/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        console.log('edituser', res)
        if (res.result_code !== 0) {
          return this.$message.error(res.result_msg)
        }
        this.$message.success('编辑用户成功！')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 根据Id删除对应用户信息
    async showDeleteDialog(userInfo) {
      this.editForm = userInfo
      console.log('editForm', this.editForm)
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '是否确定永久删除该用户, 是否继续?',
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
        'users.do/' + this.editForm.id
      )
      if (res.result_code !== 0) {
        return this.$message.error(res.result_msg)
      }
      this.getUserList()
      this.$message.info('完成删除！')
    },
    // 点击按钮分配用户角色
    async editUserRole() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的新角色！')
      }
      console.log('user', this.editRoleForm)
      const { data: res } = await this.$http.post(
        `users.do/${this.editRoleForm.id}/roleId/${this.selectedRoleId}`
      )
      if (res.result_code !== 0) {
        return this.$message.error('用户分配新角色失败！')
      }
      console.log('users.do', res)
      this.$message.success('用户分配新角色成功！')
      this.editRoleDialogVisible = false
      this.getUserList()
    },
    // 显示分配用户角色对话框
    async showRoleDialog(user) {
      console.log(user)
      this.editRoleForm = user
      const { data: res } = await this.$http.get('roles.do')
      if (res.result_code !== 0) {
        return this.$message.error('获得角色列表失败！')
      }
      this.roleList = res.result_data
      this.editRoleDialogVisible = true
    },
    // 关闭用户分配角色对话框触发的事件
    editRoleDialogClosed() {
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped></style>

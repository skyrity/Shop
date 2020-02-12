<template>
  <div class="login_container">
    <div class="login_box">
      <!--头部区域 -->
      <div class="avator_box">
        <img src="../assets/logo.png" alt="图标" />
      </div>
      <!--登录表单区域 -->

      <el-form
        ref="loginformRef"
        :model="loginform"
        :rules="rules"
        label-width="0px"
        class="login_form"
      >
        <!--form 用户名 -->
        <el-form-item prop="userName">
          <el-input
            v-model="loginform.userName"
            prefix-icon="iconfont iconseeuser"
          ></el-input>
        </el-form-item>
        <!--form 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginform.password"
            type="password"
            prefix-icon="iconfont iconlock"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!--form 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginform: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset() {
      console.log(this)
      // 重置操作
      this.$refs.loginformRef.resetFields()
    },
    login() {
      this.$refs.loginformRef.validate(async valid => {
        console.log(valid)
        // eslint-disable-next-line no-useless-return
        if (!valid) {
          return
        }
        // 提交请求
        console.log('loginform', this.loginform)
        var res
        await this.$http
          .post('/login.do', this.loginform)
          .then(ret => {
            res = ret.data
          })
          .catch(err => {
            console.log(err)
            this.$message.error('登录失败！' + err)
          })

        console.log(res)
        if (res.result_code !== 0) {
          return this.$message.error('登录失败！' + res.result_msg) // console.log(res.result_msg)
        }
        // console.log(res.result_msg)
        this.$message.success('登录成功！')
        window.sessionStorage.setItem(
          'accessToken',
          res.result_data.accessToken
        )
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avator_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <el-container class="home-container">
    <!--头部区域 -->
    <el-header>
      <div>
        <img src="../assets/images/SkyLogo.png" alt="Sky图标" />
        <span>实开瑞德电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主题区域-->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏收缩按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单页面 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse-transititrueon="false"
          :collapse="isCollapse"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="'' + item.id"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主内容区域 -->
      <el-main>
        <!-- 主界面的路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        '101': 'iconfont iconusers',
        '102': 'iconfont iconkongjian',
        '103': 'iconfont iconshangpin',
        '104': 'iconfont icondanju-tianchong',
        '105': 'iconfont iconbaobiao'
      },
      isCollapse: false,
      // 被激活的连接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus.do')
      console.log('menus.do', res)
      if (res.result_code !== 0) {
        return this.$message.error('获得菜单失败！')
      }
      // this.$message.success('获得菜单成功！')
      this.menuList = res.result_data.data
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #373d41;
  .el-menu {
    border-right: 0px;
  }
}

.el-main {
  background-color: #eeffff;
}

body > .el-container {
  margin-bottom: 40px;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

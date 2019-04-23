<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="goout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isshow?'65px':'200px'">
        <div class="toggle_bar" @click="isshow=!isshow">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isshow"
          :collapse-transition="false"
        >
          <el-submenu
            :index="item.id+''"
            :style="{width:isshow?'65px':'200px'}"
            v-for="(item, k) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont ' +iconList[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="item.id+'-'+item2.id"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
            <!-- <el-menu-item index="1-2">选项2</el-menu-item> -->
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    this.getMenuList()
  },
  methods: {
    goout() {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
        })
    },
    async getMenuList() {
      const { data: dt } = await this.$http.get('menus')
      console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.menuList = dt.data
    }
  },
  data() {
    return {
      iconList: [
        'icon-user',
        'icon-tijikongjian',
        'icon-shangpingouwudai2',
        'icon-danju-tianchong',
        'icon-baobiao'
      ],
      isshow: false,
      menuList: []
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    padding-right: 20px;
    .logo-box {
      display: flex;
      font-size: 22px;
      color: #fff;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle_bar {
      height: 25px;
      color: #fff;
      text-align: center;
      line-height: 25px;
      letter-spacing: 0.1em;
      background-color: #4a5064;
      font-size: 12px;
      user-select: none;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>

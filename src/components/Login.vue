<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/img/1.jpg" alt>
      </div>
      <el-form :rules="loginFormRules" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-password"></i>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login()">登陆</el-button>
            <el-button type="info" @click="reset()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    reset() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('/login', this.loginForm)
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          window.sessionStorage.setItem('token', dt.data.token)
          this.$router.push('/home')
        }
      })
    }
  },
  data() {
    return {
      loginFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }]
      },
      loginForm: {
        usrename: '',
        password: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  // background-image: linear-gradient(0deg,skyblue,pink);
  background: url('../assets/img/4.jpg') no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
  .login-box {
    width: 450px;
    height: 304px;
    background-color: transparent;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-button--primary {
      background-image: linear-gradient(30deg, #5e2a94, #fff);
      border-color: #5e2a94;
    }
    .el-button--info {
      background-image: linear-gradient(30deg, hotpink, #fff);
      border-color: #5e2a94;
    }
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
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
  }
}
</style>

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 编辑用户 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editdialogVisible"
        width="800px"
        @close="$refs.editruleForm.resetFields()"
      >
        <el-form :rules="edituserRules" ref="editruleForm" label-width="100px" :model="edituser">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="edituser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="edituser.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="edituser.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edit()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="800px"
        @close="$refs.addruleForm.resetFields()"
      >
        <el-form :rules="adduserRules" ref="addruleForm" label-width="100px" :model="adduser">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adduser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adduser.password"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="adduser.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adduser.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add()">确 定</el-button>
        </span>
      </el-dialog>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="160"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="80">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenume"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    edit() {
      this.$refs.editruleForm.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            'users/' + this.edituser.id,
            this.edituser
          )
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.error(dt.meta.msg)
          this.editdialogVisible = false
          this.getUserList()
        }
      })
    },
    async showEditDialog(id) {
      this.editdialogVisible = true
      const { data: dt } = await this.$http.get('users/' + id)
      // console.log(dt)
      this.edituser = dt.data
    },
    delUser(id) {
      this.$confirm('确定要删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: dt } = await this.$http.delete('users/' + id)
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          this.getUserList()
        })
        .catch(() => {})
    },
    add() {
      this.$refs.addruleForm.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('users', this.adduser)
          // console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.dialogVisible = false
          this.getUserList()
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.querycdt.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.querycdt.pagenum = val
      this.getUserList()
    },
    async getUserList() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.userList = dt.data.users
    }
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      var reg = /^1[356789]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      }
      callback()
    }
    return {
      editdialogVisible: false,
      edituserRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      edituser: {
        username: '',
        mobile: '',
        email: ''
      },
      adduserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      adduser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户
      dialogVisible: false,
      // 总共有多少条信息
      tot: 0,
      userList: [],
      querycdt: {
        query: '', // 模糊查询关键词
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页显示3条数据
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
